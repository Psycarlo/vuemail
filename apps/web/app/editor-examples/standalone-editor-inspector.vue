<script setup lang="ts">
import { EmailEditor } from 'vuemail-editor';
import { Inspector } from 'vuemail-editor/ui';
import ExampleShell from '~/components/editor/ExampleShell.vue';

const content = `
  <h1>Newsletter Preview</h1>
  <p>Click any element to inspect it in the sidebar. Select text to see text controls, or click the background for document-level styles.</p>
  <a class="button" data-id="vuemail-button" href="https://vuemail.dev">Read More</a>
  <p>The inspector sidebar is rendered in the slot of EmailEditor.</p>
  <img src="https://placehold.co/600x200" alt="Placeholder" />
`;
</script>

<template>
  <ExampleShell
    title="Standalone editor — inspector"
    description="Add an inspector sidebar alongside the standalone EmailEditor — no manual EditorProvider setup needed."
  >
    <div class="flex">
      <EmailEditor
        :content="content"
        class="flex-1 min-w-0 mr-4 p-4 bg-white rounded-md"
      >
        <Inspector.Root
          class="w-60 shrink-0 border-l border-(--re-border) pt-8 p-4 flex flex-col text-xs"
        >
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
      </EmailEditor>
    </div>
  </ExampleShell>
</template>
