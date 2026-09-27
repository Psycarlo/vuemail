<script setup lang="ts">
import type { IconProps } from './types';

defineOptions({ name: 'TextQuoteIcon' });

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
    <path d="M17 5H3" />
    <path d="M21 12H8" />
    <path d="M21 19H8" />
    <path d="M3 12v7" />
  </svg>
</template>
