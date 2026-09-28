<script setup lang="ts">
import type { Component } from 'vue';
import IllustrationArticles from '~/components/illustrations/gallery/Articles.vue';
import IllustrationAvatars from '~/components/illustrations/gallery/Avatars.vue';
import IllustrationButtons from '~/components/illustrations/gallery/Buttons.vue';
import IllustrationCodeBlock from '~/components/illustrations/gallery/CodeBlock.vue';
import IllustrationCodeInline from '~/components/illustrations/gallery/CodeInline.vue';
import IllustrationContainer from '~/components/illustrations/gallery/Container.vue';
import IllustrationDivider from '~/components/illustrations/gallery/Divider.vue';
import IllustrationEcommerce from '~/components/illustrations/gallery/Ecommerce.vue';
import IllustrationFeatures from '~/components/illustrations/gallery/Features.vue';
import IllustrationFeedback from '~/components/illustrations/gallery/Feedback.vue';
import IllustrationFooters from '~/components/illustrations/gallery/Footers.vue';
import IllustrationGallery from '~/components/illustrations/gallery/Gallery.vue';
import IllustrationGrid from '~/components/illustrations/gallery/Grid.vue';
import IllustrationHeaders from '~/components/illustrations/gallery/Headers.vue';
import IllustrationHeading from '~/components/illustrations/gallery/Heading.vue';
import IllustrationImage from '~/components/illustrations/gallery/Image.vue';
import IllustrationLink from '~/components/illustrations/gallery/Link.vue';
import IllustrationList from '~/components/illustrations/gallery/List.vue';
import IllustrationMarkdown from '~/components/illustrations/gallery/Markdown.vue';
import IllustrationMarketing from '~/components/illustrations/gallery/Marketing.vue';
import IllustrationPricing from '~/components/illustrations/gallery/Pricing.vue';
import IllustrationSection from '~/components/illustrations/gallery/Section.vue';
import IllustrationStats from '~/components/illustrations/gallery/Stats.vue';
import IllustrationTestimonials from '~/components/illustrations/gallery/Testimonials.vue';
import IllustrationText from '~/components/illustrations/gallery/Text.vue';
import { componentsStructure } from '~~/components/structure';

// The illustration of each category, by its name
const illustrations: Record<string, Component> = {
  Headers: IllustrationHeaders,
  Footers: IllustrationFooters,
  Container: IllustrationContainer,
  Section: IllustrationSection,
  Grid: IllustrationGrid,
  Divider: IllustrationDivider,
  Heading: IllustrationHeading,
  Text: IllustrationText,
  Link: IllustrationLink,
  Buttons: IllustrationButtons,
  Image: IllustrationImage,
  Avatars: IllustrationAvatars,
  Gallery: IllustrationGallery,
  List: IllustrationList,
  'Code Inline': IllustrationCodeInline,
  'Code Block': IllustrationCodeBlock,
  Markdown: IllustrationMarkdown,
  Articles: IllustrationArticles,
  Features: IllustrationFeatures,
  Stats: IllustrationStats,
  Testimonials: IllustrationTestimonials,
  Feedback: IllustrationFeedback,
  Pricing: IllustrationPricing,
  Ecommerce: IllustrationEcommerce,
  Marketing: IllustrationMarketing,
};

const description =
  'Build beautiful emails with pre-built components that you can copy-and-paste into your app.';

// With its own Open Graph tags, which replace all of those of the other
// pages, like React Email's page does (its twitter card keeps the image)
const title = 'Components - Vuemail';
useSeoMeta({
  title,
  description,
  ogTitle: `${title} • Vuemail`,
  ogDescription: description,
  ogImage: 'https://vuemail.dev/static/covers/patterns.png',
  ogUrl: null,
  ogSiteName: null,
  ogLocale: null,
  ogType: null,
  twitterTitle: `${title} • Vuemail`,
  twitterDescription: description,
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Vuemail Components',
  description,
  url: 'https://vuemail.dev/components',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: componentsStructure.map((category, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: category.name,
      url: `https://vuemail.dev/components/${slugify(category.name)}`,
      description: category.description,
    })),
  },
};

useHead({
  link: [
    { rel: 'canonical', href: 'https://vuemail.dev/components' },
    {
      rel: 'alternate',
      type: 'text/markdown',
      href: 'https://vuemail.dev/components.md',
    },
  ],
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd) }],
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
          Components
        </UiHeading>
        <p>
          Build beautiful emails with pre-built components that you can
          copy-and-paste into your app.
        </p>
      </div>
      <div
        class="relative grid grid-cols-1 gap-x-4 px-1 pb-10 md:grid-cols-2 md:px-0 lg:grid-cols-3"
      >
        <div
          class="-translate-x-1/2 absolute top-0 left-1/2 h-px w-dvw border-slate-4 border-t xl:mask-[linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]"
        />
        <div
          class="-translate-x-1/2 absolute bottom-0 left-1/2 h-px w-dvw border-slate-4 border-b xl:mask-[linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]"
        />
        <NuxtLink
          v-for="(category, index) in componentsStructure"
          :key="category.name"
          :class="[
            'group relative isolate mt-7 cursor-pointer scroll-m-6 rounded-md focus:outline-hidden focus:ring-3 focus:ring-slate-2 md:before:absolute md:before:inset-0 md:before:rounded-md md:before:border md:before:border-slate-4 md:before:border-dashed md:before:transition-colors md:before:duration-720 md:before:ease-[cubic-bezier(.24,.9,.32,1.4)] md:focus:before:border-slate-6 md:hover:before:border-slate-6',
            {
              'lg:ml-6': index % 3 === 0,
              'lg:mx-3': index % 3 === 1,
              'lg:mr-6': index % 3 === 2,
            },
          ]"
          tabindex="0"
          :to="`/components/${slugify(category.name)}`"
        >
          <Spotlight
            :class="[
              'group-focus:ring-slate-2 relative isolate z-2 flex cursor-pointer flex-col justify-end rounded-md bg-black p-4 group-focus:ring-3 md:transition-transform md:duration-240 md:ease-[cubic-bezier(.36,.66,.6,1)]',
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
              class="pointer-events-none absolute inset-0 rounded-md border border-slate-4 transition-colors duration-300 ease-[cubic-bezier(.36,.66,.6,1)] group-hover:border-slate-6 group-focus:border-slate-6"
            />
            <div
              class="relative flex aspect-2/1 items-center justify-center overflow-hidden rounded-xs text-slate-300"
            >
              <div
                class="absolute inset-0 bg-[radial-gradient(#27272A_.0313rem,transparent_.0313rem),radial-gradient(#27272A_.0313rem,transparent_.0313rem)] bg-transparent opacity-80 bg-position-[0_0,.625rem_.625rem] bg-size-[1.25rem_1.25rem]"
              />
              <component :is="illustrations[category.name]" />
            </div>
            <h2
              class="relative z-3 mt-4 font-medium text-slate-12 capitalize leading-7 -tracking-wide"
            >
              {{ category.name }}
            </h2>
            <span class="relative z-3 text-slate-11 text-xs">
              {{ category.components.length }}
              component{{ category.components.length > 1 ? 's' : '' }}
            </span>
          </Spotlight>
        </NuxtLink>
      </div>
    </PageTransition>
  </PageWrapper>
</template>
