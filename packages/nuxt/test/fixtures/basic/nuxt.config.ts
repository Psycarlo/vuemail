import tailwindcss from '@tailwindcss/vite';
import vuemail from '../../../src/module';

export default defineNuxtConfig({
  modules: [vuemail],
  css: ['~/assets/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  nitro: {
    // vuemail is linked from the monorepo, outside of any node_modules, which
    // Nitro can't trace. Leaving its dependencies where they are makes it
    // load like it does when installed from npm.
    externals: { trace: false },
  },
  compatibilityDate: '2026-09-01',
});
