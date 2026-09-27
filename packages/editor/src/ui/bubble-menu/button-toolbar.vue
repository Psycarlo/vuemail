<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuButtonToolbarProps
  extends /* @vue-ignore */ HTMLAttributes {}

defineOptions({ name: 'BubbleMenuButtonToolbar' });

defineProps<BubbleMenuButtonToolbarProps>();

const context = useBubbleMenuContext();
</script>

<template>
  <div v-if="!context.isEditing" data-re-btn-bm-toolbar="">
    <slot />
  </div>
</template>
