<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3';
import { provideCurrentEditor } from 'vuemail-editor/core';
import { StarterKit } from 'vuemail-editor/extensions';
import { EmailTheming } from 'vuemail-editor/plugins';
import { Inspector } from 'vuemail-editor/ui';
import ExampleShell from '~/components/editor/ExampleShell.vue';

const extensions = [StarterKit, EmailTheming];

const content = `
  <h1>Inspector Defaults</h1>
  <p>Click on any element to inspect it. The sidebar renders sensible defaults for each node type — no configuration needed.</p>
  <a class="button" data-id="vuemail-button" href="https://vuemail.dev">Click me</a>
  <p>Try selecting text to see the text inspector, or click the background to see document-level styles.</p>
  <img src="https://placehold.co/600x200" alt="Placeholder" />
`;

const editor = useEditor({ extensions, content });
provideCurrentEditor(editor);
</script>

<template>
  <ExampleShell
    v-if="editor"
    title="Inspector — defaults"
    description="Zero-config inspector sidebar. All three inspectors (Document, Node, Text) render sensible defaults when their slot is empty."
  >
    <div class="flex -m-4">
      <div class="flex-1 min-w-0 m-4">
        <EditorContent class="p-4 pt-0 bg-white rounded-md" :editor="editor" />
      </div>

      <aside
        class="w-60 shrink-0 border-l border-(--re-border) p-4 flex flex-col gap-4 text-xs"
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
