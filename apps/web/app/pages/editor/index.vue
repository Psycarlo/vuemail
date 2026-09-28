<script setup lang="ts">
import { Bolt, Cpu, Layers2, Rocket } from 'lucide-vue-next';
import type { Component } from 'vue';

useSeoMeta({
  title: 'Editor examples',
  description:
    'Interactive examples showing how to build email editors with vuemail-editor.',
});

useHead({
  link: [{ rel: 'canonical', href: 'https://vuemail.dev/editor' }],
});

const sectionIcons: Record<string, Component> = {
  'Standalone editor': Bolt,
  'Getting started': Rocket,
  Intermediate: Layers2,
  Advanced: Cpu,
};

const sectionBadgeClasses: Record<string, string> = {
  'Standalone editor': 'bg-green-3 text-green-11',
  'Getting started': 'bg-green-3 text-green-11',
  Intermediate: 'bg-amber-3 text-amber-11',
  Advanced: 'bg-purple-3 text-purple-11',
};

// The hues of the spotlight, React Email's cyan is Vuemail's green
const hueByTone: Record<EditorIllustrationTone, number> = {
  amber: 46,
  green: 151,
  purple: 272,
  slate: 153,
};

const textClassByTone: Record<EditorIllustrationTone, string> = {
  amber: 'text-amber-11',
  green: 'text-green-11',
  purple: 'text-purple-11',
  slate: 'text-slate-11',
};

const dotsClassByTone: Record<EditorIllustrationTone, string> = {
  amber:
    'bg-[radial-gradient(hsl(45_4%_16%)_.0313rem,transparent_.0313rem),radial-gradient(hsl(45_4%_16%)_.0313rem,transparent_.0313rem)]',
  green:
    'bg-[radial-gradient(hsl(145_4%_16%)_.0313rem,transparent_.0313rem),radial-gradient(hsl(145_4%_16%)_.0313rem,transparent_.0313rem)]',
  purple:
    'bg-[radial-gradient(hsl(275_4%_16%)_.0313rem,transparent_.0313rem),radial-gradient(hsl(275_4%_16%)_.0313rem,transparent_.0313rem)]',
  slate:
    'bg-[radial-gradient(hsl(240_4%_16%)_.0313rem,transparent_.0313rem),radial-gradient(hsl(240_4%_16%)_.0313rem,transparent_.0313rem)]',
};

const examples = editorExamples.map((example) => ({
  ...example,
  tone: editorSectionTone(example.section),
}));
</script>

<template>
  <PageWrapper>
    <PageTransition class="pb-10" tag="main">
      <div class="flex w-full flex-col gap-2 px-6 pt-16 pb-10 md:px-8">
        <UiHeading size="6" weight="medium" class="text-slate-12">
          Editor Examples
        </UiHeading>
        <p>
          Interactive examples showing how to build email editors with
          vuemail-editor.
        </p>
      </div>
      <ul
        class="grid grid-cols-1 gap-4 px-6 pb-10 md:grid-cols-2 md:px-8 lg:grid-cols-3"
      >
        <li v-for="example in examples" :key="example.slug">
          <NuxtLink
            class="group relative isolate cursor-pointer overflow-hidden rounded-md scroll-m-6 focus:outline-hidden focus:ring-slate-2"
            :to="`/editor/${example.slug}`"
          >
            <Spotlight
              class="relative flex h-full w-full flex-col gap-4 bg-black"
              :hue="hueByTone[example.tone]"
            >
              <div
                class="pointer-events-none absolute inset-0 rounded-md border border-slate-4 transition-colors duration-300 ease-[cubic-bezier(.36,.66,.6,1)] group-hover:border-slate-6 group-focus:border-slate-6"
              />
              <div
                :class="[
                  'relative flex aspect-2/1 items-center justify-center overflow-hidden rounded-xs',
                  textClassByTone[example.tone],
                ]"
              >
                <div
                  :class="[
                    'pointer-events-none absolute inset-0 z-0 bg-transparent opacity-80 bg-position-[0_0,.625rem_.625rem] bg-size-[1.25rem_1.25rem]',
                    dotsClassByTone[example.tone],
                  ]"
                />
                <EditorExampleIllustration
                  :slug="example.slug"
                  :tone="example.tone"
                />
              </div>
              <div class="flex flex-col px-5 pb-5">
                <span
                  :class="[
                    'mb-3.5 -ml-0.5 inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-1.5 pr-2.5 text-xs',
                    sectionBadgeClasses[example.section] ??
                      'bg-slate-3 text-slate-11',
                  ]"
                >
                  <component
                    :is="sectionIcons[example.section]"
                    v-if="sectionIcons[example.section]"
                    aria-hidden="true"
                    class="size-3 shrink-0"
                  />
                  <span class="[text-box:trim-both_cap_alphabetic]">
                    {{ example.section }}
                  </span>
                </span>
                <h3
                  class="mb-[.375rem] font-medium leading-tight text-slate-12"
                >
                  {{ example.title }}
                </h3>
                <p
                  class="text-pretty text-[.8125rem] leading-relaxed text-slate-11"
                >
                  {{ example.description }}
                </p>
              </div>
            </Spotlight>
          </NuxtLink>
        </li>
      </ul>
    </PageTransition>
  </PageWrapper>
</template>
