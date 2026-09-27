<script setup lang="ts">
import { Body, Head, Html, Tailwind, Text } from 'vuemail';
</script>

<template>
  <Tailwind>
    <Html>
      <Head />
      <Body class="bg-black text-white">
        <Text class="m-0 my-4 bg-green-200 text-slate-800">
          This is a testing email template.
        </Text>
      </Body>
    </Html>
  </Tailwind>
</template>
