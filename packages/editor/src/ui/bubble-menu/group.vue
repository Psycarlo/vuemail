<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

export interface BubbleMenuItemGroupProps
  extends /* @vue-ignore */ Pick<HTMLAttributes, 'class'> {}

defineOptions({ name: 'BubbleMenuItemGroup' });

defineProps<BubbleMenuItemGroupProps>();
</script>

<template>
  <fieldset data-re-bubble-menu-group="">
    <slot />
  </fieldset>
</template>
