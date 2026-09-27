<script setup lang="ts">
import type { IconProps } from './types';

defineOptions({ name: 'ImageIcon' });

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
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
</template>
