<script setup lang="ts">
import type { JSONContent } from '@tiptap/core';
import { EditorProvider } from '@vuemail/editor';
import { StarterKit } from '@vuemail/editor/extensions';
import {
  type EditorThemeInput,
  EmailTheming,
  extendTheme,
} from '@vuemail/editor/plugins';
import { BubbleMenu } from '@vuemail/editor/ui';
import { computed, ref } from 'vue';
import ExampleShell from '~/components/editor/ExampleShell.vue';

const initialContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Welcome to our newsletter' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is a themed email editor. Toggle between Basic, Minimal, and Custom themes to see how styles change.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Try editing this content and switching themes to see the difference.',
        },
      ],
    },
  ],
};

const customTheme = extendTheme('basic', {
  body: { backgroundColor: '#f8f4ff' },
  container: { backgroundColor: '#ffffff', borderRadius: '8px' },
  h1: { color: '#6d28d9' },
  h2: { color: '#7c3aed' },
  h3: { color: '#8b5cf6' },
  link: { color: '#7c3aed' },
  button: {
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    borderRadius: '6px',
  },
});

type ThemeOption = 'basic' | 'minimal' | 'custom';

const themeMap: Record<ThemeOption, EditorThemeInput> = {
  basic: 'basic',
  minimal: 'minimal',
  custom: customTheme,
};

const options: ThemeOption[] = ['basic', 'minimal', 'custom'];
const selected = ref<ThemeOption>('basic');

const extensions = computed(() => [
  StarterKit,
  EmailTheming.configure({ theme: themeMap[selected.value] }),
]);

// Left out of Vue's reactivity on purpose: switching themes creates a new
// editor (see the `key` below), which starts from the latest content
const latest: { content: JSONContent } = { content: initialContent };
</script>

<template>
  <ExampleShell
    title="Email theming"
    description="Switch between Basic, Minimal, and Custom themes to see how email styles change."
  >
    <div class="flex gap-2 mb-4">
      <button
        v-for="option in options"
        :key="option"
        type="button"
        :class="[
          'px-3 py-1.5 border border-(--re-border) rounded-lg cursor-pointer text-[0.8125rem] capitalize',
          selected === option
            ? 'bg-(--re-text) text-(--re-bg) font-medium'
            : 'bg-(--re-bg) text-(--re-text) hover:bg-(--re-hover)',
        ]"
        @click="selected = option"
      >
        {{ option }}
      </button>
    </div>
    <div class="p-4 bg-white rounded-md">
      <EditorProvider
        :key="selected"
        :extensions="extensions"
        :content="latest.content"
        :on-update="({ editor }) => (latest.content = editor.getJSON())"
      >
        <BubbleMenu />
      </EditorProvider>
    </div>
  </ExampleShell>
</template>
