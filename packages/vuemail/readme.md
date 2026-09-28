![Vuemail cover](../../apps/web/public/static/covers/vuemail.png)

<div align="center"><strong>Vuemail</strong></div>
<div align="center">The next generation of writing emails.<br />High-quality, unstyled components for creating emails with Vue.</div>
<br />
<div align="center">
<a href="https://vuemail.dev">Website</a>
<span> · </span>
<a href="https://github.com/psycarlo/vuemail">GitHub</a>

</div>

## Getting started

To get started, open a new shell and run:

```sh
npx create-vuemail@latest
```

This will create a new folder called `vuemail-starter` with a few email templates.

To add Vuemail to an existing project instead, install it:

```sh
npm i vuemail
```

## Components

Emails are Vue single file components that use the components of this package, in the `emails` directory:

```vue
<script setup lang="ts">
import { Button, Html } from 'vuemail';

const { url } = defineProps<{ url: string }>();

defineOptions({
  PreviewProps: { url: 'https://vuemail.dev' },
});
</script>

<template>
  <Html lang="en">
    <Button :href="url">Click me</Button>
  </Html>
</template>
```

`PreviewProps` are the props the preview renders the email with. The components are:

- [Html](https://github.com/psycarlo/vuemail/tree/main/packages/vuemail/src/components/html)
- [Head](https://github.com/psycarlo/vuemail/tree/main/packages/vuemail/src/components/head)
- [Body](https://github.com/psycarlo/vuemail/tree/main/packages/vuemail/src/components/body)
- [Button](https://github.com/psycarlo/vuemail/tree/main/packages/vuemail/src/components/button)
- [Container](https://github.com/psycarlo/vuemail/tree/main/packages/vuemail/src/components/container)
- [CodeBlock](https://github.com/psycarlo/vuemail/tree/main/packages/vuemail/src/components/code-block)
- [CodeInline](https://github.com/psycarlo/vuemail/tree/main/packages/vuemail/src/components/code-inline)
- [Column](https://github.com/psycarlo/vuemail/tree/main/packages/vuemail/src/components/column)
- [Row](https://github.com/psycarlo/vuemail/tree/main/packages/vuemail/src/components/row)
- [Font](https://github.com/psycarlo/vuemail/tree/main/packages/vuemail/src/components/font)
- [Heading](https://github.com/psycarlo/vuemail/tree/main/packages/vuemail/src/components/heading)
- [Hr](https://github.com/psycarlo/vuemail/tree/main/packages/vuemail/src/components/hr)
- [Img](https://github.com/psycarlo/vuemail/tree/main/packages/vuemail/src/components/img)
- [Link](https://github.com/psycarlo/vuemail/tree/main/packages/vuemail/src/components/link)
- [Markdown](https://github.com/psycarlo/vuemail/tree/main/packages/vuemail/src/components/markdown)
- [Preview](https://github.com/psycarlo/vuemail/tree/main/packages/vuemail/src/components/preview)
- [Section](https://github.com/psycarlo/vuemail/tree/main/packages/vuemail/src/components/section)
- [Tailwind](https://github.com/psycarlo/vuemail/tree/main/packages/vuemail/src/components/tailwind)
- [Text](https://github.com/psycarlo/vuemail/tree/main/packages/vuemail/src/components/text)

This package also exports `render`, from [`@vuemail/render`](https://github.com/psycarlo/vuemail/tree/main/packages/render), which turns an email into HTML or plain text.

## Commands

The package comes with the `email` command. It runs the preview app, `@vuemail/ui`, which it asks to install as a dev dependency, in the same version as `vuemail`, the first time you use it.

### `email dev`

Starts a local development server that will watch your files and automatically rebuild your email when you make changes.

```sh
npx vuemail dev
```

| Flag                      | Default    | Description                                                                                  |
| ------------------------- | ---------- | -------------------------------------------------------------------------------------------- |
| `-d, --dir <path>`        | `./emails` | Directory with your email templates                                                          |
| `-p, --port <port>`       | `3000`     | Port to run the dev server on                                                                |
| `-c, --clients <clients>` |            | Comma-separated list of email clients to show compatibility warnings for, like `gmail,outlook` |
| `--vite-plugins <path>` |            | Module whose default export is an array of Vite plugins (or a function returning one) to compile your emails with |

When `--clients` is left out, the `COMPATIBILITY_EMAIL_CLIENTS` environment variable is used, and without it the compatibility checks cover Gmail, Apple Mail, Outlook and Yahoo! Mail. The supported clients are `gmail`, `outlook`, `yahoo`, `apple-mail`, `aol`, `thunderbird`, `microsoft`, `samsung-email`, `sfr`, `orange`, `protonmail`, `hey`, `mail-ru`, `fastmail`, `laposte`, `t-online-de`, `free-fr`, `gmx`, `web-de`, `ionos-1and1`, `rainloop` and `wp-pl`.

Templates are compiled with [Vite](https://vite.dev) and its [Vue plugin](https://github.com/vitejs/vite-plugin-vue), so they can be single file components written in TypeScript, and the `paths` aliases of your `tsconfig.json` are resolved. To compile them with more [Vite plugins](https://vite.dev/plugins/), like one that imports another kind of file, pass `--vite-plugins` a module whose default export is an array of plugins (or a function returning one). `email build` and `email export` take it too.

### `email build`

Builds the preview app, with all of your emails, into a static website.

```sh
npx vuemail build
```

| Flag                      | Default    | Description                                                                |
| ------------------------- | ---------- | -------------------------------------------------------------------------- |
| `-d, --dir <path>`        | `./emails` | Directory with your email templates                                        |
| `-o, --outDir <path>`     | `.vuemail` | Output directory                                                           |
| `-c, --clients <clients>` |            | Comma-separated list of email clients to show compatibility warnings for |
| `--vite-plugins <path>` |            | Module whose default export is an array of Vite plugins (or a function returning one) to compile your emails with |

### `email start`

Runs the built preview app that is inside of `.vuemail`.

```sh
npx vuemail start
```

| Flag                | Default    | Description                         |
| ------------------- | ---------- | ----------------------------------- |
| `-d, --dir <path>`  | `.vuemail` | Directory with the built preview    |
| `-p, --port <port>` | `3000`     | Port to run the server on           |

### `email export`

Generates the plain HTML files of your emails into a `out` directory.

```sh
npx vuemail export
```

| Flag                          | Default    | Description                                                             |
| ----------------------------- | ---------- | ----------------------------------------------------------------------- |
| `--outDir <path>`             | `out`      | Output directory                                                        |
| `-p, --pretty`                | `false`    | Pretty print the output                                                 |
| `-t, --plainText`             | `false`    | Set output format as plain text                                         |
| `-d, --dir <path>`            | `./emails` | Directory with your email templates                                     |
| `-e, --extension <extension>` |            | Set a custom file extension for rendered emails (e.g. `blade.php`)      |
| `-s, --silent`                | `false`    | Don't show a spinner with process information                           |
| `--vite-plugins <path>` |            | Module whose default export is an array of Vite plugins (or a function returning one) to compile your emails with |

### `email resend`

Connects the CLI to your [Resend](https://resend.com) account through an API key, so that you can upload your emails to Resend as templates from the preview app.

```sh
npx vuemail resend setup
```

To delete the API key from the Vuemail configuration:

```sh
npx vuemail resend reset
```

## Setting Up the Environment

When working in the CLI, a lot of friction can get introduced with rebuilding it for every change. To avoid that, you can keep it building in watch mode, and run it from the [playground](https://github.com/psycarlo/vuemail/tree/main/playground), which uses the `vuemail` package of this monorepo.

This assumes the packages were built once, with `pnpm build` at the root of the monorepo, since the CLI runs the preview app from `@vuemail/ui`'s build.

### 1. Build `vuemail` in watch mode

Inside of `packages/vuemail`:

```sh
pnpm build:watch
```

### 2. Run the CLI

From the `playground` directory:

```sh
pnpm exec email [command] [flags]
```

## License

MIT License
