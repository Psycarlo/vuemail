<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

export interface BubbleMenuSeparatorProps
  extends /* @vue-ignore */ Pick<HTMLAttributes, 'class'> {}

defineOptions({ name: 'BubbleMenuSeparator' });

defineProps<BubbleMenuSeparatorProps>();
</script>

<template>
  <hr data-re-bubble-menu-separator="" />
</template>
