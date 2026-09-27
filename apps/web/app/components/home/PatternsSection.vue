<script setup lang="ts">
import type { Component } from 'vue';
import IllustrationContainer from '~/components/illustrations/gallery/Container.vue';
import IllustrationDivider from '~/components/illustrations/gallery/Divider.vue';
import IllustrationFooters from '~/components/illustrations/gallery/Footers.vue';
import IllustrationGrid from '~/components/illustrations/gallery/Grid.vue';
import IllustrationHeaders from '~/components/illustrations/gallery/Headers.vue';
import IllustrationSection from '~/components/illustrations/gallery/Section.vue';
import { componentsStructure } from '~~/components/structure';
import { slugify } from '~~/shared/utils/slugify';

const illustrations: Record<string, Component> = {
  Headers: IllustrationHeaders,
  Footers: IllustrationFooters,
  Container: IllustrationContainer,
  Section: IllustrationSection,
  Grid: IllustrationGrid,
  Divider: IllustrationDivider,
};

const categories = componentsStructure.slice(0, 6).map((category) => ({
  ...category,
  slug: slugify(category.name),
}));

const contentLine =
  'absolute pointer-events-none inset-0 border-y border-slate-4 border-dashed w-[200dvw] -left-[100dvw] mask-[linear-gradient(-45deg,transparent_0%,black_40%,black_90%,transparent_100%)]';
</script>

<template>
  <section class="relative py-20 my-24">
    <div class="flex flex-col gap-6 max-md:px-6">
      <div
        class="relative flex flex-col max-md:text-center max-md:items-center max-md:justify-center"
      >
        <UiHeading as="h2" size="8" weight="medium" class="text-white/80">
          Ready-to-use Components
        </UiHeading>
        <div aria-hidden="true" :class="contentLine" />
      </div>
      <div
        class="relative flex flex-col max-md:text-center max-md:items-center max-md:justify-center"
      >
        <UiText
          size="5"
          class="block max-w-[400px] text-balance opacity-70"
        >
          Copy and paste. Add your own data. Send.
        </UiText>
        <div aria-hidden="true" :class="contentLine" />
      </div>
      <div
        class="relative flex flex-col max-md:text-center max-md:items-center max-md:justify-center"
      >
        <UiButton as-child size="4" class="w-fit my-1.5 rounded-xl">
          <NuxtLink to="/components">View all components</NuxtLink>
        </UiButton>
        <div aria-hidden="true" :class="contentLine" />
      </div>
      <div
        class="relative grid grid-cols-1 gap-y-4 gap-x-4 lg:gap-x-1 pb-5 md:grid-cols-2 lg:grid-cols-3 lg:-ml-5"
      >
        <div
          aria-hidden="true"
          class="-translate-x-1/2 absolute bottom-0 left-1/2 h-px w-dvw border-slate-4 border-dashed border-b mask-[linear-gradient(to_right,transparent_0%,black_90%)] max-lg:hidden"
        />
        <NuxtLink
          v-for="(category, index) in categories"
          :key="category.name"
          :class="[
            'group relative isolate cursor-pointer scroll-m-6 rounded-lg focus:outline-hidden focus-visible:ring-3 focus-visible:ring-slate-2 md:before:absolute md:before:inset-0 md:before:rounded-lg md:before:border md:before:border-slate-4 md:before:border-dashed md:before:transition-colors md:before:duration-720 md:before:ease-[cubic-bezier(.24,.9,.32,1.4)] md:focus-visible:before:border-slate-6 md:hover:before:border-slate-6',
            {
              'lg:ml-6': index % 3 === 0,
              'lg:mx-3': index % 3 === 1,
              'lg:mr-6': index % 3 === 2,
            },
          ]"
          :to="`/components/${category.slug}`"
          tabindex="0"
        >
          <Spotlight
            :class="[
              'relative isolate flex cursor-pointer flex-col justify-end rounded-lg bg-black p-4 group-focus-visible:ring-3 group-focus-visible:ring-slate-2 md:transition-transform md:duration-240 md:ease-[cubic-bezier(.36,.66,.6,1)]',
              {
                'md:group-hover:-translate-x-2 md:group-hover:-translate-y-2 md:group-focus:-translate-x-2 md:group-focus:-translate-y-2':
                  index % 3 === 0,
                'md:group-hover:-translate-y-2 md:group-focus:-translate-y-2':
                  index % 3 === 1,
                'md:group-hover:-translate-y-2 md:group-focus:-translate-y-2 md:group-focus:translate-x-2 md:group-hover:translate-x-2':
                  index % 3 === 2,
              },
            ]"
          >
            <div
              class="pointer-events-none absolute inset-0 rounded-lg border border-slate-4 transition-colors duration-300 ease-[cubic-bezier(.36,.66,.6,1)] md:group-hover:border-slate-6 md:group-focus:border-slate-6"
            />
            <div
              class="relative flex aspect-2/1 items-center justify-center overflow-hidden rounded-xs text-slate-300"
            >
              <div
                class="absolute inset-0 bg-[radial-gradient(#27272A_.0313rem,transparent_.0313rem),radial-gradient(#27272A_.0313rem,transparent_.0313rem)] bg-transparent opacity-80 bg-position-[0_0,.625rem_.625rem] bg-size-[1.25rem_1.25rem]"
              />
              <component :is="illustrations[category.name]" />
            </div>
            <h3
              class="relative z-2 mt-4 font-medium text-slate-12 capitalize leading-7 -tracking-wide"
            >
              {{ category.name }}
            </h3>
            <span class="relative z-2 text-slate-11 text-xs">
              {{ category.components.length }} component{{
                category.components.length > 1 ? 's' : ''
              }}
            </span>
          </Spotlight>
        </NuxtLink>
      </div>
    </div>
    <div
      aria-hidden="true"
      class="absolute pointer-events-none mask-[linear-gradient(45deg,transparent_0%,black_40%,black_90%,transparent_100%)] -left-12 -top-10 w-8 h-1/2 border-x border-dashed border-x-slate-3 bg-size-[10px_10px] bg-fixed max-lg:hidden"
    />
    <div
      aria-hidden="true"
      class="absolute pointer-events-none mask-[linear-gradient(-45deg,transparent_0%,black_40%,black_90%,transparent_100%)] -right-12 -bottom-40 w-8 h-2/3 border-x border-x-slate-3 border-dashed bg-size-[10px_10px] bg-fixed max-lg:hidden"
    />
    <HomeBackgroundImage
      class="pointer-events-none absolute md:-translate-x-96 -top-40 z-3 select-none mix-blend-lighten"
      priority
    />
  </section>
</template>
