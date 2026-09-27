<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{ error: NuxtError }>();

const status = computed(
  () => props.error.status ?? props.error.statusCode ?? 500,
);
const isNotFound = computed(() => status.value === 404);

// Rendered instead of `app.vue`, so without its body classes and top bar
useHead({
  title: () => (isNotFound.value ? '404 Not found' : `${status.value} Error`),
  link: [{ rel: 'canonical', href: 'https://vuemail.dev/not-found' }],
  meta: [{ name: 'robots', content: 'noindex' }],
  bodyAttrs: {
    class:
      'h-screen-ios overflow-x-hidden bg-black font-sans text-slate-11 text-sm selection:bg-green-5 selection:text-green-12 antialiased',
  },
});
</script>

<template>
  <div
    class="relative mx-auto flex flex-col justify-between px-2 md:max-w-7xl md:px-4"
  >
    <AppTopbar />
  </div>
  <PageWrapper>
    <div class="pointer-events-none absolute inset-0 flex justify-center">
      <div
        class="hidden h-full w-full max-w-7xl grid-cols-2 gap-4 px-4 lg:grid"
      >
        <div class="border-r-slate-3 border-l border-l-slate-4" />
        <div class="border-r border-r-slate-4" />
      </div>
    </div>
    <PageTransition
      class="flex w-full flex-col items-center justify-center gap-2 px-8 pt-16 pb-10 text-center"
      tag="main"
    >
      <h1 class="font-bold text-2xl text-slate-12 uppercase italic">
        <span class="font-mono">{{ status }}</span> <br />
        {{ isNotFound ? 'Not Found' : 'Error' }}
      </h1>
      <div v-if="isNotFound" class="mt-1 leading-loose">
        <p>This page does not exist.</p>
        <p>Please check the URL and try again.</p>
      </div>
      <div v-else class="mt-1 leading-loose">
        <p>Something went wrong.</p>
        <p>Please try again in a few moments.</p>
      </div>
    </PageTransition>
  </PageWrapper>
</template>
