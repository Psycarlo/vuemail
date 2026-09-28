<script setup lang="ts">
import { EditorProvider } from '@vuemaildev/editor';
import { StarterKit } from '@vuemaildev/editor/extensions';
import {
  defaultSlashCommands,
  SlashCommand,
  type SlashCommandItem,
} from '@vuemaildev/editor/ui';
import { Star } from 'lucide-vue-next';
import { h } from 'vue';
import ExampleShell from '~/components/editor/ExampleShell.vue';

const CUSTOM_COMMAND: SlashCommandItem = {
  title: 'Greeting',
  description: 'Insert a greeting block',
  icon: h(Star, { size: 20 }),
  category: 'Custom',
  searchTerms: ['hello', 'greeting', 'welcome'],
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertContent({
        type: 'paragraph',
        content: [{ type: 'text', text: 'Hello! Welcome to our newsletter.' }],
      })
      .run();
  },
};

// StarterKit includes the column layouts the default commands insert
const extensions = [StarterKit];

const content = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Type / to open the slash command menu. Try searching for "greeting" to find the custom command.',
        },
      ],
    },
  ],
};
</script>

<template>
  <ExampleShell
    title="Slash commands"
    description='Type / to open the command menu. Includes default commands plus a custom "Greeting" command.'
  >
    <EditorProvider :extensions="extensions" :content="content">
      <SlashCommand :items="[...defaultSlashCommands, CUSTOM_COMMAND]" />
    </EditorProvider>
  </ExampleShell>
</template>
