<script setup lang="ts">
const description = 'Open source templates built with Vuemail';

useSeoMeta({
  title: 'Templates — Vuemail',
  description,
});

useHead({
  link: [
    { rel: 'canonical', href: 'https://vuemail.dev/templates' },
    {
      rel: 'alternate',
      type: 'text/markdown',
      href: 'https://vuemail.dev/templates.md',
    },
  ],
});
</script>

<template>
  <PageWrapper>
    <div
      class="pointer-events-none absolute inset-0 flex justify-center mask-[linear-gradient(to_bottom,transparent_0%,black_4%,black_96%,transparent_100%)]"
    >
      <div
        class="hidden h-full w-full max-w-7xl grid-cols-2 gap-4 px-4 lg:grid"
      >
        <div class="border-r-slate-3 border-l border-l-slate-4" />
        <div class="border-r border-r-slate-4" />
      </div>
    </div>
    <PageTransition class="pb-10" tag="main">
      <div class="flex w-full flex-col gap-2 px-6 pt-16 pb-10 md:px-8">
        <UiHeading class="text-slate-12" size="6" weight="medium">
          Templates
        </UiHeading>
        <p>
          {{ description }}. Recreate an existing email or submit a
          <a
            class="rounded-xs outline-hidden transition-transform duration-200 ease-in-out hover:-translate-y-1 focus:ring-2 focus:ring-white/20 focus:ring-offset-4 focus:ring-offset-black text-slate-12"
            href="https://github.com/psycarlo/vuemail/tree/main/apps/demo/emails"
            target="_blank"
            >pull request</a
          >
          to add your template here.
        </p>
      </div>
      <TemplatesList />
    </PageTransition>
  </PageWrapper>
</template>
