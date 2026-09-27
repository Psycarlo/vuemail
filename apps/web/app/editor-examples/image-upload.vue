<script setup lang="ts">
import { EditorProvider } from '@vuemail/editor';
import { StarterKit } from '@vuemail/editor/extensions';
import {
  imageSlashCommand,
  type UploadImageResult,
  useEditorImage,
} from '@vuemail/editor/plugins';
import {
  BubbleMenu,
  defaultSlashCommands,
  SlashCommand,
} from '@vuemail/editor/ui';
import { ref } from 'vue';
import ExampleShell from '~/components/editor/ExampleShell.vue';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=640&q=60';

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () =>
      reject(reader.error ?? new Error('Could not read file'));
    reader.readAsDataURL(file);
  });

const content = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Paste or drop an image into the editor, or type / and choose "Image" to pick a file.',
        },
      ],
    },
    {
      type: 'image',
      attrs: {
        src: PLACEHOLDER_IMAGE,
        alt: 'A neon-lit circuit board',
        alignment: 'center',
      },
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Click an image to open its bubble menu. Toggle "Simulate upload error" to see the error path.',
        },
      ],
    },
  ],
};

const simulateError = ref(false);
const lastEvent = ref<string | null>(null);

const uploadImage = async (file: File): Promise<UploadImageResult> => {
  lastEvent.value = `Uploading ${file.name}…`;

  try {
    if (simulateError.value) {
      await delay(800);
      throw new Error('Simulated upload failure');
    }

    const dataUrl = await readFileAsDataUrl(file);
    await delay(1200);
    lastEvent.value = `Uploaded ${file.name}`;
    return { url: dataUrl };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    lastEvent.value = `Error uploading ${file.name}: ${message}`;
    throw error;
  }
};

const imageExtension = useEditorImage({ uploadImage });

const extensions = [StarterKit, imageExtension];

const buttonClass =
  'px-3 py-1.5 border border-(--re-border) rounded-lg bg-(--re-bg) text-(--re-text) cursor-pointer text-[0.8125rem] hover:bg-(--re-hover)';
</script>

<template>
  <ExampleShell
    title="Image upload"
    description="Upload images via paste, drop, or the slash command. Uses a stubbed uploader (FileReader → data URL) with a toggle to exercise the error path."
  >
    <EditorProvider
      v-slot="{ editor }"
      :extensions="extensions"
      :content="content"
    >
      <div class="flex flex-wrap items-center gap-2 mb-4">
        <button
          type="button"
          :class="buttonClass"
          @click="editor?.chain().focus().uploadImage().run()"
        >
          Pick image…
        </button>
        <button
          type="button"
          :class="buttonClass"
          @click="
            editor
              ?.chain()
              .focus()
              .setImage({
                src: PLACEHOLDER_IMAGE,
                alt: 'Inserted programmatically',
                alignment: 'center',
              })
              .run()
          "
        >
          Insert placeholder
        </button>
        <label
          class="flex items-center gap-2 text-[0.8125rem] text-slate-11 cursor-pointer select-none ml-1"
        >
          <input v-model="simulateError" type="checkbox" class="cursor-pointer" />
          Simulate upload error
        </label>
        <span
          v-if="lastEvent"
          class="ml-auto text-[0.75rem] text-slate-11 font-mono"
        >
          {{ lastEvent }}
        </span>
      </div>
      <BubbleMenu :hide-when-active-nodes="['image']" />
      <BubbleMenu.ImageDefault />
      <SlashCommand :items="[...defaultSlashCommands, imageSlashCommand]" />
    </EditorProvider>
  </ExampleShell>
</template>
