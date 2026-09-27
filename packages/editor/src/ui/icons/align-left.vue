<script setup lang="ts">
import type { IconProps } from './types';

defineOptions({ name: 'AlignLeftIcon' });

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
    <path d="M21 5H3" />
    <path d="M15 12H3" />
    <path d="M17 19H3" />
  </svg>
</template>
