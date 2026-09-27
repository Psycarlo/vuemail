<script setup lang="ts">
import { Text } from 'vuemail';

defineOptions({
  PreviewProps: { code: '123456' },
});

defineProps<{ code: string }>();
</script>

<template>
  <Text>{{ code }}</Text>
</template>
