<script setup lang="ts">
import { CodeBlock, dracula, Font } from 'vuemail';

const code = `await resend.emails.send({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  react: EmailTemplate({ firstName: 'John' }),
});`;
</script>

<template>
  <Font
    fallback-font-family="monospace"
    font-family="CommitMono"
    font-style="normal"
    :font-weight="400"
    :web-font="{
      url: '/fonts/commit-mono/commit-mono-regular.ttf',
      format: 'truetype',
    }"
  />
  <CodeBlock
    :code="code"
    font-family="'CommitMono', monospace"
    language="javascript"
    :theme="dracula"
  />
</template>
