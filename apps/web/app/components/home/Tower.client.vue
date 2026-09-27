<script setup lang="ts">
// The WebGL tower of the hero. Client only, like upstream's dynamic import
// with `ssr: false`.
import { nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';
import {
  createTowerScene,
  getCanvasTexture,
  type TowerCollageTexture,
} from '~/utils/home/tower';

const IMAGES = [
  { url: '/static/components/0.jpeg' },
  { url: '/static/components/1.jpeg' },
  { url: '/static/components/2.jpeg' },
  { url: '/static/components/3.jpeg' },
  { url: '/static/components/4.jpeg' },
  { url: '/static/components/0.jpeg' },
  { url: '/static/components/1.jpeg' },
  { url: '/static/components/2.jpeg' },
  { url: '/static/components/3.jpeg' },
  { url: '/static/components/4.jpeg' },
];

const isLoading = ref(true);
const hasTexture = ref(false);
const container = useTemplateRef<HTMLDivElement>('container');

let isUnmounted = false;
let disposeScene: (() => void) | undefined;

onMounted(async () => {
  let collage: TowerCollageTexture | undefined;
  try {
    collage = await getCanvasTexture(IMAGES);
  } catch {
    // Without its texture, the tower isn't rendered, like upstream
  }
  if (isUnmounted) {
    collage?.texture.dispose();
    return;
  }

  isLoading.value = false;
  hasTexture.value = collage !== undefined;
  if (!collage) return;

  await nextTick();
  if (isUnmounted || !container.value) {
    collage.texture.dispose();
    return;
  }
  disposeScene = createTowerScene(container.value, collage);
});

onBeforeUnmount(() => {
  isUnmounted = true;
  disposeScene?.();
});
</script>

<template>
  <div v-if="isLoading" class="w-full h-full flex items-center justify-center">
    <div class="text-white/30">Loading...</div>
  </div>
  <div v-else-if="hasTexture" class="w-full h-full">
    <!-- Styled like the container of @react-three/fiber's canvas -->
    <div
      ref="container"
      style="position:relative;width:100%;height:100%;overflow:hidden;pointer-events:auto"
    />
  </div>
</template>
