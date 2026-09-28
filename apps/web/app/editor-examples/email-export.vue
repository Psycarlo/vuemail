<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';
import { EditorProvider } from '@vuemaildev/editor';
import { composeVueEmail } from '@vuemaildev/editor/core';
import { StarterKit } from '@vuemaildev/editor/extensions';
import { EmailTheming } from '@vuemaildev/editor/plugins';
import { BubbleMenu } from '@vuemaildev/editor/ui';
import { ref } from 'vue';
import ExampleShell from '~/components/editor/ExampleShell.vue';

const extensions = [StarterKit, EmailTheming];

const content = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'My Email Newsletter' }],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Edit this content, then click ' },
        { type: 'text', marks: [{ type: 'bold' }], text: 'Export HTML' },
        { type: 'text', text: ' to see the generated email markup.' },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'The exported HTML uses Vuemail components and is ready to send.',
        },
      ],
    },
  ],
};

const html = ref('');
const exporting = ref(false);

const handleExport = async (editor: Editor | undefined) => {
  if (!editor) return;
  exporting.value = true;
  try {
    const result = await composeVueEmail({ editor });
    html.value = result.html;
  } finally {
    exporting.value = false;
  }
};
</script>

<template>
  <ExampleShell
    title="Email export"
    description="Edit content and export it as email-ready HTML using composeVueEmail()."
  >
    <EditorProvider
      v-slot="{ editor }"
      :extensions="extensions"
      :content="content"
      :editor-props="{ attributes: { class: 'p-4 bg-white rounded-md' } }"
    >
      <BubbleMenu />
      <div class="mt-4">
        <button
          type="button"
          :disabled="exporting"
          class="px-3 py-1.5 border border-(--re-border) rounded-lg bg-(--re-bg) text-(--re-text) cursor-pointer text-[0.8125rem] hover:bg-(--re-hover) disabled:opacity-50"
          @click="handleExport(editor)"
        >
          {{ exporting ? 'Exporting...' : 'Export HTML' }}
        </button>
        <pre
          v-if="html"
          class="mt-3 w-full p-3 font-mono text-xs bg-(--re-bg) text-(--re-text) border border-(--re-border) rounded-lg whitespace-pre-wrap wrap-break-word select-all"
        >{{ html }}</pre>
      </div>
    </EditorProvider>
  </ExampleShell>
</template>
