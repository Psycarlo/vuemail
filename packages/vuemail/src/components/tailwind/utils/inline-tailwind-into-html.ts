import { decodeHTMLAttribute } from 'entities';
import {
  type IAttribute,
  type INode,
  type ITag,
  parse,
  SyntaxKind,
} from 'html5parser';
import { markdownDataId, resolvedClassMarker } from '../../element';
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
 * Where the `<style>` goes: after the `<meta>` and `<title>` elements the
 * `<head>` starts with, and before everything else in it. That's where React
 * Email's `<style>` ends up, as the first child of the `<head>` that React
 * doesn't hoist above the others.
 */
const styleInsertionPoint = (head: ITag) => {
  let point = head.open.end;
  for (const child of head.body ?? []) {
    if (child.type === SyntaxKind.Text) {
      if (child.value.trim() === '') continue;
      break;
    }
    if (child.name !== 'meta' && child.name !== 'title') break;
    point = child.end;
  }
  return point;
};

/**
 * Inlines the Tailwind classes left in rendered HTML, which come from plain
 * elements, including the ones rendered by components of your own, and adds
 * the styles that can't be inlined, like media queries, to the `<head>`.
 * Like React Email, the `<head>` always gets that `<style>`, even when it
 * ends up empty.
 *
 * Elements from Vuemail's components have already resolved their classes
 * by this point, and what is left on them doesn't match any utility.
 */
export function inlineTailwindIntoHtml(
  html: string,
  context: TailwindRenderContext,
): string {
  const elements: ElementWithClasses[] = [];
  let styleStart: number | undefined;

  const visit = (nodes: INode[]) => {
    for (const node of nodes) {
      if (node.type !== SyntaxKind.Tag) continue;

      if (node.name === 'head' && styleStart === undefined) {
        styleStart = styleInsertionPoint(node);
      }

      const classAttribute = findAttribute(node, 'class');
      const classes = classAttribute
        ? attributeValue(classAttribute).split(/\s+/).filter(Boolean)
        : [];
      if (classAttribute && classes.length > 0) {
        elements.push({
          classAttribute,
          styleAttribute: findAttribute(node, 'style'),
          classes,
        });
      }

      // What <Markdown> renders is HTML of its own, which React Email leaves
      // as it is, since it never goes through React
      const dataId = findAttribute(node, 'data-id');
      if (dataId && attributeValue(dataId) === markdownDataId) continue;

      if (node.body) visit(node.body);
    }
  };
  visit(parse(html));

  const edits: Edit[] = [];
  const resolvedElements: ElementWithClasses[] = [];
  const unresolvedElements: ElementWithClasses[] = [];

  for (const element of elements) {
    if (element.classes.includes(resolvedClassMarker)) {
      resolvedElements.push(element);
    } else {
      unresolvedElements.push(element);
    }
  }

  context.prepare(unresolvedElements.flatMap((element) => element.classes));

  for (const element of resolvedElements) {
    // Resolved by its component already, so only the marker has to go, along
    // with the classes that utilities rendered after it gave rules to since.
    const classes = element.classes
      .filter((className) => className !== resolvedClassMarker)
      .map((className) => context.refreshResolvedClass(className));
    edits.push({
      start: element.classAttribute.start,
      end: attributeEnd(element.classAttribute),
      text:
        classes.length > 0
          ? `class="${escapeAttribute(classes.join(' '))}"`
          : '',
    });
  }

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

    // Merged like React Email merges the `style` prop over Tailwind's: the
    // element's own values win, and the properties it shares with Tailwind
    // stay where Tailwind put them.
    const style =
      styleToString({
        ...resolution.style,
        ...(styleAttribute
          ? toStyleObject(attributeValue(styleAttribute))
          : {}),
      }) ?? '';

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
  if (styleStart !== undefined) {
    edits.push({
      start: styleStart,
      end: styleStart,
      text: `<style>${nonInlinableCss}</style>`,
    });
  } else if (nonInlinableCss !== '') {
    throw headNotFoundError(context.getNonInlinableClasses());
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
