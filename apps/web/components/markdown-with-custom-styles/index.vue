<script setup lang="ts">
import { Markdown } from '@vuemaildev/vuemail';

const markdown = `## Hello, this is my email template

This is meant to be rendered as a paragraph. There is no way around it.

### Another heading that I wrote`;
</script>

<template>
  <Markdown
    :source="markdown"
    :markdown-custom-styles="{
      h1: { color: 'red' },
      h2: { color: 'blue' },
      codeInline: { background: 'grey' },
    }"
  />
</template>
