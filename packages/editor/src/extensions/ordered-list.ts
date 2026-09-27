import type { OrderedListOptions } from '@tiptap/extension-ordered-list';
import OrderedListBase from '@tiptap/extension-ordered-list';
import { EmailNode } from '../core/serializer/email-node';
import { element } from '../utils/element';
import { inlineCssToJs } from '../utils/styles';

export const OrderedList: EmailNode<OrderedListOptions, any> = EmailNode.from(
  OrderedListBase,
  ({ children, node, style }) =>
    element(
      'ol',
      {
        class: node.attrs?.class || undefined,
        start: node.attrs?.start,
        style: {
          ...style,
          ...inlineCssToJs(node.attrs?.style),
        },
      },
      children,
    ),
);
