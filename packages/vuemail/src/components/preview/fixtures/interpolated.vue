<script setup lang="ts">
import { Preview } from '../preview';

defineProps<{ name: string }>();
</script>

<template>
  <Preview>Welcome, {{ name }}!</Preview>
</template>
