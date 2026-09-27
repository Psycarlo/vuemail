<script setup lang="ts">
import { Html, Text } from 'vuemail';

const { name = 'there' } = defineProps<{ name?: string }>();

defineOptions({
  PreviewProps: { name: 'Ana' },
});
</script>

<template>
  <Html>
    <Text>Welcome, {{ name }}!</Text>
  </Html>
</template>
