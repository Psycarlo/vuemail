import tailwindcss from '@tailwindcss/vite';
import { componentsStructure } from './components/structure';
import { slugify } from './shared/utils/slugify';

const description =
  'A collection of high-quality, unstyled components for creating beautiful emails using Vue and TypeScript.';

export default defineNuxtConfig({
  modules: ['@vuemail/nuxt'],
  css: ['~/assets/css/globals.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
        // @ts-expect-error unhead doesn't type it, React Email sets it too
        'color-scheme': 'dark',
      },
      // A function can't be serialized from here, a template can: without a
      // title, the separator goes away, leaving `Vuemail`
      titleTemplate: '%s %separator %siteName',
      templateParams: { separator: '•', siteName: 'Vuemail' },
      meta: [
        { name: 'description', content: description },
        { name: 'theme-color', content: '#42D392' },
        { property: 'og:site_name', content: 'Vuemail' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'en_US' },
        {
          property: 'og:image',
          content: 'https://vuemail.dev/static/covers/vuemail.png',
        },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', href: '/meta/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/meta/apple-touch-icon.png' },
        // @ts-expect-error unhead doesn't know the llms.txt link relations
        { rel: 'llms-txt', href: '/llms.txt' },
        // @ts-expect-error
        { rel: 'llms-full-txt', href: '/llms-full.txt' },
      ],
    },
  },
  runtimeConfig: {
    resendApiKey: '',
    spamAssassinHost: '',
    spamAssassinPort: '783',
  },
  routeRules: {
    '/examples': { redirect: { to: '/templates', statusCode: 301 } },
    '/editor/examples': { redirect: { to: '/editor', statusCode: 301 } },
    '/editor/examples/**': { redirect: { to: '/editor/**', statusCode: 301 } },
    // The docs are a Mintlify site, served under the same domain
    '/docs': { proxy: 'https://vuemail.mintlify.dev/docs' },
    '/docs/**': { proxy: 'https://vuemail.mintlify.dev/docs/**' },
    '/api/**': {
      cors: true,
      headers: {
        'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
        'Access-Control-Allow-Headers':
          'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
      },
    },
    // Statically generated, like React Email's
    '/components': { prerender: true },
    '/components/**': { prerender: true },
    '/templates': { prerender: true },
  },
  nitro: {
    prerender: {
      // The page of each category, which `/components/**` can't list
      routes: componentsStructure.map(
        (category) => `/components/${slugify(category.name)}`,
      ),
    },
  },
  compatibilityDate: '2026-09-01',
});
