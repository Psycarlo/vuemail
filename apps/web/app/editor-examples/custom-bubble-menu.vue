<script setup lang="ts">
import { EditorProvider } from '@vuemaildev/editor';
import { StarterKit } from '@vuemaildev/editor/extensions';
import { BubbleMenu } from '@vuemaildev/editor/ui';
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
          text: 'Select text to see a custom bubble menu built from primitives — only bold, italic, underline, and alignment.',
        },
      ],
    },
  ],
};
</script>

<template>
  <ExampleShell
    title="Custom bubble menu"
    description="Building bubble menus from primitives."
  >
    <EditorProvider :extensions="extensions" :content="content">
      <BubbleMenu>
        <BubbleMenu.ItemGroup>
          <BubbleMenu.Bold />
          <BubbleMenu.Italic />
          <BubbleMenu.Underline />
        </BubbleMenu.ItemGroup>
        <BubbleMenu.ItemGroup>
          <BubbleMenu.AlignLeft />
          <BubbleMenu.AlignCenter />
          <BubbleMenu.AlignRight />
        </BubbleMenu.ItemGroup>
      </BubbleMenu>
    </EditorProvider>
  </ExampleShell>
</template>
