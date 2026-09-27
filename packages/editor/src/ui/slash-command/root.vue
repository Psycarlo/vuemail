<script lang="ts">
import type { Editor } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { filterAndRankItems } from './search';
import type {
  SlashCommandItem,
  SlashCommandRootProps,
  SlashCommandRootSlots,
} from './types';
import { isAtMaxColumnsDepth } from './utils';

const pluginKey = new PluginKey('slash-command');

interface SuggestionState {
  active: boolean;
  query: string;
  items: SlashCommandItem[];
  clientRect: (() => DOMRect | null) | null;
}

const INITIAL_STATE: SuggestionState = {
  active: false,
  query: '',
  items: [],
  clientRect: null,
};

function defaultFilterItems(
  items: SlashCommandItem[],
  query: string,
  editor: Editor,
): SlashCommandItem[] {
  const filtered = isAtMaxColumnsDepth(editor)
    ? items.filter(
        (item) => item.category !== 'Layout' || !item.title.includes('column'),
      )
    : items;

  return filterAndRankItems(filtered, query);
}

const defaultAllow = ({ editor }: { editor: Editor }) =>
  !editor.isActive('codeBlock');
</script>

<script setup lang="ts">
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
  type VirtualElement,
} from '@floating-ui/vue';
import Suggestion from '@tiptap/suggestion';
import { computed, shallowRef, useTemplateRef, watch } from 'vue';
import { useCurrentEditor } from '../../email-editor/use-current-editor';
import { EditorFocusScope } from '../editor-focus-scope';
import CommandList from './command-list.vue';
import { defaultSlashCommands } from './commands';

defineOptions({ name: 'SlashCommandRoot' });

const props = withDefaults(defineProps<SlashCommandRootProps>(), {
  char: '/',
});

const slots = defineSlots<SlashCommandRootSlots>();

const { editor } = useCurrentEditor();
const state = shallowRef<SuggestionState>(INITIAL_STATE);
const selectedIndex = shallowRef(0);

let command: ((item: SlashCommandItem) => void) | null = null;

const reference = shallowRef<VirtualElement | null>(null);
const floating = useTemplateRef<HTMLElement>('floating');

const { floatingStyles } = useFloating(reference, floating, {
  open: computed(() => state.value.active),
  placement: 'bottom-start',
  middleware: [offset(8), flip(), shift({ padding: 8 })],
  whileElementsMounted: autoUpdate,
});

watch(
  () => state.value.clientRect,
  (clientRect) => {
    if (!clientRect) return;
    // The suggestion's decoration is gone once it exits, while a position
    // update may still be pending: keep the last rect for it.
    let lastRect = clientRect() ?? new DOMRect();
    reference.value = {
      getBoundingClientRect: () => {
        lastRect = clientRect() ?? lastRect;
        return lastRect;
      },
    };
  },
);

watch(
  () => state.value.items,
  () => {
    selectedIndex.value = 0;
  },
);

const onSelect = (index: number) => {
  const item = state.value.items[index];
  if (item && command) {
    command(item);
  }
};

watch(
  [editor, () => props.char],
  ([currentEditor, char], _previous, onCleanup) => {
    if (!currentEditor) return;

    const plugin = Suggestion<SlashCommandItem, SlashCommandItem>({
      pluginKey,
      editor: currentEditor,
      char,
      allow: ({ editor: e }) => (props.allow ?? defaultAllow)({ editor: e }),
      command: ({ editor: e, range, props: item }) => {
        item.command({ editor: e, range });
      },
      items: ({ query, editor: e }) =>
        (props.filterItems ?? defaultFilterItems)(
          props.items ?? defaultSlashCommands,
          query,
          e,
        ),
      render: () => ({
        onStart: (suggestionProps) => {
          command = suggestionProps.command;
          state.value = {
            active: true,
            query: suggestionProps.query,
            items: suggestionProps.items,
            clientRect: suggestionProps.clientRect ?? null,
          };
        },
        onUpdate: (suggestionProps) => {
          command = suggestionProps.command;
          state.value = {
            active: true,
            query: suggestionProps.query,
            items: suggestionProps.items,
            clientRect: suggestionProps.clientRect ?? null,
          };
        },
        onKeyDown: ({ event }) => {
          if (event.key === 'Escape') {
            state.value = INITIAL_STATE;
            return true;
          }

          const items = state.value.items;
          if (items.length === 0) return false;

          if (event.key === 'ArrowUp') {
            selectedIndex.value =
              (selectedIndex.value + items.length - 1) % items.length;
            return true;
          }
          if (event.key === 'ArrowDown') {
            selectedIndex.value = (selectedIndex.value + 1) % items.length;
            return true;
          }
          if (event.key === 'Enter') {
            const item = items[selectedIndex.value];
            if (item && command) {
              command(item);
            }
            return true;
          }
          return false;
        },
        onExit: () => {
          state.value = INITIAL_STATE;
          requestAnimationFrame(() => {
            command = null;
          });
        },
      }),
    });

    currentEditor.registerPlugin(plugin, (newPlugin, plugins) => [
      newPlugin,
      ...plugins,
    ]);
    onCleanup(() => {
      currentEditor.unregisterPlugin(pluginKey);
    });
  },
  { immediate: true },
);

const renderProps = computed(() => ({
  items: state.value.items,
  query: state.value.query,
  selectedIndex: selectedIndex.value,
  onSelect,
}));
</script>

<template>
  <Teleport v-if="editor && state.active" to="body">
    <EditorFocusScope>
      <div ref="floating" :style="floatingStyles">
        <slot v-if="slots.default" v-bind="renderProps" />
        <CommandList v-else v-bind="renderProps" />
      </div>
    </EditorFocusScope>
  </Teleport>
</template>
