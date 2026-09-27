<script setup lang="ts">
import type { GalleryComponent } from './ComponentView.vue';

defineProps<{ components: GalleryComponent[] }>();
</script>

<template>
  <GalleryComponentView
    v-for="(component, index) in components"
    :key="component.slug"
    :component="component"
    :header-class="index !== 0 ? 'border-slate-4 border-t pt-4' : ''"
  />
</template>
