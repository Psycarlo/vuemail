<script setup lang="ts">
import type { ChainedCommands } from '@tiptap/core';
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-vue-next';
import { useCurrentEditor, useEditorState } from 'vuemail-editor/core';
import { setTextAlignment } from '~/utils/home/editor';

const { editor } = useCurrentEditor();

const state = useEditorState({
  editor,
  selector: ({ editor }) => ({
    isBold: editor?.isActive('bold') ?? false,
    isItalic: editor?.isActive('italic') ?? false,
    isUnderline: editor?.isActive('underline') ?? false,
    isStrike: editor?.isActive('strike') ?? false,
    isCode: editor?.isActive('code') ?? false,
    isAlignLeft: editor?.isActive({ alignment: 'left' }) ?? false,
    isAlignCenter: editor?.isActive({ alignment: 'center' }) ?? false,
    isAlignRight: editor?.isActive({ alignment: 'right' }) ?? false,
  }),
});

const toggle = (command: (chain: ChainedCommands) => ChainedCommands) => {
  if (editor.value) command(editor.value.chain().focus()).run();
};

const align = (alignment: string) => {
  if (editor.value) setTextAlignment(editor.value, alignment);
};
</script>

<template>
  <div
    v-if="editor"
    class="-order-1 flex shrink-0 items-center gap-0.5 border-b border-gray-100 px-2 py-1"
  >
    <HomeEditorToolbarButton
      label="Bold"
      :is-active="state.isBold"
      @click="toggle((chain) => chain.toggleBold())"
    >
      <BoldIcon :size="14" />
    </HomeEditorToolbarButton>
    <HomeEditorToolbarButton
      label="Italic"
      :is-active="state.isItalic"
      @click="toggle((chain) => chain.toggleItalic())"
    >
      <ItalicIcon :size="14" />
    </HomeEditorToolbarButton>
    <HomeEditorToolbarButton
      label="Underline"
      :is-active="state.isUnderline"
      @click="toggle((chain) => chain.toggleUnderline())"
    >
      <UnderlineIcon :size="14" />
    </HomeEditorToolbarButton>
    <HomeEditorToolbarButton
      label="Strikethrough"
      :is-active="state.isStrike"
      @click="toggle((chain) => chain.toggleStrike())"
    >
      <StrikethroughIcon :size="14" />
    </HomeEditorToolbarButton>
    <HomeEditorToolbarButton
      label="Code"
      :is-active="state.isCode"
      @click="toggle((chain) => chain.toggleCode())"
    >
      <CodeIcon :size="14" />
    </HomeEditorToolbarButton>
    <HomeEditorLinkSelector :editor="editor" />
    <div class="mx-0.5 w-px self-stretch bg-gray-100" />
    <HomeEditorToolbarButton
      label="Align left"
      :is-active="state.isAlignLeft"
      @click="align('left')"
    >
      <AlignLeftIcon :size="14" />
    </HomeEditorToolbarButton>
    <HomeEditorToolbarButton
      label="Align center"
      :is-active="state.isAlignCenter"
      @click="align('center')"
    >
      <AlignCenterIcon :size="14" />
    </HomeEditorToolbarButton>
    <HomeEditorToolbarButton
      label="Align right"
      :is-active="state.isAlignRight"
      @click="align('right')"
    >
      <AlignRightIcon :size="14" />
    </HomeEditorToolbarButton>
    <div class="mx-0.5 w-px self-stretch bg-gray-100" />
    <HomeEditorNodeSelector :editor="editor" />
  </div>
</template>
