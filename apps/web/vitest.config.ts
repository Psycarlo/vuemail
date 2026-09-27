import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue({ template: { transformAssetUrls: false } })],
  test: {
    environment: 'node',
    include: [
      'components/**/*.spec.ts',
      'server/**/*.spec.ts',
      'app/**/*.spec.ts',
    ],
    testTimeout: 30_000,
  },
});
