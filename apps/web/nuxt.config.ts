import tailwindcss from '@tailwindcss/vite';
import { componentsStructure } from './components/structure';
import { slugify } from './shared/utils/slugify';

const description =
  'A collection of high-quality, unstyled components for creating beautiful emails using Vue and TypeScript.';
const cover = 'https://vuemail.dev/static/covers/vuemail.png';
// The Mintlify site of the docs, whose subdomain is in the Mintlify dashboard
const docsOrigin = 'https://vuemail.mintlify.site';

export default defineNuxtConfig({
  modules: ['@vuemaildev/nuxt'],
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
      // What every page gets, like the metadata of React Email's root layout
      // (a page with its own Open Graph tags replaces all of them, see the
      // components pages)
      meta: [
        { name: 'description', content: description },
        { name: 'author', content: 'Vuemail contributors' },
        { name: 'theme-color', content: '#42B883' },
        { property: 'og:title', content: 'Vuemail' },
        { property: 'og:description', content: description },
        { property: 'og:url', content: 'https://vuemail.dev' },
        { property: 'og:site_name', content: 'Vuemail' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:image', content: cover },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Vuemail' },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: cover },
      ],
      link: [
        { rel: 'icon', href: '/meta/favicon.ico', sizes: 'any' },
        { rel: 'icon', href: '/meta/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/meta/apple-touch-icon.png' },
        // @ts-expect-error unhead doesn't know the llms.txt link relations
        { rel: 'llms-txt', href: '/llms.txt' },
        // @ts-expect-error
        { rel: 'llms-full-txt', href: '/llms-full.txt' },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Vuemail',
              url: 'https://vuemail.dev',
              logo: cover,
              sameAs: [
                'https://github.com/psycarlo/vuemail',
                'https://www.npmjs.com/package/@vuemaildev/vuemail',
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Vuemail',
              url: 'https://vuemail.dev',
              description,
            },
          ]),
        },
      ],
    },
  },
  runtimeConfig: {
    resendApiKey: '',
    spamAssassinHost: '',
    spamAssassinPort: '783',
  },
  routeRules: {
    '/examples': { redirect: { to: '/templates', statusCode: 308 } },
    '/editor/examples': { redirect: { to: '/editor', statusCode: 308 } },
    '/editor/examples/**': { redirect: { to: '/editor/**', statusCode: 308 } },
    // The docs are a Mintlify site, served under the same domain: Mintlify
    // builds them for the `/docs` base path and loads its assets and APIs
    // from the other two paths
    '/docs': { proxy: `${docsOrigin}/docs` },
    '/docs/**': { proxy: `${docsOrigin}/docs/**` },
    '/_mintlify/**': { proxy: `${docsOrigin}/_mintlify/**` },
    '/mintlify-assets/**': { proxy: `${docsOrigin}/mintlify-assets/**` },
    '/api/**': {
      cors: true,
      headers: {
        'Access-Control-Allow-Credentials': 'true',
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
