<script setup lang="ts">
// The description and the Open Graph tags are the ones of every page
useSeoMeta({
  // Only "Vuemail", without the " • Vuemail" suffix of the other pages
  title: 'Vuemail',
  titleTemplate: '%s',
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
