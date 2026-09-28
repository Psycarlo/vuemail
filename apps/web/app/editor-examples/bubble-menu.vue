<script setup lang="ts">
import { EditorProvider } from 'vuemail-editor';
import { StarterKit } from 'vuemail-editor/extensions';
import { BubbleMenu } from 'vuemail-editor/ui';
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
          text: 'Select this text to see the bubble menu. Try ',
        },
        { type: 'text', marks: [{ type: 'bold' }], text: 'bold' },
        { type: 'text', text: ', ' },
        { type: 'text', marks: [{ type: 'italic' }], text: 'italic' },
        { type: 'text', text: ', and other formatting options.' },
      ],
    },
  ],
};
</script>

<template>
  <ExampleShell
    title="Bubble menu"
    description="Select text to see the default bubble menu with formatting options."
  >
    <EditorProvider :extensions="extensions" :content="content">
      <BubbleMenu />
    </EditorProvider>
  </ExampleShell>
</template>
