<script setup lang="ts">
import { Text } from '@vuemaildev/vuemail';
</script>

<template>
  <Text
    :style="{
      color: 'rgb(129,140,248)',
      fontSize: '24px',
      lineHeight: '32px',
      fontWeight: 600,
    }"
  >
    Amazing content
  </Text>
  <Text>
    This is the actual content that the accented text above refers to.
  </Text>
</template>
