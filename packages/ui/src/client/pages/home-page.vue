<script setup lang="ts">
import logo from '../assets/logo.svg';
import Button from '../components/button.vue';
import CodeSnippet from '../components/code-snippet.vue';
import Heading from '../components/heading.vue';
import Text from '../components/text.vue';
import { config } from '../config';

document.title = 'Vuemail';
</script>

<template>
  <div class="w-full h-full flex items-center justify-center p-8">
    <div
      class="-mt-10 relative max-w-lg flex flex-col items-center gap-3 text-center"
    >
      <img
        alt="Vuemail Icon"
        class="mb-8"
        height="144"
        :src="logo"
        :style="{
          borderRadius: '34px',
          boxShadow: '0 .625rem 12.5rem 1.25rem #2BA16A80',
        }"
        width="141"
      />
      <Heading as="h2" size="6" weight="medium">Welcome to Vuemail</Heading>
      <Text as="p">
        To start developing your emails, you can create a<br />
        <CodeSnippet>.vue</CodeSnippet> file under your
        <CodeSnippet>{{ config.emailsDirectoryName }}</CodeSnippet> folder.
      </Text>
      <Button as="a" class="mt-3" href="https://vuemail.dev/docs" size="3"
        >Check the docs</Button
      >
    </div>
  </div>
</template>
