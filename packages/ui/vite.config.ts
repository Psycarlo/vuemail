import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// Builds the preview app, which the preview server serves as static files.
export default defineConfig({
  root: fileURLToPath(new URL('./src/client', import.meta.url)),
  base: '/',
  plugins: [vue(), tailwindcss()],
  build: {
    outDir: fileURLToPath(new URL('./dist/client', import.meta.url)),
    emptyOutDir: true,
    // The app is served locally by the preview server, so one bigger chunk
    // loads faster than many small ones
    chunkSizeWarningLimit: 1000,
  },
  server: {
    // `pnpm dev` runs the preview app against a preview server started
    // separately with `email dev --port 3001`.
    proxy: {
      '/api/': 'http://localhost:3001',
      '/static/': 'http://localhost:3001',
    },
  },
});
