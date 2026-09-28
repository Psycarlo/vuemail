<script setup lang="ts">
import type { LabelHTMLAttributes } from 'vue';

export interface LabelProps extends /* @vue-ignore */ LabelHTMLAttributes {}

defineOptions({ name: 'InspectorLabel' });

defineProps<LabelProps>();

// The consumer provides `for`, which falls through to the label. (A comment
// in the template would render a fragment, which attributes can't fall
// through to.)
</script>

<template>
  <label data-re-inspector-label=""><slot /></label>
</template>
