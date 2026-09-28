<script setup lang="ts">
import { Container, Text } from '@vuemaildev/vuemail';
</script>

<template>
  <Container :style="{ backgroundColor: 'rgb(156,163,175)' }">
    <Text
      :style="{
        color: 'rgb(255,255,255)',
        paddingLeft: '12px',
        paddingRight: '12px',
      }"
    >
      Hello, I am a container. I keep content centered and maintain it to a
      maximum width while still taking up as much space as possible!
    </Text>
  </Container>
</template>
