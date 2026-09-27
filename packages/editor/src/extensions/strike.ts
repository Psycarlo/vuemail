import type { StrikeOptions } from '@tiptap/extension-strike';
import StrikeBase from '@tiptap/extension-strike';
import { EmailMark } from '../core/serializer/email-mark';
import { element } from '../utils/element';

export const Strike: EmailMark<StrikeOptions, any> = EmailMark.from(
  StrikeBase,
  ({ children, style }) => element('s', { style }, children),
);
