<script setup lang="ts">
import { Html } from '@vuemaildev/vuemail';

defineOptions({ PreviewProps: {} });

throw new Error('This email is broken');
</script>

<template>
  <Html />
</template>
