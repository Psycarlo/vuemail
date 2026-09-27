<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue';
import { PencilIcon } from '../icons';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuImageEditLinkProps
  extends /* @vue-ignore */ Omit<ButtonHTMLAttributes, 'type'> {}

defineOptions({ name: 'BubbleMenuImageEditLink', inheritAttrs: false });

defineProps<BubbleMenuImageEditLinkProps>();

const context = useBubbleMenuContext();
</script>

<template>
  <button
    v-bind="$attrs"
    type="button"
    aria-label="Edit link"
    data-re-img-bm-item=""
    data-item="edit-link"
    @mousedown.prevent
    @click="context.setIsEditing(true)"
  >
    <slot><PencilIcon /></slot>
  </button>
</template>
