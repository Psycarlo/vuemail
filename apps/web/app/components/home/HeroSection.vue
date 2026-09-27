<script setup lang="ts">
import { ArrowRightIcon } from 'lucide-vue-next';
</script>

<template>
  <!-- Right Column - Tower -->
  <div class="w-dvw h-dvh max-lg:hidden z-0 absolute right-0 top-0">
    <div class="w-full h-full">
      <ClientOnly>
        <LazyHomeTower />
      </ClientOnly>
      <div
        class="absolute inset-0 pointer-events-none"
        :style="{
          background:
            'radial-gradient(circle at center right, transparent 0%, rgba(0, 0, 0, 0.6) 40%, rgba(0, 0, 0, 0.95) 60%, #000 80%), linear-gradient(175deg, transparent 60%, black 97%), linear-gradient(to bottom, rgba(0, 0, 0, .8) 5%, transparent 30%)',
        }"
      />
    </div>
  </div>

  <section
    class="flex flex-col h-[calc(100dvh-11.5rem)] lg:max-w-7xl mx-auto max-lg:items-center justify-center relative w-full pt-12 lg:pt-0 pointer-events-none"
  >
    <HomeBackgroundImage
      class="pointer-events-none absolute inset-0 -top-40 z-3 scale-150 select-none mix-blend-lighten lg:opacity-30"
      priority
    />

    <!-- Left Column - Content -->
    <div class="w-full lg:w-176 z-10 px-4 lg:px-12 pointer-events-auto">
      <div class="mb-8 flex justify-center lg:justify-start">
        <img
          alt="Vuemail Logo"
          decoding="async"
          height="100"
          loading="lazy"
          src="/brand/logo.png"
          style="color: transparent"
          width="100"
        />
      </div>
      <UiHeading
        class="text-white/80 relative mb-8 text-center lg:text-left before:absolute before:top-0 before:left-0 before:w-full before:animate-[shine_1.5s_ease-in-out] before:bg-size-[225%] before:bg-shine before:bg-clip-text before:text-transparent before:content-['The_next_generation_of_writing_emails'] before:select-none before:pointer-events-none text-balance"
        weight="medium"
        size="10"
      >
        The next generation of writing emails
      </UiHeading>
      <div class="max-w-xl max-lg:mx-auto text-center lg:text-left">
        <UiText size="5" class="text-pretty">
          Vuemail is a next-generation collection of unstyled components for
          creating beautiful emails using Vue, Tailwind, and TypeScript.
        </UiText>
      </div>
      <div
        class="mt-10 flex items-center justify-center lg:justify-start gap-4 flex-wrap"
      >
        <UiButton as-child size="4">
          <NuxtLink to="/components">
            Explore components
            <ArrowRightIcon :size="16" />
          </NuxtLink>
        </UiButton>
        <SiteCode
          class="lg:inline-flex! hidden max-w-max"
          code="npx create-vuemail@latest"
        />
      </div>
    </div>
  </section>
</template>
