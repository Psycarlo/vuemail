import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Builds and starts real Nuxt apps
    testTimeout: 60_000,
    hookTimeout: 300_000,
    exclude: ['**/node_modules/**', '**/fixtures/**'],
  },
});
