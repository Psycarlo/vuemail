import CodeBase from '@tiptap/extension-code';
import { EmailMark } from '../core/serializer/email-mark';
import { element } from '../utils/element';
import { inlineCssToJs } from '../utils/styles';

export const Code = EmailMark.from(
  CodeBase,
  ({ children, node, style, mark }) =>
    element(
      'code',
      {
        style: {
          ...style,
          ...inlineCssToJs(node.attrs?.style),
          ...inlineCssToJs(mark?.attrs?.style),
        },
      },
      children,
    ),
);
