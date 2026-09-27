import type { BlockquoteOptions } from '@tiptap/extension-blockquote';
import BlockquoteBase from '@tiptap/extension-blockquote';
import { EmailNode } from '../core/serializer/email-node';
import { element } from '../utils/element';
import { getTextAlignment } from '../utils/get-text-alignment';
import { inlineCssToJs } from '../utils/styles';

export const Blockquote: EmailNode<BlockquoteOptions, any> = EmailNode.from(
  BlockquoteBase,
  ({ children, node, style }) =>
    element(
      'blockquote',
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
