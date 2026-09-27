<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue';
import { UnlinkIcon } from '../icons';
import { useBubbleMenuContext } from './context';
import { focusEditor } from './utils';

export interface BubbleMenuButtonUnlinkProps
  extends /* @vue-ignore */ Omit<ButtonHTMLAttributes, 'type'> {
  /** Called after the link is removed, also as `@link-remove` */
  onLinkRemove?: () => void;
}

defineOptions({ name: 'BubbleMenuButtonUnlink', inheritAttrs: false });

const { onLinkRemove } = defineProps<BubbleMenuButtonUnlinkProps>();

const context = useBubbleMenuContext();

const handleClick = () => {
  context.editor.commands.updateButton({ href: '#' });
  focusEditor(context.editor);
  onLinkRemove?.();
};
</script>

<template>
  <button
    v-bind="$attrs"
    type="button"
    aria-label="Remove link"
    data-re-btn-bm-item=""
    data-item="unlink"
    @mousedown.prevent
    @click="handleClick"
  >
    <slot><UnlinkIcon /></slot>
  </button>
</template>
