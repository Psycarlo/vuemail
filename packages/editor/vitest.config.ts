import vue from '@vitejs/plugin-vue';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'happy-dom',
          include: ['src/**/*.spec.ts'],
          exclude: ['src/**/*.browser.spec.ts'],
        },
      },
      {
        // Specs that type into the editor and depend on layout run in a real
        // browser: `pnpm exec playwright install chromium` installs it
        extends: true,
        test: {
          name: 'browser',
          include: ['src/**/*.browser.spec.ts'],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
            headless: true,
          },
        },
      },
    ],
  },
});
