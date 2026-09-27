<script setup lang="ts">
import IconBase from './icon-base.vue';

defineProps<{ size?: number | string }>();
</script>

<template>
  <IconBase :size="size">
    <g
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    >
      <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </g>
  </IconBase>
</template>
