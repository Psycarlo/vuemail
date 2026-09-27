<script setup lang="ts">
import { Button } from '../../button';
</script>

<template>
  <Button href="https://vuemail.dev" class="rounded-md bg-blue-600 px-3 py-2 text-sm text-gray-200">
    <slot />
  </Button>
</template>
