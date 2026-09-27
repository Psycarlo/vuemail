<script lang="ts">
import type { Editor } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';

const defaultPluginKey = new PluginKey('bubbleMenu');
const textPluginKey = new PluginKey('textBubbleMenu');

const editorIds = new WeakMap<Editor, number>();
let nextEditorId = 0;

/** A stable key per editor, to set up the menu again when the editor changes. */
function getEditorKey(editor: Editor): number {
  let id = editorIds.get(editor);
  if (id === undefined) {
    id = nextEditorId++;
    editorIds.set(editor, id);
  }
  return id;
}
</script>

<script setup lang="ts">
import { BubbleMenu } from '@tiptap/vue-3/menus';
import { computed, type HTMLAttributes, shallowRef, watch } from 'vue';
import { useCurrentEditor } from '../../email-editor/use-current-editor';
import { EditorFocusScope } from '../editor-focus-scope';
import { useEditorState } from '../use-editor-state';
import BubbleMenuAlignCenter from './align-center.vue';
import BubbleMenuAlignLeft from './align-left.vue';
import BubbleMenuAlignRight from './align-right.vue';
import { BubbleMenuBold } from './bold';
import { BubbleMenuCode } from './code';
import { type BubbleMenuContextValue, provideBubbleMenuContext } from './context';
import BubbleMenuItemGroup from './group.vue';
import { BubbleMenuItalic } from './italic';
import BubbleMenuLinkSelector from './link-selector.vue';
import { BubbleMenuNodeSelector } from './node-selector';
import { BubbleMenuStrike } from './strike';
import { bubbleMenuTriggers, type TriggerFn, type TriggerParams } from './triggers';
import { BubbleMenuUnderline } from './underline';
import { BubbleMenuUppercase } from './uppercase';

export interface BubbleMenuRootProps
  extends /* @vue-ignore */ HTMLAttributes {
  trigger?: TriggerFn;
  pluginKey?: PluginKey;
  hideWhenActiveNodes?: string[];
  hideWhenActiveMarks?: string[];
  placement?: 'top' | 'bottom';
  offset?: number;
  /** Called when the menu hides, also as `@hide`. */
  onHide?: () => void;
}

defineOptions({ name: 'BubbleMenuRoot', inheritAttrs: false });

const props = withDefaults(defineProps<BubbleMenuRootProps>(), {
  hideWhenActiveNodes: () => [],
  hideWhenActiveMarks: () => [],
  placement: 'bottom',
  offset: 8,
});

const slots = defineSlots<{
  /** The menu's content. Without it, the default text formatting menu renders. */
  default?: () => unknown;
}>();

const { editor } = useCurrentEditor();
const isEditing = shallowRef(false);

const context: BubbleMenuContextValue = {
  get editor() {
    return editor.value as Editor;
  },
  get isEditing() {
    return isEditing.value;
  },
  setIsEditing: (value: boolean) => {
    isEditing.value = value;
  },
};

provideBubbleMenuContext(context);

// The default menu (no slot) uses its own plugin key, like upstream's
// `BubbleMenu.Default`.
const resolvedPluginKey =
  props.pluginKey ?? (slots.default ? defaultPluginKey : textPluginKey);

const resolvedTrigger = computed(
  () =>
    props.trigger ??
    bubbleMenuTriggers.textSelection(
      props.hideWhenActiveNodes,
      props.hideWhenActiveMarks,
    ),
);

// Stable for the menu plugin, while always asking the latest trigger.
const shouldShow = (params: TriggerParams) => resolvedTrigger.value(params);

// The default menu keeps its two popovers exclusive, and closes them on hide.
const isNodeSelectorOpen = shallowRef(false);
const isLinkSelectorOpen = shallowRef(false);

const handleNodeSelectorOpenChange = (open: boolean) => {
  isNodeSelectorOpen.value = open;
  if (open) {
    isLinkSelectorOpen.value = false;
  }
};

const handleLinkSelectorOpenChange = (open: boolean) => {
  isLinkSelectorOpen.value = open;
  if (open) {
    isNodeSelectorOpen.value = false;
  }
};

const options = {
  placement: props.placement,
  offset: props.offset,
  onHide: () => {
    context.setIsEditing(false);
    isNodeSelectorOpen.value = false;
    isLinkSelectorOpen.value = false;
    props.onHide?.();
  },
};

// The menu plugin reads its options once, send it the new ones on changes.
watch(
  () => [props.placement, props.offset] as const,
  ([placement, offset]) => {
    options.placement = placement;
    options.offset = offset;
    const currentEditor = editor.value;
    if (!currentEditor || currentEditor.isDestroyed) {
      return;
    }
    currentEditor.view.dispatch(
      currentEditor.state.tr.setMeta(resolvedPluginKey, {
        type: 'updateOptions',
        options: { options: { placement, offset } },
      }),
    );
  },
);

const isCodeActive = useEditorState({
  editor,
  selector: ({ editor: e }) => e?.isActive('code') ?? false,
});

// A list so that the menu is keyed by its editor, which sets it up again when
// the editor changes. Rendering a fragment also keeps a stable place in the
// document for it, as the menu plugin moves the menu element around.
const editors = computed(() => (editor.value ? [editor.value] : []));
</script>

<template>
  <template v-for="currentEditor in editors" :key="getEditorKey(currentEditor)">
    <EditorFocusScope>
      <BubbleMenu
        v-bind="$attrs"
        :editor="currentEditor"
        :plugin-key="resolvedPluginKey"
        data-re-bubble-menu=""
        :should-show="shouldShow"
        :options="options"
      >
        <slot v-if="$slots.default" />
        <template v-else-if="isCodeActive">
          <BubbleMenuNodeSelector
            :open="isNodeSelectorOpen"
            :on-open-change="handleNodeSelectorOpenChange"
          />
          <BubbleMenuCode />
        </template>
        <template v-else>
          <BubbleMenuNodeSelector
            :open="isNodeSelectorOpen"
            :on-open-change="handleNodeSelectorOpenChange"
          />
          <BubbleMenuLinkSelector
            :open="isLinkSelectorOpen"
            :on-open-change="handleLinkSelectorOpenChange"
          />
          <BubbleMenuItemGroup>
            <BubbleMenuBold />
            <BubbleMenuItalic />
            <BubbleMenuUnderline />
            <BubbleMenuStrike />
            <BubbleMenuCode />
            <BubbleMenuUppercase />
          </BubbleMenuItemGroup>
          <BubbleMenuItemGroup>
            <BubbleMenuAlignLeft />
            <BubbleMenuAlignCenter />
            <BubbleMenuAlignRight />
          </BubbleMenuItemGroup>
        </template>
      </BubbleMenu>
    </EditorFocusScope>
  </template>
</template>
