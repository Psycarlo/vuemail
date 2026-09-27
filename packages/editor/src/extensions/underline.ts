import type { UnderlineOptions as TipTapUnderlineOptions } from '@tiptap/extension-underline';
import UnderlineBase from '@tiptap/extension-underline';
import { EmailMark } from '../core/serializer/email-mark';
import { element } from '../utils/element';

export type UnderlineOptions = TipTapUnderlineOptions;

export const Underline: EmailMark<TipTapUnderlineOptions, any> = EmailMark.from(
  UnderlineBase,
  ({ children, style }) => element('u', { style }, children),
);
