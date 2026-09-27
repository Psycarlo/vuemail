<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';
import { EditorProvider } from '@vuemail/editor';
import { StarterKit } from '@vuemail/editor/extensions';
import { Columns2, Columns3, Columns4 } from 'lucide-vue-next';
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
          text: 'Use the toolbar above to insert column layouts.',
        },
      ],
    },
  ],
};

const layouts = [
  { count: 2, label: '2 columns', icon: Columns2 },
  { count: 3, label: '3 columns', icon: Columns3 },
  { count: 4, label: '4 columns', icon: Columns4 },
];

function makeColumns(count: number) {
  const labels = ['First', 'Second', 'Third', 'Fourth'];
  const types: Record<number, string> = {
    2: 'twoColumns',
    3: 'threeColumns',
    4: 'fourColumns',
  };
  return {
    type: types[count],
    content: Array.from({ length: count }, (_, i) => ({
      type: 'columnsColumn',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: `${labels[i]} column` }],
        },
      ],
    })),
  };
}

const insertColumns = (editor: Editor, count: number) =>
  editor.chain().focus().insertContent(makeColumns(count)).run();
</script>

<template>
  <ExampleShell
    title="Column layouts"
    description="Insert multi-column layouts using the toolbar buttons."
  >
    <EditorProvider :extensions="extensions" :content="content">
      <template #before="{ editor }">
        <div v-if="editor" class="flex gap-2 mb-4">
          <button
            v-for="layout in layouts"
            :key="layout.count"
            type="button"
            class="flex items-center gap-1.5 px-3 py-1.5 border border-(--re-border) rounded-lg bg-(--re-bg) text-(--re-text) cursor-pointer text-[0.8125rem] hover:bg-(--re-hover)"
            @click="insertColumns(editor, layout.count)"
          >
            <component :is="layout.icon" :size="16" />
            {{ layout.label }}
          </button>
        </div>
      </template>
    </EditorProvider>
  </ExampleShell>
</template>
