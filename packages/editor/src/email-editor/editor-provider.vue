<script setup lang="ts">
/**
 * Creates an editor and provides it to the components inside, like
 * `EditorProvider` from `@tiptap/react` does: use it to compose an editor out
 * of the extensions and UI components of `vuemail-editor` yourself.
 */
import type { Content, EditorOptions, Extensions } from '@tiptap/core';
import { Editor, EditorContent } from '@tiptap/vue-3';
import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue';
import { provideCurrentEditor } from './use-current-editor';

export interface EditorProviderProps {
  extensions: Extensions;
  content?: Content;
  editable?: boolean;
  editorProps?: EditorOptions['editorProps'];
  /** Classes for the element the editor renders into. */
  editorClass?: string;
  onCreate?: EditorOptions['onCreate'];
  onUpdate?: EditorOptions['onUpdate'];
}

const props = withDefaults(defineProps<EditorProviderProps>(), {
  editable: true,
});

defineSlots<{
  default?: (props: { editor: Editor | undefined }) => unknown;
  before?: (props: { editor: Editor | undefined }) => unknown;
}>();

const editor = shallowRef<Editor>();
provideCurrentEditor(editor);

onMounted(() => {
  const { extensions, content, editable, editorProps, onCreate, onUpdate } =
    props;
  // TipTap spreads the options over its defaults, so the ones left out must
  // be missing rather than undefined
  const options: Partial<EditorOptions> = Object.fromEntries(
    Object.entries({ content, editorProps, onCreate, onUpdate }).filter(
      ([, value]) => value !== undefined,
    ),
  );
  editor.value = new Editor({ ...options, extensions, editable });
});

watch(
  () => props.editable,
  (editable) => editor.value?.setEditable(editable),
);

onBeforeUnmount(() => {
  editor.value?.destroy();
  editor.value = undefined;
});

defineExpose({ editor });
</script>

<template>
  <slot name="before" :editor="editor" />
  <EditorContent :class="editorClass" :editor="editor" />
  <slot :editor="editor" />
</template>
