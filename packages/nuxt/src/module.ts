import { defineNuxtModule } from '@nuxt/kit';
// Types Nitro's hooks, like `nitro:config`, which Nuxt 4.5 moved to its server
import type {} from '@nuxt/nitro-server/augments';
import vue from 'unplugin-vue/rollup';

export interface ModuleOptions {
  /**
   * Options for the compiler of the single file components Nitro bundles,
   * the emails your server routes import.
   */
  compilerOptions?: Parameters<typeof vue>[0];
}

const toArray = <Item>(value: Item | Item[] | undefined | null): Item[] => {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
};

/**
 * Lets Nitro, Nuxt's server, bundle emails written as single file
 * components, so that server routes can import and render them.
 *
 * @example
 * ```ts
 * // server/api/welcome.post.ts
 * import { render } from 'vuemail';
 * import WelcomeEmail from '~~/emails/welcome.vue';
 *
 * export default defineEventHandler(async () => {
 *   const html = await render(WelcomeEmail, { name: 'Ana' });
 *   // send it with the provider of your choice
 * });
 * ```
 */
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@vuemail/nuxt',
    configKey: 'vuemail',
    compatibility: { nuxt: '>=3.13.0' },
  },
  defaults: {},
  setup(options, nuxt) {
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.rollupConfig ??= {};
      nitroConfig.rollupConfig.plugins = [
        ...toArray(nitroConfig.rollupConfig.plugins),
        vue({
          isProduction: !nuxt.options.dev,
          ...options.compilerOptions,
          template: {
            ...options.compilerOptions?.template,
            // Emails reference their images by URL, so these must not become
            // module imports.
            transformAssetUrls: false,
          },
        }),
      ];

      // Kept as dependencies of the server, even when they are linked from a
      // workspace, so that they resolve their own dependencies. Bundled into
      // the server, their dependencies would resolve to whatever versions the
      // app itself hoists.
      nitroConfig.externals ??= {};
      nitroConfig.externals.external = [
        ...toArray(nitroConfig.externals.external),
        'vuemail',
        '@vuemail/render',
      ];
    });
  },
});

declare module '@nuxt/schema' {
  interface NuxtConfig {
    vuemail?: ModuleOptions;
  }
  interface NuxtOptions {
    vuemail?: ModuleOptions;
  }
}
