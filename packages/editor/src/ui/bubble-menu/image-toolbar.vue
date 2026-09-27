<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuImageToolbarProps
  extends /* @vue-ignore */ HTMLAttributes {}

defineOptions({ name: 'BubbleMenuImageToolbar' });

defineProps<BubbleMenuImageToolbarProps>();

const context = useBubbleMenuContext();
</script>

<template>
  <div v-if="!context.isEditing" data-re-img-bm-toolbar="">
    <slot />
  </div>
</template>
