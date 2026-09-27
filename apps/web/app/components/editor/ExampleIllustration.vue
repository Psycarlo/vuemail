<script setup lang="ts">
import type { Component } from 'vue';
import Placeholder from '~/components/illustrations/editor/Placeholder.vue';

const { slug, tone } = defineProps<{
  slug: string;
  tone: EditorIllustrationTone;
}>();

const illustrations = import.meta.glob<Component>(
  '../illustrations/editor/*.vue',
  { eager: true, import: 'default' },
);

const illustration = computed(() => {
  const name = slug.replace(/(?:^|-)(\w)/g, (_, char: string) =>
    char.toUpperCase(),
  );
  return (
    Object.entries(illustrations).find(([path]) =>
      path.endsWith(`/${name}.vue`),
    )?.[1] ?? Placeholder
  );
});
</script>

<template>
  <Placeholder v-if="illustration === Placeholder" :tone="tone" />
  <component :is="illustration" v-else />
</template>
