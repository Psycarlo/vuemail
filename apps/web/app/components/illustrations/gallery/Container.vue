<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next';
</script>

<template>
  <div
    class="relative flex w-[40%] items-center rounded-full bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-3 shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] md:group-hover:skew-x-2"
  >
    <ChevronLeftIcon
      class="translate-x-2 transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:translate-x-0"
      :size="14"
      :stroke-width="4"
    />
    <div class="h-1 shrink grow basis-0 rounded-xs bg-slate-8" />
    <ChevronRightIcon
      class="-translate-x-2 transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:translate-x-0"
      :size="14"
      :stroke-width="4"
    />
  </div>
</template>
