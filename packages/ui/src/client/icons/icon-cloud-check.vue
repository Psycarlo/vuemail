<script setup lang="ts">
import IconBase from './icon-base.vue';

defineProps<{ size?: number | string }>();
</script>

<template>
  <IconBase
    :size="size"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
  >
    <path d="m17 15-5.5 5.5L9 18" />
    <path d="M5 17.743A7 7 0 1 1 15.71 10h1.79a4.5 4.5 0 0 1 1.5 8.742" />
  </IconBase>
</template>
