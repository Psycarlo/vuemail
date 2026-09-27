<script setup lang="ts">
withDefaults(defineProps<{ size?: number | string }>(), { size: 20 });
</script>

<template>
  <svg
    fill="none"
    :height="size"
    viewBox="0 0 24 24"
    :width="size"
    xmlns="http://www.w3.org/2000/svg"
  >
    <slot />
  </svg>
</template>
