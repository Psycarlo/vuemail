import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Emails reference their images by URL, so template asset URLs must not
  // be turned into module imports.
  plugins: [vue({ template: { transformAssetUrls: false } })],
  test: {
    globals: true,
    environment: 'node',
    exclude: ['**/e2e/**', '**/node_modules/**', '**/fixtures/**'],
  },
});
