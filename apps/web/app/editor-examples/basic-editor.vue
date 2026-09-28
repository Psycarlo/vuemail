<script setup lang="ts">
import { EditorProvider } from '@vuemaildev/editor';
import { StarterKit } from '@vuemaildev/editor/extensions';
import ExampleShell from '~/components/editor/ExampleShell.vue';

const extensions = [StarterKit];

const content = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is the simplest editor setup — just StarterKit with no UI overlays. Start typing or edit this text.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'The StarterKit includes all core extensions: paragraphs, headings, lists, tables, code blocks, and more.',
        },
      ],
    },
  ],
};
</script>

<template>
  <ExampleShell
    title="Basic editor"
    description="Minimal setup with StarterKit and no UI overlays."
  >
    <EditorProvider :extensions="extensions" :content="content" />
  </ExampleShell>
</template>
