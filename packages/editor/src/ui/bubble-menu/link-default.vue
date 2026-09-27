<script lang="ts">
import { PluginKey } from '@tiptap/pm/state';

const linkPluginKey = new PluginKey('linkBubbleMenu');

type ExcludableItem = 'edit-link' | 'open-link' | 'unlink';
</script>

<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import BubbleMenuLinkEditLink from './link-edit-link.vue';
import BubbleMenuLinkForm from './link-form.vue';
import BubbleMenuLinkOpenLink from './link-open-link.vue';
import BubbleMenuLinkToolbar from './link-toolbar.vue';
import BubbleMenuLinkUnlink from './link-unlink.vue';
import BubbleMenuRoot from './root.vue';
import { bubbleMenuTriggers } from './triggers';

export interface BubbleMenuLinkDefaultProps
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

defineOptions({ name: 'BubbleMenuLinkDefault' });

const {
  excludeItems = [],
  placement = 'top',
  offset,
  onHide,
  validateUrl,
  onLinkApply,
  onLinkRemove,
} = defineProps<BubbleMenuLinkDefaultProps>();

const has = (item: ExcludableItem) => !excludeItems.includes(item);

const hasToolbarItems = computed(
  () => has('edit-link') || has('open-link') || has('unlink'),
);

const trigger = bubbleMenuTriggers.nodeWithoutSelection('link');
</script>

<template>
  <BubbleMenuRoot
    :trigger="trigger"
    :plugin-key="linkPluginKey"
    :placement="placement"
    :offset="offset"
    :on-hide="onHide"
  >
    <BubbleMenuLinkToolbar v-if="hasToolbarItems">
      <BubbleMenuLinkEditLink v-if="has('edit-link')" />
      <BubbleMenuLinkOpenLink v-if="has('open-link')" />
      <BubbleMenuLinkUnlink v-if="has('unlink')" />
    </BubbleMenuLinkToolbar>
    <BubbleMenuLinkForm
      :validate-url="validateUrl"
      :on-link-apply="onLinkApply"
      :on-link-remove="onLinkRemove"
    />
  </BubbleMenuRoot>
</template>
