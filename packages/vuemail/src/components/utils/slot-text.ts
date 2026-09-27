import { Comment, isVNode, Text, type VNodeChild } from 'vue';

/**
 * Reads the text out of rendered slot content, for components such as
 * `<Preview>` whose content has to be a plain string.
 */
export function getSlotText(nodes: VNodeChild): string {
  if (nodes === null || nodes === undefined || typeof nodes === 'boolean') {
    return '';
  }
  if (typeof nodes === 'string' || typeof nodes === 'number') {
    return String(nodes);
  }
  if (Array.isArray(nodes)) {
    return nodes.map((node) => getSlotText(node as VNodeChild)).join('');
  }
  if (isVNode(nodes)) {
    if (nodes.type === Comment) return '';
    if (nodes.type === Text || typeof nodes.children === 'string') {
      return String(nodes.children ?? '');
    }
    if (Array.isArray(nodes.children)) {
      return getSlotText(nodes.children as VNodeChild);
    }
  }
  return '';
}
