<script setup lang="ts">
import { Button, Html } from '@vuemaildev/vuemail';

const { url } = defineProps<{ url: string }>();
</script>

<template>
  <Html lang="en">
    <Button :href="url">Click me</Button>
  </Html>
</template>
