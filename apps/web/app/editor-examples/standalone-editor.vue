<script setup lang="ts">
import { EmailEditor } from 'vuemail-editor';
import ExampleShell from '~/components/editor/ExampleShell.vue';

const content = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is the simplest way to use the editor — a single component with everything pre-wired. Try selecting text to see the bubble menu, or type "/" for slash commands.',
        },
      ],
    },
  ],
};
</script>

<template>
  <ExampleShell
    title="Standalone editor — minimal"
    description="The simplest setup — one component with everything included."
  >
    <EmailEditor class="p-4 bg-white -m-4" :content="content" />
  </ExampleShell>
</template>
