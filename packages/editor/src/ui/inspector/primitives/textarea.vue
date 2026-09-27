<script setup lang="ts">
import type { TextareaHTMLAttributes } from 'vue';

export interface TextareaProps
  extends /* @vue-ignore */ TextareaHTMLAttributes {}

defineOptions({ name: 'InspectorTextarea' });

defineProps<TextareaProps>();
</script>

<template>
  <textarea data-re-inspector-input="" data-type="textarea" />
</template>
