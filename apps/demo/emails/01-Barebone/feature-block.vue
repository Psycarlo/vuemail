<script setup lang="ts">
// Used by feature-announcement.vue. Upstream it's defined in that same file,
// but in Vue each component needs a file of its own.
import { Button, Img, Section, Text } from 'vuemail';

const { imageUrl, ctaUrl, title, bodyP1 } = defineProps<{
  imageUrl: string;
  ctaUrl: string;
  title: string;
  bodyP1: string;
}>();
</script>

<template>
  <Section class="text-left">
    <Img
      :src="imageUrl"
      alt=""
      :width="592"
      class="block mx-auto mb-6 rounded-[12px] w-full max-w-[592px]"
    />
    <Section class="px-2">
      <Text class="font-24 text-fg">{{ title }}</Text>
      <Text class="mb-8 max-w-[420px] font-16 text-fg-2">{{ bodyP1 }}</Text>
      <Button
        :href="ctaUrl"
        class="inline-block bg-fg px-7 py-4 rounded-lg font-16 font-sans text-fg-inverted text-center leading-6"
      >
        Try it out
      </Button>
    </Section>
  </Section>
</template>
