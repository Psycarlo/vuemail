<script setup lang="ts">
import IconBase from './icon-base.vue';

defineProps<{ size?: number | string }>();
</script>

<template>
  <IconBase :size="size">
    <path
      d="M12 16L6 9.85966L6.84 9L12 14.2808L17.16 9L18 9.85966L12 16Z"
      fill="currentColor"
    />
  </IconBase>
</template>
