<div align="center"><strong>@vuemail/ui</strong></div>
<div align="center">A live preview of your emails right in your browser.</div>
<br />
<div align="center">
<a href="https://vuemail.dev">Website</a>
<span> · </span>
<a href="https://github.com/vuemail/vuemail">GitHub</a>

</div>

This package is used to store the preview server, it is also published and versioned so that it can be installed when the [CLI](../vuemail) is being used.

It has two parts: the preview app, a Vue application in `src/client`, and the server that renders the emails and serves the app, in `src/node`, which compiles the emails with [Vite](https://vite.dev).

## Development workflow

### 1. Start a preview server

Inside of the [playground](../../playground), once the packages are built with `pnpm build` at the root of the monorepo:

```sh
pnpm dev --port 3001
```

This starts the preview server for the emails of the playground on port 3001, which is where the preview app looks for it in development. The files in `playground/emails` can be modified as you see fit since, other than `example.vue`, they are not included in git.

### 2. Run development server

Inside of `packages/ui`:

```sh
pnpm dev
```

This runs the preview app with Vite, which hot reloads it as you change its code, while the emails still come from the preview server of the first step. It lets you work on the UI for the preview server mainly.

### 3. Open in your browser

Go to http://localhost:5173
