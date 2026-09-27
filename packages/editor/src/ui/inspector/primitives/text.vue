<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

export interface TextProps extends /* @vue-ignore */ HTMLAttributes {
  size?: 'sm' | 'base';
  color?: 'default' | 'muted';
}

defineOptions({ name: 'InspectorText' });

const { size, color } = defineProps<TextProps>();
</script>

<template>
  <span
    data-re-inspector-text=""
    :data-size="size || undefined"
    :data-color="color || undefined"
  >
    <slot />
  </span>
</template>
