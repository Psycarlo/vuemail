<script setup lang="ts">
import { EditorProvider } from '@vuemail/editor';
import { StarterKit } from '@vuemail/editor/extensions';
import { BubbleMenu } from '@vuemail/editor/ui';
import ExampleShell from '~/components/editor/ExampleShell.vue';

const extensions = [StarterKit];

const content = `
  <p>Click on <a href="https://vuemail.dev" target="_blank" rel="noopener noreferrer">this link</a> to see the link bubble menu. You can edit the URL, open the link, or unlink it.</p>
  <p>Try adding more links by selecting text and pressing Cmd+K.</p>
`;
</script>

<template>
  <ExampleShell
    title="Link editing"
    description="Click a link to see the link bubble menu. Select text and press Cmd+K to add links."
  >
    <EditorProvider :extensions="extensions" :content="content">
      <BubbleMenu.LinkDefault />
    </EditorProvider>
  </ExampleShell>
</template>
