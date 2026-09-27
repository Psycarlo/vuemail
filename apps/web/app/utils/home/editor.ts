// The email editor of the home page: its initial content and what its
// toolbar does, like upstream's `sections/editor-toolbar.tsx`.
import type { Editor, JSONContent } from '@tiptap/core';
import {
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ListIcon,
  ListOrderedIcon,
  TypeIcon,
} from 'lucide-vue-next';
import type { Component } from 'vue';

export const homeEditorInitialContent: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'container',
      content: [
        {
          type: 'heading',
          attrs: {
            style: 'margin-top: 0px; margin-bottom: 8px;',
            alignment: null,
            class: '',
            level: 2,
          },
          content: [{ type: 'text', text: 'Your editor is live' }],
        },
        {
          type: 'paragraph',
          attrs: { class: 'node-paragraph' },
          content: [
            {
              type: 'text',
              text: 'Everything your users need to write beautiful emails.',
            },
          ],
        },
        {
          type: 'twoColumns',
          attrs: { class: null, columnRatio: '1:1' },
          content: [
            {
              type: 'columnsColumn',
              attrs: { class: null },
              content: [
                {
                  type: 'paragraph',
                  attrs: { alignment: null, class: 'node-paragraph' },
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'bold' }],
                      text: 'For users',
                    },
                  ],
                },
                {
                  type: 'bulletList',
                  attrs: { tight: true, class: null, indent: null },
                  content: [
                    {
                      type: 'listItem',
                      attrs: { class: null },
                      content: [
                        {
                          type: 'paragraph',
                          attrs: {
                            style: null,
                            alignment: null,
                            class: 'node-paragraph',
                          },
                          content: [
                            { type: 'text', text: 'Rich text & headings' },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'listItem',
                      attrs: { class: null },
                      content: [
                        {
                          type: 'paragraph',
                          attrs: {
                            style: null,
                            alignment: null,
                            class: 'node-paragraph',
                          },
                          content: [
                            { type: 'text', text: 'Columns & layouts' },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'listItem',
                      attrs: { class: null },
                      content: [
                        {
                          type: 'paragraph',
                          attrs: {
                            style: null,
                            alignment: null,
                            class: 'node-paragraph',
                          },
                          content: [{ type: 'text', text: 'Buttons & images' }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'columnsColumn',
              attrs: { class: null },
              content: [
                {
                  type: 'paragraph',
                  attrs: { alignment: null, class: 'node-paragraph' },
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'bold' }],
                      text: 'For developers',
                    },
                  ],
                },
                {
                  type: 'bulletList',
                  attrs: { tight: true, class: null, indent: null },
                  content: [
                    {
                      type: 'listItem',
                      attrs: { class: null },
                      content: [
                        {
                          type: 'paragraph',
                          attrs: {
                            style: null,
                            alignment: null,
                            class: 'node-paragraph',
                          },
                          content: [
                            { type: 'text', text: 'Drop-in Vue component' },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'listItem',
                      attrs: { class: null },
                      content: [
                        {
                          type: 'paragraph',
                          attrs: {
                            style: null,
                            alignment: null,
                            class: 'node-paragraph',
                          },
                          content: [
                            { type: 'text', text: 'TypeScript support' },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'listItem',
                      attrs: { class: null },
                      content: [
                        {
                          type: 'paragraph',
                          attrs: {
                            style: null,
                            alignment: null,
                            class: 'node-paragraph',
                          },
                          content: [
                            { type: 'text', text: 'Fully customizable' },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          attrs: { alignment: null, class: 'node-paragraph' },
          content: [
            { type: 'text', text: 'Try it! ', marks: [{ type: 'bold' }] },
            { type: 'text', text: 'Type ' },
            { type: 'text', marks: [{ type: 'code' }], text: '/' },
            {
              type: 'text',
              text: ' to open the command menu and insert any block.',
            },
          ],
        },
        {
          type: 'paragraph',
          attrs: {},
          content: [],
        },
      ],
    },
  ],
};

const SAFE_URL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

export function getUrlFromString(str: string): string | null {
  if (str === '#') return str;
  try {
    const url = new URL(str);
    if (SAFE_URL_PROTOCOLS.has(url.protocol)) return str;
    return null;
  } catch {}
  try {
    if (str.includes('.') && !str.includes(' '))
      return new URL(`https://${str}`).toString();
  } catch {}
  return null;
}

export function setLinkHref(editor: Editor, href: string) {
  if (href.length === 0) {
    editor.chain().unsetLink().run();
    return;
  }
  const { from, to } = editor.state.selection;
  if (from === to) {
    editor
      .chain()
      .extendMarkRange('link')
      .setLink({ href })
      .setTextSelection({ from, to })
      .run();
    return;
  }
  editor.chain().setLink({ href }).run();
}

export function setTextAlignment(editor: Editor, alignment: string) {
  const { from, to } = editor.state.selection;
  const tr = editor.state.tr;
  editor.state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.isTextblock) {
      const prop = 'align' in node.attrs ? 'align' : 'alignment';
      tr.setNodeMarkup(pos, null, { ...node.attrs, [prop]: alignment });
    }
  });
  editor.view.dispatch(tr);
}

export const TOOLBAR_NODE_ITEMS: {
  name: string;
  icon: Component;
  command: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
}[] = [
  {
    name: 'Text',
    icon: TypeIcon,
    command: (editor) =>
      editor
        .chain()
        .focus()
        .clearNodes()
        .toggleNode('paragraph', 'paragraph')
        .run(),
    isActive: (editor) =>
      editor.isActive('paragraph') &&
      !editor.isActive('bulletList') &&
      !editor.isActive('orderedList'),
  },
  {
    name: 'Title',
    icon: Heading1Icon,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 1 }),
  },
  {
    name: 'Heading',
    icon: Heading2Icon,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 2 }),
  },
  {
    name: 'Subheading',
    icon: Heading3Icon,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 3 }),
  },
  {
    name: 'Bullet List',
    icon: ListIcon,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleBulletList().run(),
    isActive: (editor) => editor.isActive('bulletList'),
  },
  {
    name: 'Numbered List',
    icon: ListOrderedIcon,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive('orderedList'),
  },
];
