import { decodeHTMLAttribute } from 'entities';
import {
  type IAttribute,
  type ITag,
  parse,
  SyntaxKind,
  walk,
} from 'html5parser';
import { resolvedClassMarker } from '../../element';
import { styleToString, toStyleObject } from '../../utils/style';
import type { TailwindRenderContext } from './tailwind-context';

interface Edit {
  start: number;
  end: number;
  text: string;
}

interface ElementWithClasses {
  classAttribute: IAttribute;
  styleAttribute: IAttribute | undefined;
  classes: string[];
}

const escapeAttribute = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const attributeValue = (attribute: IAttribute) =>
  attribute.value ? decodeHTMLAttribute(attribute.value.value) : '';

/** html5parser leaves the value of unquoted attributes out of their range. */
const attributeEnd = (attribute: IAttribute) =>
  Math.max(attribute.end, attribute.value?.end ?? 0);

const findAttribute = (tag: ITag, name: string) =>
  tag.attributes.find(
    (attribute) => attribute.name.value.toLowerCase() === name,
  );

export const headNotFoundError = (classes: string[]) =>
  new Error(
    `Tailwind: <head> not found inside <Tailwind>.
Move <Head /> inside <Tailwind>, or remove these classes that require a <head>: ${classes.join(' ')}.`,
  );

/**
 * Inlines the Tailwind classes left in rendered HTML, which come from plain
 * elements, including the ones rendered by components of your own, and adds
 * the styles that can't be inlined, like media queries, to the `<head>`.
 *
 * Elements from Vuemail's components have already resolved their classes
 * by this point, and what is left on them doesn't match any utility.
 */
export function inlineTailwindIntoHtml(
  html: string,
  context: TailwindRenderContext,
): string {
  const elements: ElementWithClasses[] = [];
  let headContentStart: number | undefined;

  walk(parse(html), {
    enter(node) {
      if (node.type !== SyntaxKind.Tag) return;

      if (node.name === 'head' && headContentStart === undefined) {
        headContentStart = node.open.end;
      }

      const classAttribute = findAttribute(node, 'class');
      if (!classAttribute) return;

      const classes = attributeValue(classAttribute)
        .split(/\s+/)
        .filter(Boolean);
      if (classes.length === 0) return;

      elements.push({
        classAttribute,
        styleAttribute: findAttribute(node, 'style'),
        classes,
      });
    },
  });

  const edits: Edit[] = [];
  const unresolvedElements: ElementWithClasses[] = [];

  for (const element of elements) {
    if (!element.classes.includes(resolvedClassMarker)) {
      unresolvedElements.push(element);
      continue;
    }
    // Resolved by its component already, only the marker has to go
    const classes = element.classes.filter(
      (className) => className !== resolvedClassMarker,
    );
    edits.push({
      start: element.classAttribute.start,
      end: attributeEnd(element.classAttribute),
      text:
        classes.length > 0
          ? `class="${escapeAttribute(classes.join(' '))}"`
          : '',
    });
  }

  context.prepare(unresolvedElements.flatMap((element) => element.classes));

  for (const {
    classAttribute,
    styleAttribute,
    classes,
  } of unresolvedElements) {
    const resolution = context.resolve(classes.join(' '));
    const hasInlinedStyles = Object.keys(resolution.style).length > 0;
    if (!hasInlinedStyles && resolution.className === classes.join(' ')) {
      continue;
    }

    const existingStyle = styleAttribute
      ? attributeValue(styleAttribute).trim().replace(/;+$/, '')
      : '';
    const existingProperties = toStyleObject(existingStyle);
    const tailwindStyle = Object.fromEntries(
      Object.entries(resolution.style).filter(
        ([property]) => !(property in existingProperties),
      ),
    );
    const style = [styleToString(tailwindStyle), existingStyle]
      .filter(Boolean)
      .join(';');

    const classText = resolution.className
      ? `class="${escapeAttribute(resolution.className)}"`
      : '';
    const styleText = style ? `style="${escapeAttribute(style)}"` : '';

    if (styleAttribute) {
      edits.push({
        start: styleAttribute.start,
        end: attributeEnd(styleAttribute),
        text: styleText,
      });
      edits.push({
        start: classAttribute.start,
        end: attributeEnd(classAttribute),
        text: classText,
      });
    } else {
      edits.push({
        start: classAttribute.start,
        end: attributeEnd(classAttribute),
        text: [classText, styleText].filter(Boolean).join(' '),
      });
    }
  }

  const nonInlinableCss = context.getNonInlinableCss();
  if (nonInlinableCss !== '') {
    if (headContentStart === undefined) {
      throw headNotFoundError(context.getNonInlinableClasses());
    }
    edits.push({
      start: headContentStart,
      end: headContentStart,
      text: `<style>${nonInlinableCss}</style>`,
    });
  }

  let result = html;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    let start = edit.start;
    // An attribute that is removed takes the whitespace before it along.
    if (edit.text === '') {
      while (start > 0 && /\s/.test(html.charAt(start - 1))) start--;
    }
    result = result.slice(0, start) + edit.text + result.slice(edit.end);
  }
  return result;
}
