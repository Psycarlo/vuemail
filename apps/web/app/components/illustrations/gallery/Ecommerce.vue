<script setup lang="ts">
import { CircleDollarSign } from 'lucide-vue-next';
</script>

<template>
  <div
    class="relative flex aspect-video w-[42%] items-center gap-2 rounded-md bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 px-3 py-2 shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] md:group-hover:skew-x-2"
  >
    <div
      class="flex aspect-square w-[42%] items-center justify-center rounded-xs bg-slate-4"
    >
      <CircleDollarSign
        class="opacity-10 transition-opacity md:group-hover:opacity-20"
      />
    </div>
    <div class="flex shrink grow basis-0 flex-col gap-1">
      <div class="h-2 w-[84%] rounded-xs bg-slate-5" />
      <div class="h-2 w-[66%] rounded-xs bg-slate-5" />
      <div
        class="mt-0.5 h-2 w-[40%] rounded-xs border border-[#42D392] bg-[#42B883] shadow-[0px_0px_9px_4px_rgba(66,184,131,0.10)]"
      />
    </div>
  </div>
</template>
