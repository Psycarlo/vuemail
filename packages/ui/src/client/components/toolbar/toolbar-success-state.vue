<script setup lang="ts">
import IconCheck from '../../icons/icon-check.vue';

defineProps<{
  title: string;
  /** Shows a check mark above the title. */
  icon?: boolean;
  /** Lets the description take up to `max-w-lg` instead of 320px. */
  wide?: boolean;
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center pt-8">
    <div v-if="icon" class="relative mb-8 flex items-center justify-center">
      <div
        class="h-16 w-16 rounded-full bg-linear-to-br from-green-300/20 opacity-80 to-emerald-500/30 blur-md absolute m-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />
      <div
        class="h-12 w-12 rounded-full bg-linear-to-br from-green-400/80 opacity-10 to-emerald-600/80 absolute m-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg"
      />
      <div
        class="h-10 w-10 rounded-full bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
      >
        <IconCheck :size="24" class="text-white drop-shadow-xs" />
      </div>
    </div>
    <h3 class="text-slate-12 font-medium text-base mb-1">{{ title }}</h3>
    <p
      :class="[
        'text-slate-11 text-sm text-center',
        wide ? 'max-w-lg' : 'max-w-[320px]',
      ]"
    >
      <slot />
    </p>
  </div>
</template>
