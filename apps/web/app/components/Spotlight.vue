<script setup lang="ts">
import { Motion, useMotionTemplate, useMotionValue } from 'motion-v';

// React Email's hue is 185, its cyan, where Vuemail's green is 153
const { hue = 153 } = defineProps<{ hue?: number }>();

const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);

const handleMouseMove = ({ currentTarget, clientX, clientY }: MouseEvent) => {
  const { left, top } = (currentTarget as HTMLElement).getBoundingClientRect();

  mouseX.set(clientX - left);
  mouseY.set(clientY - top);
};

const background = useMotionTemplate`
    radial-gradient(
      12rem circle at ${mouseX}px ${mouseY}px,
      hsla(${hue}, 67%, 44%, 0.3),
      transparent 80%
    )
  `;
</script>

<template>
  <div class="overflow-hidden" @mousemove="handleMouseMove">
    <slot />
    <Motion
      class="-inset-px pointer-events-none absolute opacity-0 mix-blend-color-dodge transition duration-300 group-hover:opacity-100 max-md:hidden"
      :style="{ background }"
    />
  </div>
</template>
