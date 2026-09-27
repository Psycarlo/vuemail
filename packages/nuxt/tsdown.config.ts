import { defineConfig } from 'tsdown';

export default defineConfig({
  dts: true,
  entry: ['./src/module.ts'],
  format: ['esm'],
  outDir: './dist',
  platform: 'node',
  deps: {
    neverBundle: [/^@nuxt\//, /^nuxt($|\/)/, /^unplugin-vue($|\/)/],
  },
});
