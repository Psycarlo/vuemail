<script setup lang="ts">
import { mergeAttributes } from '@tiptap/core';
import type { Editor } from '@tiptap/vue-3';
import { EditorProvider } from '@vuemaildev/editor';
import { EmailNode } from '@vuemaildev/editor/core';
import { StarterKit } from '@vuemaildev/editor/extensions';
import { BubbleMenu } from '@vuemaildev/editor/ui';
import { Info } from 'lucide-vue-next';
import { h } from 'vue';
import ExampleShell from '~/components/editor/ExampleShell.vue';

const Callout = EmailNode.create({
  name: 'callout',
  group: 'block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: 'div[data-type="callout"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'callout',
        style:
          'padding: 12px 16px; background: var(--re-hover); border-left: 3px solid var(--re-text); border-radius: 4px; margin: 8px 0;',
      }),
      0,
    ];
  },

  renderToVueEmail({ children, style }) {
    return h(
      'div',
      {
        style: {
          ...style,
          padding: '12px 16px',
          backgroundColor: '#f4f4f5',
          borderLeft: '3px solid #1c1c1c',
          borderRadius: '4px',
          margin: '8px 0',
        },
      },
      [children],
    );
  },
});

const extensions = [StarterKit, Callout];

const content = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This example shows a custom "Callout" node created with EmailNode.create. Use the toolbar to insert one.',
        },
      ],
    },
    {
      type: 'callout',
      content: [
        {
          type: 'text',
          text: 'This is a callout block — a custom extension!',
        },
      ],
    },
  ],
};

const insertCallout = (editor: Editor) =>
  editor
    .chain()
    .focus()
    .insertContent({
      type: 'callout',
      content: [{ type: 'text', text: 'New callout' }],
    })
    .run();
</script>

<template>
  <ExampleShell
    title="Custom extensions"
    description="A custom Callout node created with EmailNode.create — showing how to extend the editor with email-compatible nodes."
  >
    <EditorProvider :extensions="extensions" :content="content">
      <template #before="{ editor }">
        <div v-if="editor" class="flex gap-2 mb-4">
          <button
            type="button"
            class="flex items-center gap-1.5 px-3 py-1.5 border border-(--re-border) rounded-lg bg-(--re-bg) text-(--re-text) cursor-pointer text-[0.8125rem] hover:bg-(--re-hover)"
            @click="insertCallout(editor)"
          >
            <Info :size="16" />
            Insert Callout
          </button>
        </div>
      </template>
      <BubbleMenu />
    </EditorProvider>
  </ExampleShell>
</template>
