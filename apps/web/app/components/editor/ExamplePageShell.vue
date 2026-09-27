<script setup lang="ts">
const { sourceCode, githubUrl } = defineProps<{
  slug: string;
  heading: string;
  subtitle?: string;
  docsUrl?: string;
  sourceCode?: string;
  githubUrl?: string;
}>();

const hasTabs = computed(() => Boolean(sourceCode && githubUrl));
</script>

<template>
  <PageWrapper>
    <div class="pointer-events-none absolute inset-0 flex justify-center">
      <div class="hidden h-full w-full max-w-7xl grid-cols-2 gap-4 px-4 lg:grid">
        <div class="border-r-slate-3 border-l border-l-slate-4" />
        <div class="border-r border-r-slate-4" />
      </div>
    </div>
    <PageTransition :key="slug" class="pb-10" tag="main">
      <div class="flex w-full flex-col gap-4 px-6 pt-16 pb-10 md:px-8">
        <div class="flex items-center gap-4">
          <NuxtLink
            class="-ml-2 flex scroll-m-2 items-center justify-center gap-2 self-start rounded-md px-2 py-1 text-slate-11 transition-colors duration-200 ease-in-out hover:text-slate-12 focus:bg-slate-6 focus:outline-hidden focus:ring-3 focus:ring-slate-3"
            to="/editor"
          >
            <IconArrowLeft class="mt-[.0625rem]" :size="14" />
            <span>Back</span>
          </NuxtLink>
          <SmartLink
            v-if="docsUrl"
            class="ml-auto text-sm text-slate-11 transition-colors hover:text-slate-12"
            :href="docsUrl"
            target="_blank"
          >
            Docs
          </SmartLink>
        </div>
        <UiHeading size="6" weight="medium" class="text-slate-12">
          {{ heading }}
        </UiHeading>
      </div>
      <div
        v-if="hasTabs"
        class="relative flex w-full flex-col gap-4 border-slate-4 border-y pt-3"
      >
        <EditorExampleTabbedContent
          :title="subtitle"
          :source-code="sourceCode!"
          :github-url="githubUrl!"
        >
          <slot />
        </EditorExampleTabbedContent>
      </div>
      <div v-else class="px-6 pb-10 md:px-8">
        <slot />
      </div>
    </PageTransition>
  </PageWrapper>
</template>
