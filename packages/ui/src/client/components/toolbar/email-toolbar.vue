<script setup lang="ts">
import type { RenderedEmailMetadata } from '../../../shared/types';
import ToolbarInner from './toolbar-inner.vue';

defineProps<{
  slug: string;
  rendering: RenderedEmailMetadata;
}>();

// The toolbar is keyed by the email, so that going to another email starts
// it over, running the checks for it, as a new page would.
</script>

<template>
  <ToolbarInner :key="slug" :slug="slug" :rendering="rendering" />
</template>
