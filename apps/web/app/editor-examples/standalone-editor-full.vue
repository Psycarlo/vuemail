<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { EmailEditor, type EmailEditorRef } from 'vuemail-editor';
import ExampleShell from '~/components/editor/ExampleShell.vue';

const content = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Welcome to the Newsletter' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Edit this content, then use the buttons below to export or inspect the editor output. Try switching themes to see how the editor adapts.',
        },
      ],
    },
  ],
};

const emailEditor = useTemplateRef<EmailEditorRef>('email-editor');
const theme = ref<'basic' | 'minimal'>('basic');
const output = ref('');

const handleExportHtml = async () => {
  if (!emailEditor.value) return;
  output.value = await emailEditor.value.getEmailHTML();
};

const handleGetJson = () => {
  if (!emailEditor.value) return;
  output.value = JSON.stringify(emailEditor.value.getJSON(), null, 2);
};
</script>

<template>
  <ExampleShell
    title="Standalone editor — full features"
    description="Theme switching, ref methods (export, getJSON), and callbacks — all with a single component."
  >
    <div class="flex gap-2 mb-4">
      <button
        type="button"
        class="px-3 py-1.5 border border-(--re-border) rounded-lg bg-(--re-bg) text-(--re-text) cursor-pointer text-[0.8125rem] hover:bg-(--re-hover)"
        @click="theme = theme === 'basic' ? 'minimal' : 'basic'"
      >
        Theme: {{ theme }}
      </button>
      <button
        type="button"
        class="px-3 py-1.5 border border-(--re-border) rounded-lg bg-(--re-bg) text-(--re-text) cursor-pointer text-[0.8125rem] hover:bg-(--re-hover)"
        @click="handleExportHtml"
      >
        Export HTML
      </button>
      <button
        type="button"
        class="px-3 py-1.5 border border-(--re-border) rounded-lg bg-(--re-bg) text-(--re-text) cursor-pointer text-[0.8125rem] hover:bg-(--re-hover)"
        @click="handleGetJson"
      >
        Get JSON
      </button>
    </div>

    <EmailEditor
      ref="email-editor"
      class="p-4 bg-white rounded-md"
      :content="content"
      :theme="theme"
    />

    <pre
      v-if="output"
      class="mt-4 w-full p-3 font-mono text-xs bg-(--re-bg) text-(--re-text) border border-(--re-border) rounded-lg whitespace-pre-wrap wrap-break-word select-all"
    >{{ output }}</pre>
  </ExampleShell>
</template>
