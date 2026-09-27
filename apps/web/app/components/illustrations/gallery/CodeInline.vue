<script setup lang="ts">
import { ChevronRightIcon } from 'lucide-vue-next';
</script>

<template>
  <div
    class="relative flex w-[40%] items-center gap-2 rounded-full bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-3 shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] md:group-hover:skew-x-2"
  >
    <ChevronRightIcon :size="14" :stroke-width="4" />
    <div
      class="h-1 w-[24%] rounded-xs border border-[#42D392] bg-[#42B883] shadow-[0px_0px_9px_4px_rgba(66,184,131,0.10)] transition-colors ease-in-out"
    />
    <div class="h-1 shrink grow basis-0 rounded-xs bg-slate-5" />
  </div>
</template>
