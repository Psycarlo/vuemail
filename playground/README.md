# Vuemail Playground

This is a playground for Vuemail made to experiment with components in realtime.

It renders the components straight from their source, through a path alias of `@vuemaildev/vuemail` in `tsconfig.json`, with hot reloading in the `dev` script.

## Development workflow

### 1. Create an email template

Create a new file at `playground/emails/testing.vue`

```vue emails/testing.vue
<script setup lang="ts">
import { Body, Head, Html, Tailwind, Text } from '@vuemaildev/vuemail';
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
```

Files in `emails` other than `example.vue` are ignored by git, so you can experiment freely.

### 2. Run playground server

```sh
pnpm dev
```

### 3. Open in your browser

Go to http://localhost:3000
