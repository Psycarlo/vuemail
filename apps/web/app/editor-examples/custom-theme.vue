<script setup lang="ts">
import type { JSONContent } from '@tiptap/core';
import { EditorProvider } from '@vuemaildev/editor';
import { StarterKit } from '@vuemaildev/editor/extensions';
import {
  createTheme,
  type EditorThemeInput,
  EmailTheming,
  extendTheme,
} from '@vuemaildev/editor/plugins';
import { BubbleMenu } from '@vuemaildev/editor/ui';
import { computed, ref } from 'vue';
import ExampleShell from '~/components/editor/ExampleShell.vue';

const initialContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Custom Theme Demo' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This example shows three approaches to theme customization: extending a built-in theme, creating one from scratch, and using a built-in preset.',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Try switching themes' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Notice how colors, typography, and spacing change between each option.',
        },
      ],
    },
  ],
};

const brandTheme = extendTheme('basic', {
  body: { backgroundColor: '#eff6ff' },
  container: { backgroundColor: '#ffffff' },
  h1: { color: '#1e40af', fontSize: '28px' },
  h2: { color: '#2563eb' },
  link: { color: '#2563eb', textDecoration: 'underline' },
  button: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderRadius: '6px',
  },
});

const darkTheme = createTheme({
  body: { backgroundColor: '#1a1a2e', color: '#e2e8f0' },
  container: {
    backgroundColor: '#16213e',
    color: '#e2e8f0',
    paddingTop: '24px',
    paddingBottom: '24px',
    paddingLeft: '24px',
    paddingRight: '24px',
  },
  h1: { color: '#e2e8f0', fontSize: '28px' },
  h2: { color: '#94a3b8' },
  link: { color: '#60a5fa', textDecoration: 'underline' },
  button: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    borderRadius: '4px',
  },
});

type ThemeOption = 'basic' | 'brand' | 'dark';

const themes: Record<ThemeOption, { label: string; theme: EditorThemeInput }> =
  {
    basic: { label: 'Basic (built-in)', theme: 'basic' },
    brand: { label: 'Brand (extendTheme)', theme: brandTheme },
    dark: { label: 'Dark (createTheme)', theme: darkTheme },
  };

const selected = ref<ThemeOption>('basic');

const extensions = computed(() => [
  StarterKit,
  EmailTheming.configure({ theme: themes[selected.value].theme }),
]);

// Left out of Vue's reactivity on purpose: switching themes creates a new
// editor (see the `key` below), which starts from the latest content
const latest: { content: JSONContent } = { content: initialContent };
</script>

<template>
  <ExampleShell
    title="Custom themes"
    description="Define custom themes with createTheme and extendTheme."
  >
    <div class="flex gap-2 mb-4 flex-wrap">
      <button
        v-for="(option, key) in themes"
        :key="key"
        type="button"
        :class="[
          'px-3 py-1.5 border border-(--re-border) rounded-lg cursor-pointer text-[0.8125rem]',
          selected === key
            ? 'bg-(--re-text) text-(--re-bg) font-medium'
            : 'bg-(--re-bg) text-(--re-text) hover:bg-(--re-hover)',
        ]"
        @click="selected = key"
      >
        {{ option.label }}
      </button>
    </div>
    <EditorProvider
      :key="selected"
      :extensions="extensions"
      :content="latest.content"
      editor-class="p-4 pt-0 bg-white rounded-md"
      :on-update="({ editor }) => (latest.content = editor.getJSON())"
    >
      <BubbleMenu />
    </EditorProvider>
  </ExampleShell>
</template>
