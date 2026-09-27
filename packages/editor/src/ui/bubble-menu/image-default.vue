<script lang="ts">
import { PluginKey } from '@tiptap/pm/state';

const imagePluginKey = new PluginKey('imageBubbleMenu');

type ExcludableItem = 'edit-link' | 'unlink';
</script>

<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { useCurrentEditor } from '../../email-editor/use-current-editor';
import { useEditorState } from '../use-editor-state';
import BubbleMenuImageEditLink from './image-edit-link.vue';
import BubbleMenuImageForm from './image-form.vue';
import BubbleMenuImageToolbar from './image-toolbar.vue';
import BubbleMenuImageUnlink from './image-unlink.vue';
import BubbleMenuRoot from './root.vue';
import { bubbleMenuTriggers } from './triggers';

export interface BubbleMenuImageDefaultProps
  extends /* @vue-ignore */ HTMLAttributes {
  excludeItems?: ExcludableItem[];
  placement?: 'top' | 'bottom';
  offset?: number;
  /** Called when the menu hides, also as `@hide` */
  onHide?: () => void;
  validateUrl?: (value: string) => string | null;
  /** Called after the link is applied, also as `@link-apply` */
  onLinkApply?: (href: string) => void;
  /** Called after the link is removed, also as `@link-remove` */
  onLinkRemove?: () => void;
}

defineOptions({ name: 'BubbleMenuImageDefault' });

const {
  excludeItems = [],
  placement = 'top',
  offset,
  onHide,
  validateUrl,
  onLinkApply,
  onLinkRemove,
} = defineProps<BubbleMenuImageDefaultProps>();

// The same editor the menu provides to its content.
const { editor } = useCurrentEditor();

const imageHref = useEditorState({
  editor,
  selector: ({ editor: e }) =>
    (e?.getAttributes('image').href as string | null) ?? '',
});

const has = (item: ExcludableItem) => !excludeItems.includes(item);
const hasLink = computed(() => (imageHref.value ?? '') !== '');
const showEditLink = computed(() => has('edit-link'));
const showUnlink = computed(() => has('unlink') && hasLink.value);
const hasToolbarItems = computed(() => showEditLink.value || showUnlink.value);

const trigger = bubbleMenuTriggers.node('image');
</script>

<template>
  <BubbleMenuRoot
    :trigger="trigger"
    :plugin-key="imagePluginKey"
    :placement="placement"
    :offset="offset"
    :on-hide="onHide"
  >
    <BubbleMenuImageToolbar v-if="hasToolbarItems">
      <BubbleMenuImageEditLink v-if="showEditLink" />
      <BubbleMenuImageUnlink v-if="showUnlink" :on-link-remove="onLinkRemove" />
    </BubbleMenuImageToolbar>
    <BubbleMenuImageForm
      v-if="showEditLink"
      :validate-url="validateUrl"
      :on-link-apply="onLinkApply"
      :on-link-remove="onLinkRemove"
    />
  </BubbleMenuRoot>
</template>
