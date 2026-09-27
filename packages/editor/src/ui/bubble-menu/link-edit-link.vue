<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue';
import { PencilIcon } from '../icons';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuLinkEditLinkProps
  extends /* @vue-ignore */ Omit<ButtonHTMLAttributes, 'type'> {}

defineOptions({ name: 'BubbleMenuLinkEditLink' });

defineProps<BubbleMenuLinkEditLinkProps>();

const context = useBubbleMenuContext();
</script>

<template>
  <button
    type="button"
    aria-label="Edit link"
    data-re-link-bm-item=""
    data-item="edit-link"
    @mousedown.prevent
    @click="context.setIsEditing(true)"
  >
    <slot><PencilIcon /></slot>
  </button>
</template>
