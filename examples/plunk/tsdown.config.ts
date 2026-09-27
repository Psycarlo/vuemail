import { defineConfig } from 'tsdown';
import vue from 'unplugin-vue/rolldown';

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node20',
  // Compiles the emails, which are Vue single file components
  plugins: [vue({ isProduction: true })],
});
