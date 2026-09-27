<script setup lang="ts">
import IconBase from './icon-base.vue';

defineProps<{ size?: number | string }>();
</script>

<template>
  <IconBase :size="size">
    <path
      d="M4.75 14.75v1.5a3 3 0 0 0 3 3h8.5a3 3 0 0 0 3-3v-1.5M12 14.25v-9.5M8.75 10.75l3.25 3.5 3.25-3.5"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
    />
  </IconBase>
</template>
