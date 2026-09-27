import type { ItalicOptions } from '@tiptap/extension-italic';
import ItalicBase from '@tiptap/extension-italic';
import { EmailMark } from '../core/serializer/email-mark';
import { element } from '../utils/element';

export const Italic: EmailMark<ItalicOptions, any> = EmailMark.from(
  ItalicBase,
  ({ children, style }) => element('em', { style }, children),
);
