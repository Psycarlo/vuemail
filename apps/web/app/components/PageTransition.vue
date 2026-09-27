<script setup lang="ts">
import { AnimatePresence, Motion } from 'motion-v';
import type { IntrinsicElementAttributes } from 'vue';

// The classes go to the animated element, not to `AnimatePresence`
defineOptions({ inheritAttrs: false });

withDefaults(defineProps<{ tag?: keyof IntrinsicElementAttributes }>(), {
  tag: 'div',
});

const transition = { duration: 0.3, ease: [0.36, 0.66, 0.6, 1] } as const;
</script>

<template>
  <AnimatePresence mode="wait">
    <Motion
      v-bind="$attrs"
      :animate="{ opacity: 1, y: 0 }"
      :as="tag"
      class="relative z-2 w-full"
      :initial="{ opacity: 0, y: 4 }"
      :transition="transition"
    >
      <slot />
    </Motion>
  </AnimatePresence>
</template>
