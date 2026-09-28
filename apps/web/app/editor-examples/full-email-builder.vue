<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3';
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';
import { composeVueEmail, provideCurrentEditor } from 'vuemail-editor/core';
import { StarterKit } from 'vuemail-editor/extensions';
import { EmailTheming } from 'vuemail-editor/plugins';
import {
  BubbleMenu,
  defaultSlashCommands,
  Inspector,
  SlashCommand,
} from 'vuemail-editor/ui';
import ExampleShell from '~/components/editor/ExampleShell.vue';

type EditorTheme = 'basic' | 'minimal';

const content = `
  <h1>Weekly Newsletter</h1>
  <p>This is a full-featured email editor combining all available components. Try selecting text, inserting columns, adding buttons, and switching themes.</p>
  <h2>Featured Article</h2>
  <p>Check out our latest post on <a href="https://vuemail.dev" target="_blank">Vuemail</a> for building better email templates.</p>
  <a class="button" data-id="vuemail-button" href="https://vuemail.dev">Read More</a>
`;

const theme = ref<EditorTheme>('basic');
const editor = shallowRef<Editor>();
provideCurrentEditor(editor);

// A new editor for every theme, like React's `useEditor` with dependencies
const createEditor = () => {
  editor.value?.destroy();
  editor.value = new Editor({
    extensions: [StarterKit, EmailTheming.configure({ theme: theme.value })],
    content,
  });
};
onMounted(createEditor);
watch(theme, createEditor);
onBeforeUnmount(() => editor.value?.destroy());

const html = ref('');
const exporting = ref(false);

const handleExport = async () => {
  if (!editor.value) return;
  exporting.value = true;
  try {
    const result = await composeVueEmail({ editor: editor.value });
    html.value = result.html;
  } finally {
    exporting.value = false;
  }
};

const themeButtonClass = (option: EditorTheme) => [
  'px-3 py-1.5 border border-(--re-border) rounded-lg cursor-pointer text-[0.8125rem]',
  theme.value === option
    ? 'bg-(--re-text) text-(--re-bg) font-medium'
    : 'bg-(--re-bg) text-(--re-text) hover:bg-(--re-hover)',
];
</script>

<template>
  <ExampleShell
    v-if="editor"
    title="Full email builder"
    description="All components combined: bubble menus, slash commands, theming, inspector sidebar, and export."
  >
    <div class="flex gap-2 mb-4">
      <button
        type="button"
        :class="themeButtonClass('basic')"
        @click="theme = 'basic'"
      >
        Basic Theme
      </button>
      <button
        type="button"
        :class="themeButtonClass('minimal')"
        @click="theme = 'minimal'"
      >
        Minimal Theme
      </button>
    </div>
    <!-- Keyed so that everything starts over with the new editor -->
    <div
      :key="theme"
      class="flex -mx-4 -mb-4 border-t border-(--re-border) min-h-0"
    >
      <div class="flex-1 min-w-0 m-4 mt-0">
        <EditorContent class="p-4 pt-0 bg-white rounded-md" :editor="editor" />

        <BubbleMenu
          :hide-when-active-nodes="['button']"
          :hide-when-active-marks="['link']"
        />
        <BubbleMenu.LinkDefault />
        <BubbleMenu.ButtonDefault />
        <SlashCommand :items="defaultSlashCommands" />
        <div class="mt-4">
          <button
            type="button"
            :disabled="exporting"
            class="px-3 py-1.5 border border-(--re-border) rounded-lg bg-(--re-bg) text-(--re-text) cursor-pointer text-[0.8125rem] hover:bg-(--re-hover) disabled:opacity-50"
            @click="handleExport"
          >
            {{ exporting ? 'Exporting...' : 'Export HTML' }}
          </button>
          <pre
            v-if="html"
            class="mt-3 w-full p-3 font-mono text-xs bg-(--re-bg) text-(--re-text) border border-(--re-border) rounded-lg whitespace-pre-wrap wrap-break-word select-all"
          >{{ html }}</pre>
        </div>
      </div>
      <aside
        class="w-56 shrink-0 border-l border-(--re-border) p-3 flex flex-col gap-3 text-xs"
      >
        <Inspector.Root>
          <nav>
            <ol class="flex items-center gap-1 list-none m-0 p-0 mb-4">
              <Inspector.Breadcrumb v-slot="{ segments }">
                <li
                  v-for="(segment, i) in segments"
                  :key="i"
                  class="flex items-center gap-1"
                >
                  <span v-if="i !== 0" class="text-(--re-text-muted)">/</span>
                  <span
                    v-if="i === segments.length - 1"
                    class="text-(--re-text) p-0 text-xs capitalize"
                  >
                    {{ segment.node?.nodeType ?? 'Layout' }}
                  </span>
                  <button
                    v-else
                    type="button"
                    class="bg-transparent border-0 cursor-pointer text-(--re-text-muted) p-0 text-xs hover:text-(--re-text) capitalize"
                    @click="segment.focus()"
                  >
                    {{ segment.node?.nodeType ?? 'Layout' }}
                  </button>
                </li>
              </Inspector.Breadcrumb>
            </ol>
          </nav>
          <Inspector.Document />
          <Inspector.Node />
          <Inspector.Text />
        </Inspector.Root>
      </aside>
    </div>
  </ExampleShell>
</template>
