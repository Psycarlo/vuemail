<script setup lang="ts">
import { Motion } from 'motion-v';
import { TabsTrigger } from 'reka-ui';

defineProps<{
  value: string;
  activeView: string;
  layoutId: string;
}>();

const indicatorTransition = {
  type: 'spring',
  bounce: 0,
  duration: 0.3,
} as const;
</script>

<template>
  <TabsTrigger
    :class="[
      'relative scroll-m-2 rounded-md px-3 py-1.5',
      activeView === value ? 'text-slate-12' : 'text-slate-11',
    ]"
    style="-webkit-tap-highlight-color: transparent"
    tabindex="0"
    :value="value"
  >
    <Motion
      v-if="activeView === value"
      as="span"
      class="pointer-events-none absolute inset-0 z-2 rounded-lg bg-slate-6 group-focus:outline-hidden"
      :initial="false"
      :layout-id="layoutId"
      :transition="indicatorTransition"
    />
    <slot />
  </TabsTrigger>
</template>
