<script setup lang="ts">
import { CircleDollarSign } from 'lucide-vue-next';
</script>

<template>
  <div
    class="group-hover:-skew-x-3 relative flex aspect-square w-[40%] flex-col items-center gap-2 rounded-md bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-3 shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)]"
  >
    <div class="mt-1 h-1 w-[24%] rounded-xs bg-slate-5" />
    <div class="h-1 w-[66%] rounded-xs bg-slate-5" />
    <div class="-mt-1 h-3 w-[66%] rounded-xs bg-slate-5" />
    <div class="flex aspect-video w-full items-center gap-2">
      <div
        class="flex aspect-square w-[42%] items-center justify-center rounded-xs bg-slate-4"
      >
        <CircleDollarSign
          class="opacity-10 transition-opacity group-hover:opacity-20"
        />
      </div>
      <div class="flex shrink grow basis-0 flex-col gap-1">
        <div class="h-2 w-[84%] rounded-xs bg-slate-5" />
        <div class="h-2 w-[66%] rounded-xs bg-slate-5" />
        <div
          class="h-2 w-[30%] rounded-xs border border-[#42D392] bg-[#42B883] shadow-[0px_0px_9px_4px_rgba(66,184,131,0.10)]"
        />
      </div>
    </div>
  </div>
</template>
