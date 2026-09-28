<script setup lang="ts">
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Tailwind,
  Text,
} from '@vuemaildev/vuemail';

const { name } = defineProps<{ name: string }>();
</script>

<template>
  <Html>
    <Tailwind>
      <Head />
      <Preview>Welcome, {{ name }}</Preview>
      <Body class="bg-white font-sans">
        <Container class="mx-auto p-4 sm:p-8">
          <Text class="text-lg text-green-700">Welcome, {{ name }}!</Text>
          <Button href="https://vuemail.dev" class="rounded bg-green-600 px-4 py-2 text-white">
            Get started
          </Button>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
