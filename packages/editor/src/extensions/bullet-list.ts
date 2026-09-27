import type { BulletListOptions } from '@tiptap/extension-bullet-list';
import BulletListBase from '@tiptap/extension-bullet-list';
import { EmailNode } from '../core/serializer/email-node';
import { element } from '../utils/element';
import { inlineCssToJs } from '../utils/styles';

export const BulletList: EmailNode<BulletListOptions, any> = EmailNode.from(
  BulletListBase,
  ({ children, node, style }) =>
    element(
      'ul',
      {
        class: node.attrs?.class || undefined,
        style: {
          ...style,
          ...inlineCssToJs(node.attrs?.style),
        },
      },
      children,
    ),
);
