import { Text as BaseText } from '@tiptap/extension-text';
import { EmailNode } from '../core/serializer/email-node';

export const Text = EmailNode.from(BaseText, ({ children }) => {
  return children;
});
