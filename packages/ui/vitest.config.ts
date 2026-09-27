import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

// Specs of the preview app run in happy-dom, the ones of the server opt into
// Node with a `// @vitest-environment node` comment.
export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['src/**/*.spec.ts'],
  },
});
