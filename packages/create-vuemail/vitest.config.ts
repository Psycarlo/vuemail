import vue from '@vitejs/plugin-vue';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  // Emails reference their images by URL, so template asset URLs must not
  // be turned into module imports.
  plugins: [vue({ template: { transformAssetUrls: false } })],
  test: {
    environment: 'node',
    // The template is the starter project, whose emails are tested by
    // template-emails.spec.ts. Projects created by the tests go in .test
    exclude: [...configDefaults.exclude, '.test/**', 'template/**'],
    testTimeout: 30_000,
  },
});
