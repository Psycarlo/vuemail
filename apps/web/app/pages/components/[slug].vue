<script setup lang="ts">
import 'vue-sonner/style.css';
import { Toaster } from 'vue-sonner';
import { componentsStructure } from '~~/components/structure';

const route = useRoute();
const slug = String(route.params.slug);
const category = componentsStructure.find(
  (candidate) => slugify(candidate.name) === slug,
);

if (!category) {
  throw createError({
    status: 404,
    statusText: 'Component category not found',
    // For the error page to show on navigations, where the server always
    // shows it, and logs the fatal errors
    fatal: import.meta.client,
  });
}

const { data, error } = await useFetch(`/api/components/${slug}`, {
  key: `components-${slug}`,
});

// The page tells what went wrong, and with the status of an error it doesn't
// get prerendered like that
if (error.value && import.meta.server) {
  console.error(
    `Could not load the components of the ${category.name} category`,
    error.value,
  );
  setResponseStatus(500);
}

const title = `${category.name} Components`;

useSeoMeta({
  title,
  description: category.description,
  ogTitle: `${title} • Vuemail`,
  ogDescription: category.description,
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: `${category.name} — Vuemail Components`,
  description: category.description,
  programmingLanguage: ['TypeScript', 'Vue'],
  runtimePlatform: 'Node.js',
  codeRepository: 'https://github.com/vuemail/vuemail',
  url: `https://vuemail.dev/components/${slug}`,
  hasPart: category.components.map((component) => ({
    '@type': 'SoftwareSourceCode',
    name: component.title,
  })),
};

useHead({
  link: [
    { rel: 'canonical', href: `https://vuemail.dev/components/${slug}` },
    {
      rel: 'alternate',
      type: 'text/markdown',
      href: `https://vuemail.dev/components/${slug}.md`,
    },
  ],
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd) }],
});
</script>

<template>
  <PageWrapper>
    <div class="pointer-events-none absolute inset-0 flex justify-center">
      <div
        class="hidden h-full w-full max-w-7xl grid-cols-2 gap-4 px-4 lg:grid"
      >
        <div class="border-r-slate-3 border-l border-l-slate-4" />
        <div class="border-r border-r-slate-4" />
      </div>
    </div>
    <PageTransition class="pb-10" tag="main">
      <div class="flex w-full flex-col gap-4 px-6 pt-16 pb-10 md:px-8">
        <div class="flex flex-inline">
          <NuxtLink
            class="-ml-2 flex scroll-m-2 items-center justify-center gap-2 self-start rounded-md px-2 py-1 text-slate-11 transition-colors duration-200 ease-in-out hover:text-slate-12 focus:bg-slate-6 focus:outline-hidden focus:ring-3 focus:ring-slate-3"
            to="/components"
          >
            <IconArrowLeft class="mt-[.0625rem]" :size="14" />
            <span>Back</span>
          </NuxtLink>
        </div>
        <UiHeading class="text-slate-12" size="6" weight="medium">
          {{ category!.name }}
        </UiHeading>
      </div>
      <div
        class="relative flex w-full flex-col gap-4 border-slate-4 border-y pt-3"
      >
        <GalleryComponentsView v-if="data" :components="data.components" />
        <div
          v-else
          class="flex flex-col items-center gap-1 px-6 pt-13 pb-16 text-center md:px-8"
        >
          <p class="text-slate-12">These components could not be loaded.</p>
          <p>Please try again in a few moments.</p>
        </div>
      </div>
    </PageTransition>

    <ClientOnly>
      <Toaster />
    </ClientOnly>
  </PageWrapper>
</template>
