<script setup lang="ts">
const { data: starCount } = await useFetch<string>('/api/github-stars', {
  default: () => '',
});
</script>

<template>
  <header
    class="relative z-50 flex items-center justify-between py-8 px-6 md:px-8"
  >
    <NuxtLink
      class="-ml-1.5 flex scroll-m-2 rounded-md pr-[.375rem] transition-colors focus:outline-hidden focus-visible:ring-3 focus-visible:ring-slate-4"
      to="/"
    >
      <AppLogo />
      <span class="sr-only">Home</span>
    </NuxtLink>
    <AppMenu :star-count="starCount" />
  </header>
</template>
