<script setup lang="ts">
import { EditorProvider } from '@vuemail/editor';
import { StarterKit } from '@vuemail/editor/extensions';
import { BUTTON, BubbleMenu, SlashCommand } from '@vuemail/editor/ui';
import ExampleShell from '~/components/editor/ExampleShell.vue';

const extensions = [StarterKit];

const content = `
  <p>Click the button below to see its bubble menu. You can edit the button link and text.</p>
  <a class="button" data-id="vuemail-button" href="https://vuemail.dev">Click me</a>
  <p>Use the slash command menu (type /) to insert more buttons.</p>
`;
</script>

<template>
  <ExampleShell
    title="Buttons"
    description="Click the button to edit its link via the button bubble menu."
  >
    <EditorProvider :extensions="extensions" :content="content">
      <BubbleMenu.ButtonDefault />
      <SlashCommand :items="[BUTTON]" />
    </EditorProvider>
  </ExampleShell>
</template>
