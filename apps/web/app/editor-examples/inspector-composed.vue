<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3';
import { provideCurrentEditor } from '@vuemaildev/editor/core';
import { StarterKit } from '@vuemaildev/editor/extensions';
import { EmailTheming } from '@vuemaildev/editor/plugins';
import { Inspector } from '@vuemaildev/editor/ui';
import ExampleShell from '~/components/editor/ExampleShell.vue';

const extensions = [StarterKit, EmailTheming];

const content = `
  <h1>Composed Inspector</h1>
  <p>This example picks specific sections and adds a custom one. Click an element to see the composed sidebar.</p>
  <a class="button" data-id="vuemail-button" href="https://vuemail.dev">Click me</a>
  <img src="https://placehold.co/600x200" alt="Placeholder" />
`;

const editor = useEditor({ extensions, content });
provideCurrentEditor(editor);

function normalizeHex(value: string): string {
  if (!value) return '#000000';
  const v = value.trim();
  const shortHex = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(v);
  if (shortHex) {
    return `#${shortHex[1]}${shortHex[1]}${shortHex[2]}${shortHex[2]}${shortHex[3]}${shortHex[3]}`;
  }
  if (/^#[0-9a-f]{6}$/i.test(v)) return v;
  return '#000000';
}

const inputValue = (event: Event) => (event.target as HTMLInputElement).value;
</script>

<template>
  <ExampleShell
    v-if="editor"
    title="Inspector — composed"
    description="Cherry-pick which sections render, control collapse state, and mix in custom sections alongside built-in ones."
  >
    <div class="flex -m-4">
      <div class="flex-1 min-w-0 m-4 mt-0">
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

          <Inspector.Document v-slot="{ findStyleValue, setGlobalStyle }">
            <fieldset class="border border-(--re-border) rounded p-2 m-0">
              <legend class="text-xs font-bold px-1">Theme Colors</legend>
              <div class="flex items-center justify-between gap-2 mt-1">
                <span class="text-(--re-text-muted)">Page</span>
                <input
                  type="color"
                  :value="
                    normalizeHex(
                      String(findStyleValue('body', 'backgroundColor') ?? ''),
                    )
                  "
                  class="w-6 h-6 border-0 p-0 cursor-pointer"
                  @input="
                    setGlobalStyle(
                      'body',
                      'backgroundColor',
                      inputValue($event),
                    )
                  "
                />
              </div>
              <div class="flex items-center justify-between gap-2 mt-1">
                <span class="text-(--re-text-muted)">Container</span>
                <input
                  type="color"
                  :value="
                    normalizeHex(
                      String(
                        findStyleValue('container', 'backgroundColor') ?? '',
                      ),
                    )
                  "
                  class="w-6 h-6 border-0 p-0 cursor-pointer"
                  @input="
                    setGlobalStyle(
                      'container',
                      'backgroundColor',
                      inputValue($event),
                    )
                  "
                />
              </div>
            </fieldset>
          </Inspector.Document>

          <Inspector.Node v-slot="ctx">
            <Inspector.Background v-bind="ctx" />
            <Inspector.Padding v-bind="ctx" />
            <Inspector.Size v-if="ctx.nodeType === 'image'" v-bind="ctx" />
            <Inspector.Border v-bind="ctx" />

            <fieldset class="border border-(--re-border) rounded p-2 m-0">
              <legend class="text-xs font-bold px-1">Data</legend>
              <div class="flex items-center justify-between gap-2">
                <span class="text-(--re-text-muted)">ID</span>
                <input
                  type="text"
                  :value="String(ctx.getAttr('data-id') ?? '')"
                  class="w-24 text-xs bg-transparent border border-(--re-border) rounded px-1.5 py-1"
                  @input="ctx.setAttr('data-id', inputValue($event))"
                />
              </div>
            </fieldset>
          </Inspector.Node>

          <Inspector.Text v-slot="ctx">
            <Inspector.Typography v-bind="ctx" />
            <Inspector.Link v-if="ctx.isLinkActive" v-bind="ctx" />
          </Inspector.Text>
        </Inspector.Root>
      </aside>
    </div>
  </ExampleShell>
</template>
