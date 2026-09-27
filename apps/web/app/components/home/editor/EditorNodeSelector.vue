<script setup lang="ts">
import type { Editor } from '@tiptap/core';
import { useEditorState } from '@vuemail/editor/core';
import { ChevronDownIcon } from 'lucide-vue-next';
import { PopoverContent, PopoverRoot, PopoverTrigger } from 'reka-ui';
import { ref } from 'vue';
import { TOOLBAR_NODE_ITEMS } from '~/utils/home/editor';

const props = defineProps<{ editor: Editor }>();

const open = ref(false);

const activeName = useEditorState({
  editor: () => props.editor,
  selector: ({ editor }) => {
    const item = TOOLBAR_NODE_ITEMS.find(
      (item) => editor && item.isActive(editor),
    );
    return item?.name ?? 'Mixed';
  },
});

const runCommand = (command: (editor: Editor) => void) => {
  command(props.editor);
  open.value = false;
};
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger as-child>
      <button
        type="button"
        class="inline-flex items-center gap-1 rounded px-2 py-1.5 text-xs font-medium text-gray-700 focus-visible:outline-none transition-colors hover:bg-black/5"
        @mousedown.prevent
      >
        {{ activeName }}
        <ChevronDownIcon :size="12" class="opacity-50" />
      </button>
    </PopoverTrigger>
    <PopoverContent
      align="start"
      :side-offset="4"
      class="z-50 min-w-36 rounded-xl border border-gray-100 bg-white p-1 shadow-lg"
    >
      <button
        v-for="item in TOOLBAR_NODE_ITEMS"
        :key="item.name"
        type="button"
        :class="[
          'focus-visible:outline-none flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors',
          item.isActive(editor)
            ? 'font-medium text-gray-900'
            : 'text-gray-500 hover:bg-black/5 hover:text-gray-900',
        ]"
        @mousedown.prevent
        @click="runCommand(item.command)"
      >
        <component :is="item.icon" :size="14" />
        {{ item.name }}
      </button>
    </PopoverContent>
  </PopoverRoot>
</template>
