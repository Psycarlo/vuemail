import fs from 'node:fs';
import path from 'node:path';
import { addTypeTemplate, defineNuxtModule } from 'nuxt/kit';

/**
 * Makes the components of the gallery, in the `components` directory,
 * available to the server: `#gallery` imports each of their variants, and
 * the `assets:gallery` storage holds their source code.
 */
export default defineNuxtModule({
  meta: { name: 'gallery' },
  setup(_options, nuxt) {
    const galleryDirectory = path.resolve(nuxt.options.rootDir, 'components');

    const generateRegistry = () => {
      const entries = fs
        .readdirSync(galleryDirectory, { withFileTypes: true })
        .filter(
          (dirent) => dirent.isDirectory() && !dirent.name.startsWith('_'),
        )
        .map((dirent) => {
          const variants = fs
            .readdirSync(path.join(galleryDirectory, dirent.name))
            .filter((filename) => filename.endsWith('.vue'))
            .sort()
            .map((filename) => {
              const variant = filename.slice(0, -'.vue'.length);
              const filePath = path
                .join(galleryDirectory, dirent.name, filename)
                .replaceAll('\\', '/');
              return `    ${JSON.stringify(variant)}: () => import(${JSON.stringify(filePath)}),`;
            });
          return `  ${JSON.stringify(dirent.name)}: {\n${variants.join('\n')}\n  },`;
        });

      const layoutPath = path
        .join(galleryDirectory, '_components', 'layout.vue')
        .replaceAll('\\', '/');
      return [
        `export const loadLayout = () => import(${JSON.stringify(layoutPath)});`,
        `export const variants = {\n${entries.join('\n')}\n};`,
      ].join('\n');
    };

    addTypeTemplate(
      {
        filename: 'types/gallery.d.ts',
        getContents: () => `declare module '#gallery' {
  import type { Component } from 'vue';

  type Loader = () => Promise<{ default: Component }>;

  export const loadLayout: Loader;
  export const variants: Record<string, Record<string, Loader>>;
}
`,
      },
      // Also for the app, which gets the types of the API routes it fetches
      { nitro: true, nuxt: true },
    );

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.virtual ??= {};
      nitroConfig.virtual['#gallery'] = generateRegistry;

      nitroConfig.serverAssets ??= [];
      nitroConfig.serverAssets.push({
        baseName: 'gallery',
        dir: galleryDirectory,
      });
    });
  },
});
