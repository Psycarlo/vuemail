<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue';

export interface TextFieldProps extends /* @vue-ignore */ InputHTMLAttributes {}

defineOptions({ name: 'TextField' });

defineProps<TextFieldProps>();
</script>

<template>
  <input data-re-inspector-input="" />
</template>
