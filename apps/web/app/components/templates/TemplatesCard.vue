<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  name: string;
  author?: string;
  href: string;
  github?: string;
  figma?: string;
  image?: string;
  index?: number;
}>();

if (!props.name?.trim()) {
  throw new Error('Template name cannot be empty.');
}

const DEFAULT_IMAGE = '/static/covers/vuemail.png';

const imageSrc = computed(() => props.image ?? DEFAULT_IMAGE);
</script>

<template>
  <div
    :class="[
      'group/card relative mt-7',
      index !== undefined && {
        'lg:ml-6': index % 3 === 0,
        'lg:mx-3': index % 3 === 1,
        'lg:mr-6': index % 3 === 2,
      },
    ]"
  >
    <div
      class="flex w-full flex-col rounded-md border border-slate-4 p-4 transition-colors duration-300 ease-[cubic-bezier(.36,.66,.6,1)] group-hover/card:border-slate-6"
    >
      <img
        :alt="name"
        class="rounded-xs"
        height="300"
        :src="imageSrc"
        width="450"
      />
      <div class="mt-4">
        <div class="flex items-center justify-between">
          <UiHeading as="h2" size="2" weight="medium">{{ name }}</UiHeading>
          <div
            v-if="github || figma"
            class="relative z-10 flex items-center gap-3"
          >
            <a
              v-if="github"
              class="text-slate-11 transition-colors hover:text-white"
              :href="github"
              rel="noopener noreferrer"
              target="_blank"
              title="View on GitHub"
            >
              <IconGitHub :size="14" />
            </a>
            <a
              v-if="figma"
              class="text-slate-11 transition-colors hover:text-white"
              :href="figma"
              rel="noopener noreferrer"
              target="_blank"
              title="View on Figma"
            >
              <IconFigma :size="16" />
            </a>
          </div>
        </div>
        <div v-if="author" class="mt-2 flex flex-row gap-2">
          <img
            :alt="author"
            class="rounded-full text-ellipsis overflow-hidden"
            height="24"
            :src="`/examples/authors/${author}.png`"
            width="24"
          />
          <UiText>{{ author }}</UiText>
        </div>
      </div>
      <a
        :aria-label="name"
        class="absolute inset-0 rounded-md focus:outline-hidden focus:ring-2 focus:ring-white/20"
        :href="href"
        target="_blank"
      />
    </div>
  </div>
</template>
