<script setup lang="ts">
import { Hr, Text } from '@vuemaildev/vuemail';
</script>

<template>
  <Text>Before divider</Text>
  <Hr
    :style="{
      marginTop: '16px',
      borderColor: 'rgb(209,213,219)',
      marginBottom: '16px',
      borderTopWidth: '2px',
    }"
  />
  <Text>After divider</Text>
</template>
