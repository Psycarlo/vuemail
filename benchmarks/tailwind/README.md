# Benchmarks for the Tailwind component

This is a collection of [`vitest bench`](https://vitest.dev/guide/features.html#benchmarking)
benchmarks (vitest's built-in `tinybench` runner) that we've written for the purpose of
scientifically determining the performance hit that the Tailwind component causes, to try
improving it.

## Structure

```
├── package.json
├── src
|  ├── emails
|  └── with-vs-without.bench.ts
├── vitest.config.ts
└── tsconfig.json
```

Each `*.bench.ts` file under `./src` is a benchmark we have for a specific purpose.

The `emails` folder contains the email components used across the benchmarks. They are Vue
single-file components (`.vue`), so we run them through `vitest bench` with
`@vitejs/plugin-vue` instead of plain `tsx`, which can't load `.vue` files.

## Running benchmarks

```sh
pnpm with-vs-without
```

This compares rendering the same email with, and without, the `Tailwind` component wrapping it.
