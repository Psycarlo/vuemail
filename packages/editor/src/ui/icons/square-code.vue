<script setup lang="ts">
import type { IconProps } from './types';

defineOptions({ name: 'SquareCodeIcon' });

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
    <path d="m10 9-3 3 3 3" />
    <path d="m14 15 3-3-3-3" />
    <rect x="3" y="3" width="18" height="18" rx="2" />
  </svg>
</template>
