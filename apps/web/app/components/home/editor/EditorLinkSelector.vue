<script setup lang="ts">
import type { Editor } from '@tiptap/core';
import { useEditorState } from '@vuemaildev/editor/core';
import { CheckIcon, LinkIcon, UnlinkIcon } from 'lucide-vue-next';
import { PopoverContent, PopoverRoot, PopoverTrigger } from 'reka-ui';
import { ref, useTemplateRef, watch } from 'vue';
import { getUrlFromString, setLinkHref } from '~/utils/home/editor';

const props = defineProps<{ editor: Editor }>();

const open = ref(false);
const input = useTemplateRef<HTMLInputElement>('input');
const inputValue = ref('');

const linkState = useEditorState({
  editor: () => props.editor,
  selector: ({ editor }) => ({
    isActive: editor?.isActive('link') ?? false,
    href: (editor?.getAttributes('link').href as string) || '',
  }),
});

watch(
  [open, () => linkState.value.href],
  ([isOpen, href], _previous, onCleanup) => {
    if (!isOpen) return;
    inputValue.value = href === '#' ? '' : href;
    const id = setTimeout(() => input.value?.focus(), 0);
    onCleanup(() => clearTimeout(id));
  },
);

const focusEditor = () => {
  setTimeout(() => props.editor.commands.focus(), 0);
};

const handleApply = () => {
  const value = inputValue.value.trim();
  setLinkHref(props.editor, value ? (getUrlFromString(value) ?? '') : '');
  open.value = false;
  focusEditor();
};

const handleUnlink = () => {
  setLinkHref(props.editor, '');
  open.value = false;
  focusEditor();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleApply();
  }
  if (event.key === 'Escape') open.value = false;
};
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger as-child>
      <button
        type="button"
        aria-label="Link"
        :aria-pressed="linkState.isActive"
        :class="[
          'inline-flex items-center justify-center rounded p-1.5 text-gray-400 focus-visible:outline-none transition-colors',
          linkState.isActive
            ? 'bg-black/5 text-gray-900'
            : 'hover:bg-black/5 hover:text-gray-700',
        ]"
        @mousedown.prevent
      >
        <LinkIcon :size="14" />
      </button>
    </PopoverTrigger>
    <PopoverContent
      align="start"
      :side-offset="4"
      class="z-50 flex items-center gap-1 rounded-xl border border-gray-100 bg-white p-1 shadow-lg"
      @open-auto-focus="(event: Event) => event.preventDefault()"
    >
      <input
        ref="input"
        v-model="inputValue"
        placeholder="Paste a link"
        class="min-w-48 px-2 py-1 text-xs text-gray-700 focus-visible:outline-none placeholder:text-gray-400"
        @keydown="handleKeydown"
      />
      <button
        v-if="linkState.href"
        type="button"
        aria-label="Remove link"
        class="inline-flex items-center justify-center rounded p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
        @mousedown.prevent
        @click="handleUnlink"
      >
        <UnlinkIcon :size="14" />
      </button>
      <button
        v-else
        type="button"
        aria-label="Apply link"
        class="inline-flex items-center justify-center rounded p-1.5 text-gray-400 transition-colors hover:bg-black/5 hover:text-gray-700"
        @mousedown.prevent
        @click="handleApply"
      >
        <CheckIcon :size="14" />
      </button>
    </PopoverContent>
  </PopoverRoot>
</template>
