<script setup lang="ts">
import { CodeInline, Text } from 'vuemail';
</script>

<template>
  <Text :style="{ textAlign: 'center' }">
    Install the
    <CodeInline
      :style="{
        backgroundColor: 'rgb(134,239,172)',
        borderRadius: '6px',
        paddingLeft: '4px',
        paddingRight: '4px',
        paddingTop: '2px',
        paddingBottom: '2px',
      }"
    >vuemail</CodeInline> package
  </Text>
</template>
