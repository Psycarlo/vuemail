<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ href: string }>();

// The docs are served by another site through a proxy, so they can't be
// navigated to without a full page load
const EXTERNAL_REWRITE_PATHS = ['/docs'];

const isExternal = computed(
  () =>
    /^https?:\/\//.test(props.href) ||
    EXTERNAL_REWRITE_PATHS.some((path) => props.href.startsWith(path)),
);
</script>

<template>
  <a v-if="isExternal" :href="href"><slot /></a>
  <NuxtLink v-else :to="href"><slot /></NuxtLink>
</template>
