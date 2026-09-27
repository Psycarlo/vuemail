<script setup lang="ts">
import type { LabelHTMLAttributes } from 'vue';

export interface LabelProps extends /* @vue-ignore */ LabelHTMLAttributes {}

defineOptions({ name: 'InspectorLabel' });

defineProps<LabelProps>();
</script>

<template>
  <!-- The consumer provides `for` -->
  <label data-re-inspector-label=""><slot /></label>
</template>
