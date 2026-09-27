import type { ParagraphOptions } from '@tiptap/extension-paragraph';
import ParagraphBase from '@tiptap/extension-paragraph';
import { h } from 'vue';
import { EmailNode } from '../core/serializer/email-node';
import { element } from '../utils/element';
import { getTextAlignment } from '../utils/get-text-alignment';
import { inlineCssToJs } from '../utils/styles';

export const Paragraph: EmailNode<ParagraphOptions, any> = EmailNode.from(
  ParagraphBase,
  ({ children, node, style }) => {
    const isEmpty = !node.content || node.content.length === 0;

    return element(
      'p',
      {
        class: node.attrs?.class || undefined,
        style: {
          ...style,
          ...inlineCssToJs(node.attrs?.style),
          ...getTextAlignment(node.attrs?.align || node.attrs?.alignment),
        },
      },
      // Add <br/> inside empty paragraph to make sure what users sees in the preview is the space that will be render in the email
      isEmpty ? h('br') : children,
    );
  },
);
