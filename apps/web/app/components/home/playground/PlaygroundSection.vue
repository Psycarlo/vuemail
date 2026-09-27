<script setup lang="ts">
import { AnimatePresence, Motion } from 'motion-v';
import { TabsList, TabsRoot, TabsTrigger } from 'reka-ui';
import { ref } from 'vue';
import {
  playgroundCssCode,
  playgroundTailwindCode,
} from '~/utils/home/playground';

const tabs = [
  {
    label: 'Tailwind',
    value: 'tailwind',
    code: playgroundTailwindCode,
  },
  {
    label: 'CSS',
    value: 'css',
    code: playgroundCssCode,
  },
];

const activeTab = ref('tailwind');
</script>

<template>
  <section
    class="relative my-24 text-center flex flex-col items-center justify-center"
  >
    <div class="space-y-8 w-full">
      <div
        class="max-w-full text-center md:max-w-160 md:mx-auto space-y-4"
      >
        <UiHeading
          as="h2"
          size="8"
          weight="medium"
          class="text-white/80 md:w-96 inline-block max-md:max-w-lg max-md:mx-auto"
        >
          Style with any tools
        </UiHeading>
        <div class="px-4 md:px-40">
          <UiText size="5" class="opacity-70">
            Make your emails look beautiful with Tailwind or inline CSS.
          </UiText>
        </div>
      </div>
      <TabsRoot
        v-model="activeTab"
        class="w-full max-w-6xl mx-auto space-y-8 md:space-y-16"
      >
        <div class="flex justify-center px-4">
          <TabsList
            class="flex items-center p-1 rounded-2xl shadow-[0px_32px_64px_-16px_transparent,0px_16px_32px_-8px_transparent,0px_8px_16px_-4px_transparent,0px_4px_8px_-2px_transparent,0px_-8px_16px_-1px_transparent,0px_2px_4px_-1px_transparent,0px_0px_0px_1px_transparent,inset_0px_0px_0px_1px_rgba(255,255,255,0.1),inset_0px_1px_0px_rgb(255,255,255,0.15)]"
          >
            <TabsTrigger
              v-for="tab in tabs"
              :key="tab.value"
              :value="tab.value"
              class="group relative px-3 py-2 md:px-4 rounded-xl outline-hidden cursor-pointer"
            >
              <span
                :class="[
                  'relative z-10 text-base md:text-lg',
                  activeTab === tab.value
                    ? 'text-slate-12'
                    : 'text-slate-11 transition-colors group-hover:text-slate-12',
                ]"
              >
                {{ tab.label }}
              </span>
              <AnimatePresence mode="wait" :initial="false">
                <Motion
                  v-if="activeTab === tab.value"
                  class="absolute inset-0 size-full rounded-xl bg-linear-to-b from-zinc-800 to-zinc-950 border border-zinc-800 group-focus-visible:ring-slate-8 group-focus-visible:ring-2 z-0"
                  layout-id="activeTab"
                  :transition="{
                    type: 'spring',
                    duration: 0.2,
                    bounce: 0,
                  }"
                />
              </AnimatePresence>
            </TabsTrigger>
          </TabsList>
        </div>

        <div class="px-4 md:px-0">
          <HomePlaygroundCodePreview :tabs="tabs" :active-tab="activeTab" />
        </div>
      </TabsRoot>
    </div>

    <HomeBackgroundImage
      class="pointer-events-none absolute inset-0 -top-40 z-3 select-none mix-blend-lighten"
      priority
    />
  </section>
</template>
