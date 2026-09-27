import { defineConfig } from 'tsdown';
import vue from 'unplugin-vue/rolldown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'core/index': 'src/core/index.ts',
    'extensions/index': 'src/extensions/index.ts',
    'plugins/index': 'src/plugins/index.ts',
    'ui/index': 'src/ui/index.ts',
    'utils/index': 'src/utils/index.ts',
  },
  format: ['esm'],
  platform: 'neutral',
  plugins: [vue({ isProduction: true })],
  dts: { vue: true },
  deps: {
    neverBundle: [/^vue($|\/)/, /^vuemail($|\/)/, /^@tiptap\//, /^reka-ui/],
  },
});
