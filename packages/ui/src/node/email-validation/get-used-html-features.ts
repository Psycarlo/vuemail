import {
  type CssLocation,
  type CssNode,
  generate,
  parse as parseCss,
  walk as walkCss,
} from 'css-tree';
import { SyntaxKind } from 'html5parser';
import type { SourceLocation, SourcePosition } from '../../shared/types';
import { getAttributeValue, getAttributeValueStart, getElements } from './html';

export interface ElementUsage {
  /** Lowercase, like `table`. */
  name: string;
  location: SourceLocation;
}

export interface AttributeUsage {
  /** Lowercase, like `role`. */
  name: string;
  location: SourceLocation;
}

export interface StylePropertyUsage {
  /** Lowercase, like `border-radius`, or the at-rule for at-rules, like `@media`. */
  name: string;
  /** The value of the property, or the prelude of the at-rule. */
  value: string;
  /** The CSS functions the value calls, like `rgba`. */
  functions: string[];
  /** The units of the value's numbers, like `rem` or `%`. */
  units: string[];
  location: SourceLocation;
}

export interface HtmlFeatures {
  elements: ElementUsage[];
  attributes: AttributeUsage[];
  styleProperties: StylePropertyUsage[];
}

type PositionResolver = (index: number) => SourcePosition;

/** Maps the offsets of a text to their positions in it. */
const createPositionResolver = (text: string): PositionResolver => {
  const lineStarts = [0];
  for (const lineBreak of text.matchAll(/\r\n|\n|\r/g)) {
    lineStarts.push(lineBreak.index + lineBreak[0].length);
  }

  return (index) => {
    let low = 0;
    let high = lineStarts.length - 1;
    while (low < high) {
      const middle = (low + high + 1) >> 1;
      if (lineStarts[middle]! <= index) low = middle;
      else high = middle - 1;
    }
    return { line: low + 1, column: index - lineStarts[low]!, index };
  };
};

const getValueDetails = (value: CssNode) => {
  const functions: string[] = [];
  const units: string[] = [];
  walkCss(value, (node) => {
    if (node.type === 'Function') functions.push(node.name.toLowerCase());
    else if (node.type === 'Dimension') units.push(node.unit.toLowerCase());
    else if (node.type === 'Percentage') units.push('%');
  });
  return { functions, units };
};

/** Collects the declarations and at-rules of some parsed CSS. */
const collectStyleProperties = (
  ast: CssNode,
  toLocation: (loc: CssLocation) => SourceLocation,
  styleProperties: StylePropertyUsage[],
) => {
  walkCss(ast, (node) => {
    if (node.type === 'Declaration' && node.loc) {
      styleProperties.push({
        name: node.property.toLowerCase(),
        value: generate(node.value).trim(),
        ...getValueDetails(node.value),
        location: toLocation(node.loc),
      });
    } else if (node.type === 'Atrule' && node.loc) {
      styleProperties.push({
        name: `@${node.name.toLowerCase()}`,
        value: node.prelude ? generate(node.prelude) : '',
        functions: [],
        units: [],
        // Up to the end of the prelude, the block could span many lines
        location: toLocation({
          ...node.loc,
          end: node.prelude?.loc?.end ?? node.loc.start,
        }),
      });
    }
  });
};

/**
 * Finds the elements, attributes and CSS an email's markup uses, with where
 * they are in it: the declarations of inline styles and `<style>` elements,
 * and the at-rules of the latter.
 *
 * This is what the compatibility checks look for, since a Vue email is best
 * known by the HTML it renders.
 */
export const getUsedHtmlFeatures = (html: string): HtmlFeatures => {
  const resolve = createPositionResolver(html);
  const features: HtmlFeatures = {
    elements: [],
    attributes: [],
    styleProperties: [],
  };

  for (const element of getElements(html)) {
    const nameStart = element.start + 1;
    features.elements.push({
      name: element.name,
      location: {
        start: resolve(nameStart),
        end: resolve(nameStart + element.rawName.length),
      },
    });

    for (const attribute of element.attributes) {
      const name = attribute.name.value.toLowerCase();
      features.attributes.push({
        name,
        location: {
          start: resolve(attribute.name.start),
          end: resolve(attribute.name.end),
        },
      });

      if (name !== 'style' || !attribute.value) continue;

      const valueStart = getAttributeValueStart(attribute);
      const valueStartPosition = resolve(valueStart);
      const value = getAttributeValue(attribute);
      const resolveInValue = createPositionResolver(value);
      // Decoding the character references of the value shortens it, but
      // keeps its line breaks: lines stay exact, while columns and indexes
      // can end up a few characters early.
      const toPosition = (offset: number): SourcePosition => {
        const { line, column } = resolveInValue(offset);
        return {
          line: valueStartPosition.line + line - 1,
          column: line === 1 ? valueStartPosition.column + column : column,
          index: valueStart + offset,
        };
      };
      collectStyleProperties(
        parseCss(value, { context: 'declarationList', positions: true }),
        (loc) => ({
          start: toPosition(loc.start.offset),
          end: toPosition(loc.end.offset),
        }),
        features.styleProperties,
      );
    }

    if (element.name === 'style') {
      for (const child of element.body ?? []) {
        if (child.type !== SyntaxKind.Text) continue;
        collectStyleProperties(
          parseCss(child.value, { positions: true }),
          (loc) => ({
            start: resolve(child.start + loc.start.offset),
            end: resolve(child.start + loc.end.offset),
          }),
          features.styleProperties,
        );
      }
    }
  }

  return features;
};
