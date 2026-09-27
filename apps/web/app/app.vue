<script setup lang="ts">
useHead({
  bodyAttrs: {
    class:
      'h-screen-ios overflow-x-hidden bg-black font-sans text-slate-11 text-sm selection:bg-green-5 selection:text-green-12 antialiased',
  },
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Vuemail',
          url: 'https://vuemail.dev',
          logo: 'https://vuemail.dev/static/covers/vuemail.png',
          sameAs: [
            'https://github.com/vuemail/vuemail',
            'https://www.npmjs.com/package/vuemail',
          ],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Vuemail',
          url: 'https://vuemail.dev',
          description:
            'A collection of high-quality, unstyled components for creating beautiful emails using Vue and TypeScript.',
        },
      ]),
    },
  ],
});
</script>

<template>
  <div
    class="relative mx-auto flex flex-col justify-between px-2 md:max-w-7xl md:px-4"
  >
    <AppTopbar />
  </div>
  <NuxtPage />
</template>
