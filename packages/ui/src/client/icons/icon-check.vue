<script setup lang="ts">
import IconBase from './icon-base.vue';

defineProps<{ size?: number | string }>();
</script>

<template>
  <IconBase :size="size">
    <path
      d="M16.25 8.75L10.406 15.25L7.75 12.75"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
    />
  </IconBase>
</template>
