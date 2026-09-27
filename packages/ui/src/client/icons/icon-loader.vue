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
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </IconBase>
</template>
