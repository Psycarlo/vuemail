import { decodeHTMLAttribute } from 'entities';
import {
  type IAttribute,
  type ITag,
  parse,
  SyntaxKind,
  walk,
} from 'html5parser';

/**
 * Every element of some HTML in document order, leaving out the doctype and
 * comments, the markup of Outlook's conditional comments included.
 */
export const getElements = (html: string): ITag[] => {
  const elements: ITag[] = [];
  walk(parse(html), {
    enter(node) {
      if (node.type === SyntaxKind.Tag && !node.name.startsWith('!')) {
        elements.push(node);
      }
    },
  });
  return elements;
};

export const getAttribute = (element: ITag, name: string) =>
  element.attributes.find(
    (attribute) => attribute.name.value.toLowerCase() === name,
  );

/** The decoded value of an attribute, empty for attributes without one. */
export const getAttributeValue = (attribute: IAttribute) =>
  attribute.value ? decodeHTMLAttribute(attribute.value.value) : '';

/** Where the value of an attribute starts, after its quote. */
export const getAttributeValueStart = (attribute: IAttribute) =>
  attribute.value
    ? attribute.value.start + (attribute.value.quote ? 1 : 0)
    : attribute.end;
