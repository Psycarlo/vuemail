<script setup lang="ts">
import { Text } from '@vuemaildev/vuemail';

defineOptions({
  PreviewProps: { code: '123456' },
});

defineProps<{ code: string }>();
</script>

<template>
  <Text>{{ code }}</Text>
</template>
