<script setup lang="ts">
import { MoveDownRightIcon } from 'lucide-vue-next';
</script>

<template>
  <div
    class="relative grid aspect-square w-[24%] grid-cols-2 grid-rows-2 items-center gap-2 rounded-md bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-2 shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] md:group-hover:skew-x-2"
  >
    <div class="col-span-1 h-full rounded-xs bg-slate-3" />
    <div
      class="col-span-1 h-full rounded-xs bg-linear-to-l bg-slate-3 from-slate-1 to-slate-3"
    />
    <div
      class="col-span-1 h-full rounded-xs bg-linear-to-b bg-slate-3 from-slate-3 to-slate-1"
    />
    <div
      class="relative col-span-1 h-full rounded-xs border-[#42D392] border-[.1875rem] bg-slate-4 text-[#42B883] shadow-[0px_0px_9px_4px_rgba(66,184,131,0.10)] transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:scale-125"
    >
      <MoveDownRightIcon
        class="absolute top-[calc(100%-.125rem)] left-[calc(100%-.125rem)]"
        :size="14"
        :stroke-width="4"
      />
    </div>
  </div>
</template>
