<script setup lang="ts">
import IconBase from './icon-base.vue';

defineProps<{ size?: number | string }>();
</script>

<template>
  <IconBase :size="size">
    <path
      d="M17.4 15L21 11.5L17.4 8M6.6 8L3 11.5L6.6 15M14.25 4.5L9.75 18.5"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
    />
  </IconBase>
</template>
