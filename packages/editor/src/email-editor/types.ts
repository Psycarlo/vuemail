import type { Editor, JSONContent } from '@tiptap/core';

/** What `<EmailEditor>` exposes through a template ref and its callbacks. */
export interface EmailEditorRef {
  getEmail: () => Promise<{ html: string; text: string }>;
  getEmailHTML: () => Promise<string>;
  getEmailText: () => Promise<string>;
  getJSON: () => JSONContent;
  readonly editor: Editor | null;
}
