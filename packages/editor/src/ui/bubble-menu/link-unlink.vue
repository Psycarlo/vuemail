<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue';
import { UnlinkIcon } from '../icons';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuLinkUnlinkProps
  extends /* @vue-ignore */ Omit<ButtonHTMLAttributes, 'type'> {}

defineOptions({ name: 'BubbleMenuLinkUnlink' });

defineProps<BubbleMenuLinkUnlinkProps>();

const context = useBubbleMenuContext();
</script>

<template>
  <button
    type="button"
    aria-label="Remove link"
    data-re-link-bm-item=""
    data-item="unlink"
    @mousedown.prevent
    @click="context.editor.chain().focus().unsetLink().run()"
  >
    <slot><UnlinkIcon /></slot>
  </button>
</template>
