<div align="center"><strong>@vuemaildev/nuxt</strong></div>
<div align="center">Render Vuemail emails in your Nuxt server routes.</div>
<br />
<div align="center">
<a href="https://vuemail.dev">Website</a>
<span> · </span>
<a href="https://github.com/psycarlo/vuemail">GitHub</a>

</div>

## Introduction

Nitro, the server of Nuxt, can't import Vue single file components on its own. This module lets it bundle them, so that your server routes can import the emails you write with [Vuemail](https://github.com/psycarlo/vuemail/tree/main/packages/vuemail) and render them into HTML.

It works with Nuxt 4 and Nuxt 3.13 or later, and with Tailwind CSS 4 in both your app and your emails.

## Install

```sh
npm i @vuemaildev/vuemail @vuemaildev/nuxt
```

## Getting started

Add the module to your Nuxt config:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vuemaildev/nuxt'],
});
```

Write your emails in an `emails` directory at the root of your project:

```vue
<!-- emails/welcome.vue -->
<script setup lang="ts">
import { Body, Button, Head, Html, Preview, Text } from '@vuemaildev/vuemail';

const { name } = defineProps<{ name: string }>();

defineOptions({
  PreviewProps: { name: 'Ana' },
});
</script>

<template>
  <Html lang="en">
    <Head />
    <Body>
      <Preview>Welcome, {{ name }}</Preview>
      <Text>Welcome, {{ name }}!</Text>
      <Button href="https://vuemail.dev">Get started</Button>
    </Body>
  </Html>
</template>
```

Then render them in your server routes:

```ts
// server/api/send.post.ts
import { render } from '@vuemaildev/vuemail';
import WelcomeEmail from '~~/emails/welcome.vue';

export default defineEventHandler(async (event) => {
  const { name } = await readBody<{ name: string }>(event);

  const html = await render(WelcomeEmail, { name });
  const text = await render(WelcomeEmail, { name }, { plainText: true });

  // send them with the email service provider of your choice
});
```

Kept in `emails`, the same emails can be previewed with the `email dev` command of `@vuemaildev/vuemail`, which runs the preview app from `@vuemaildev/ui`:

```sh
npm i -D @vuemaildev/ui
npx vuemail dev
```

See the [Resend example](https://github.com/psycarlo/vuemail/tree/main/examples/resend) for a complete app.

## Options

The module is configured under the `vuemail` key of your Nuxt config.

### `compilerOptions`

Options for [unplugin-vue](https://github.com/unplugin/unplugin-vue), the compiler of the single file components Nitro bundles, the emails your server routes import.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vuemaildev/nuxt'],
  vuemail: {
    compilerOptions: {
      // any option of unplugin-vue, like `include`, `exclude`, `script` or `template`
    },
  },
});
```

`template.transformAssetUrls` is always `false`, since emails reference their images by URL, and `isProduction` defaults to `true` outside of `nuxt dev`. The preview app compiles emails with the defaults of `@vitejs/plugin-vue`, so options that change what emails render make them differ from their preview.

## How it works

The module adds the compiler to Nitro's Rollup plugins, so that `.vue` files imported from server code are compiled for the server.

In production builds, the module keeps `@vuemaildev/vuemail` and `@vuemaildev/render` as external dependencies of the server, even when they're linked from a workspace, so that they load their own dependencies, like Tailwind CSS, instead of the versions your app hoists.

## License

MIT License
