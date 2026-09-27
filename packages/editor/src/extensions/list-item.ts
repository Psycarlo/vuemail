import type { ListItemOptions } from '@tiptap/extension-list-item';
import ListItemBase from '@tiptap/extension-list-item';
import { EmailNode } from '../core/serializer/email-node';
import { element } from '../utils/element';
import { getTextAlignment } from '../utils/get-text-alignment';
import { inlineCssToJs } from '../utils/styles';

export const ListItem: EmailNode<ListItemOptions, any> = EmailNode.from(
  ListItemBase,
  ({ children, node, style }) =>
    element(
      'li',
      {
        class: node.attrs?.class || undefined,
        style: {
          ...style,
          ...inlineCssToJs(node.attrs?.style),
          ...getTextAlignment(node.attrs?.align || node.attrs?.alignment),
        },
      },
      children,
    ),
);
