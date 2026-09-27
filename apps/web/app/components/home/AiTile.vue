<script setup lang="ts">
import { Motion, useMotionTemplate, useMotionValue } from 'motion-v';

const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);
const background = useMotionTemplate`radial-gradient(60px circle at ${mouseX}px ${mouseY}px, rgb(187,255,215,0.6), transparent 80%)`;

const handleMouseMove = (event: MouseEvent) => {
  const { left, top } = (
    event.currentTarget as HTMLElement
  ).getBoundingClientRect();

  mouseX.set(event.clientX - left);
  mouseY.set(event.clientY - top);
};
</script>

<template>
  <div
    class="relative rounded-[19px] p-px transition duration-200 ease-in-out group-hover:-translate-y-1"
    @mousemove="handleMouseMove"
  >
    <Motion
      class="pointer-events-none absolute inset-0 rounded-[19px] opacity-0 transition duration-300 group-hover:opacity-60"
      :style="{ background }"
    />
    <div
      class="relative flex items-center w-20 h-20 shrink-0 grow justify-center bg-linear-to-b from-zinc-800 to-zinc-950 rounded-[18px] shadow-[0px_32px_64px_-16px_transparent,0px_16px_32px_-8px_transparent,0px_8px_16px_-4px_transparent,0px_4px_8px_-2px_transparent,0px_-8px_16px_-1px_transparent,0px_2px_4px_-1px_transparent,0px_0px_0px_1px_transparent,inset_0px_0px_0px_1px_rgba(255,255,255,0.1),inset_0px_1px_0px_rgb(255,255,255,0.15)] transition duration-200 ease-in-out group-hover:shadow-[0px_32px_64px_-16px_transparent,0px_16px_32px_-8px_rgba(0,0,0,0.6),0px_8px_16px_-4px_transparent,0px_4px_8px_-2px_transparent,0px_-8px_16px_-1px_transparent,0px_2px_4px_-1px_transparent,0px_0px_0px_1px_transparent,inset_0px_0px_0px_1px_rgba(255,255,255,0.2),inset_0px_1px_0px_rgb(255,255,255,0.25)]"
    >
      <slot />
    </div>
  </div>
</template>
