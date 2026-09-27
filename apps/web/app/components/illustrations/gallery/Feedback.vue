<script setup lang="ts">
import { MousePointer2Icon } from 'lucide-vue-next';
</script>

<template>
  <div
    class="relative flex w-[40%] translate-y-3 flex-col gap-4 rounded-md bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-4 shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] md:group-hover:skew-x-2"
  >
    <div class="flex flex-col gap-1">
      <div class="h-2 w-[90%] rounded-xs bg-slate-5" />
      <div class="h-2 w-[66%] rounded-xs bg-slate-5" />
    </div>
    <div class="flex items-center gap-2">
      <div class="h-2 shrink-0 grow basis-0 rounded-xs bg-[#42B883]" />
      <div class="h-2 shrink-0 grow basis-0 rounded-xs bg-[#42B883]" />
      <div class="h-2 shrink-0 grow basis-0 rounded-xs bg-[#42B883]" />
      <div class="h-2 shrink-0 grow basis-0 rounded-xs bg-[#42B883]" />
    </div>
    <MousePointer2Icon
      class="-bottom-4 group-hover:-translate-y-3 absolute right-[40%] rotate-60 transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:translate-x-3"
      fill="currentColor"
      stroke="currentColor"
    />
  </div>
</template>
