<script setup lang="ts">
import { Markdown } from '../markdown';

defineProps<{ content: string }>();
</script>

<template>
  <Markdown>{{ content }}</Markdown>
</template>
