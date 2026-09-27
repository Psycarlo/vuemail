<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue';

export interface IconButtonProps
  extends /* @vue-ignore */ ButtonHTMLAttributes {}

defineOptions({ name: 'IconButton' });

defineProps<IconButtonProps>();
</script>

<template>
  <button type="button" data-re-inspector-icon-button="">
    <slot />
  </button>
</template>
