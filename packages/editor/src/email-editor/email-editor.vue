<script setup lang="ts">
import type { Content, Extensions, JSONContent } from '@tiptap/core';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Editor, EditorContent } from '@tiptap/vue-3';
import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue';
import { createPasteHandler } from '../core/create-paste-handler';
import { composeVueEmail } from '../core/serializer/compose-vue-email';
import { StarterKit } from '../extensions';
import { EmailTheming } from '../plugins/email-theming/extension';
import type { EditorThemeInput } from '../plugins/email-theming/types';
import { createImageExtension } from '../plugins/image/extension';
import { BubbleMenu } from '../ui/bubble-menu';
import { SlashCommand } from '../ui/slash-command';
import type { EmailEditorRef } from './types';
import { provideCurrentEditor } from './use-current-editor';

export interface EmailEditorProps {
  content?: Content;
  /** Called on every change to the document, also as `@update`. */
  onUpdate?: (ref: EmailEditorRef) => void;
  /** Called once the editor is created, also as `@ready`. */
  onReady?: (ref: EmailEditorRef) => void;
  theme?: EditorThemeInput;
  editable?: boolean;
  placeholder?: string;
  bubbleMenu?: {
    hideWhenActiveNodes?: string[];
    hideWhenActiveMarks?: string[];
  };
  extensions?: Extensions;
  /** Enables uploading images, returning the URL they're served from. */
  onUploadImage?: (file: File) => Promise<{ url: string }>;
  class?: string;
}

const props = withDefaults(defineProps<EmailEditorProps>(), {
  theme: 'basic',
  editable: true,
});

const editor = shallowRef<Editor>();
provideCurrentEditor(editor);

const emptyDocument: JSONContent = { type: 'doc', content: [] };

const emailEditorRef: EmailEditorRef = {
  getEmail: async () => {
    if (!editor.value) return { html: '', text: '' };
    return composeVueEmail({ editor: editor.value });
  },
  getEmailHTML: async () => {
    if (!editor.value) return '';
    return (await composeVueEmail({ editor: editor.value })).html;
  },
  getEmailText: async () => {
    if (!editor.value) return '';
    return (await composeVueEmail({ editor: editor.value })).text;
  },
  getJSON: () => editor.value?.getJSON() ?? emptyDocument,
  get editor() {
    return editor.value ?? null;
  },
};

const buildExtensions = (): Extensions => {
  const base = props.extensions ?? [
    StarterKit.configure(),
    Placeholder.configure({
      placeholder:
        props.placeholder ??
        (({ node }) => {
          if (node.type.name === 'heading') {
            return `Heading ${node.attrs.level}`;
          }
          return "Press '/' for commands";
        }),
      includeChildren: true,
    }),
    EmailTheming.configure({ theme: props.theme }),
  ];

  return props.onUploadImage
    ? [...base, createImageExtension({ uploadImage: props.onUploadImage })]
    : base;
};

// Creating the editor again when the theme changes is what React Email does
// by keying its provider on the theme.
const themeKey = computed(() =>
  typeof props.theme === 'string' ? props.theme : JSON.stringify(props.theme),
);

const createEditor = () => {
  editor.value?.destroy();

  const extensions = buildExtensions();
  const instance = new Editor({
    extensions,
    content: props.content,
    editable: props.editable,
    editorProps: {
      handlePaste: createPasteHandler({ extensions }),
    },
  });
  instance.on('update', () => props.onUpdate?.(emailEditorRef));
  // Like React Email, the editor is ready once it's mounted in the page:
  // `<EditorContent>` moves it into place right after it's created, before
  // TipTap tells it's created.
  instance.on('create', () => props.onReady?.(emailEditorRef));
  editor.value = instance;
};

onMounted(createEditor);
watch(themeKey, createEditor);
watch(
  () => props.editable,
  (editable) => editor.value?.setEditable(editable),
);
onBeforeUnmount(() => {
  editor.value?.destroy();
  editor.value = undefined;
});

defineExpose(emailEditorRef);
</script>

<template>
  <EditorContent :class="props.class" :editor="editor" />
  <template v-if="editor">
    <BubbleMenu
      :hide-when-active-marks="bubbleMenu?.hideWhenActiveMarks ?? ['link']"
      :hide-when-active-nodes="
        bubbleMenu?.hideWhenActiveNodes ?? ['button', 'horizontalRule']
      "
    />
    <BubbleMenu.LinkDefault />
    <BubbleMenu.ButtonDefault />
    <BubbleMenu.ImageDefault />
    <SlashCommand />
    <slot />
  </template>
</template>
