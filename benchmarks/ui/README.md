# Benchmarks for the preview app (`@vuemaildev/ui`)

A collection of [`tinybench`](https://github.com/tinylibs/tinybench) benchmarks that start the
`vuemail dev` preview server as a subprocess and measure how long it takes to render an email
preview, both on a cold start and once the server has already warmed up.

Vuemail's preview server is a Vite-based SPA: the page HTML itself is static, so the real work
happens behind `POST /api/render` (see `packages/ui/src/node/api.ts`). These benchmarks call that
endpoint directly with the slug of an email under `apps/demo/emails`
(`Community/magic-links/notion-magic-link`), rather than fetching the SPA shell.

## Structure

```
├── package.json
├── src
|  ├── utils
|  |  ├── fetch-preview-page.ts
|  |  ├── run-server.ts
|  |  ├── run-server-and-fetch-preview-page.ts
|  |  └── sleep.ts
|  ├── cold-email-previews.ts
|  └── email-previews.ts
└── tsconfig.json
```

- `cold-email-previews.ts` starts a fresh server for every iteration, measuring cold start plus
  first render.
- `email-previews.ts` starts a single server once, then measures repeated renders against the
  already warmed-up server ("hot" previews).

The CLI is resolved from the workspace `@vuemaildev/vuemail` package's built output
(`packages/vuemail/dist/cli/index.mjs`), so `pnpm --filter @vuemaildev/vuemail build` must have run at least
once before these benchmarks work.

## Running benchmarks

```sh
pnpm cold-email-previews
pnpm email-previews
```
