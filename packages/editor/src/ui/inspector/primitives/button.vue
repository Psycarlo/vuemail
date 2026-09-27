<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue';

export interface ButtonProps extends /* @vue-ignore */ ButtonHTMLAttributes {
  variant?: string;
}

defineOptions({ name: 'InspectorButton' });

const { variant } = defineProps<ButtonProps>();
</script>

<template>
  <button
    type="button"
    data-re-inspector-button=""
    :data-variant="variant || undefined"
  >
    <slot />
  </button>
</template>
