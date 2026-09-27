<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuLinkToolbarProps
  extends /* @vue-ignore */ HTMLAttributes {}

defineOptions({ name: 'BubbleMenuLinkToolbar' });

defineProps<BubbleMenuLinkToolbarProps>();

const context = useBubbleMenuContext();
</script>

<template>
  <div v-if="!context.isEditing" data-re-link-bm-toolbar="">
    <slot />
  </div>
</template>
