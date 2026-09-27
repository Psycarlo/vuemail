<script setup lang="ts">
const description =
  'A collection of high-quality, unstyled components for creating beautiful emails using Vue and TypeScript.';

useSeoMeta({
  // Only "Vuemail", without the " • Vuemail" suffix of the other pages
  title: 'Vuemail',
  titleTemplate: '%s',
  description,
  ogTitle: 'Vuemail',
  ogDescription: description,
  ogUrl: 'https://vuemail.dev',
  twitterTitle: 'Vuemail',
  twitterDescription: description,
});

useHead({
  link: [{ rel: 'canonical', href: 'https://vuemail.dev' }],
});
</script>

<template>
  <main class="overflow-x-clip">
    <HomeHeroSection />
    <div
      class="relative mx-auto flex flex-col justify-between px-2 md:max-w-7xl md:px-4"
    >
      <HomePlaygroundSection />
      <HomeAiSection />
      <HomeTestimonialSection />
      <HomePatternsSection />
      <HomePrimitivesSection />
      <HomeToolsSection />
      <HomeEditorSection />
      <HomeIntegrationSection />
      <AppFooter />
    </div>
  </main>
</template>
