import { defineConfig } from 'tsdown';

export default defineConfig({
  dts: true,
  entry: ['./src/node/index.ts'],
  format: ['esm'],
  outDir: './dist/node',
  platform: 'node',
  deps: {
    neverBundle: [
      /^vite($|\/)/,
      /^@vitejs\//,
      /^vue($|\/)/,
      /^@vuemaildev\/vuemail($|\/)/,
    ],
  },
});
