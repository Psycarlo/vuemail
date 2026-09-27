<script setup lang="ts">
import type { IconProps } from './types';

defineOptions({ name: 'AlignEndVerticalIcon' });

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
    <rect width="9" height="6" x="9" y="14" rx="2" />
    <rect width="16" height="6" x="2" y="4" rx="2" />
    <path d="M22 2v20" />
  </svg>
</template>
