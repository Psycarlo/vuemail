<script setup lang="ts">
import type { IconProps } from './types';

defineOptions({ name: 'SquareRoundCornerIcon' });

const { size, width, height } = defineProps<IconProps>();
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size ?? width ?? 24"
    :height="size ?? height ?? 24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M14 3a8 8 0 0 1 8 8" />
  </svg>
</template>
