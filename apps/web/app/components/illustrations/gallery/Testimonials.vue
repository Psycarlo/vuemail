<script setup lang="ts">
import { SmileIcon } from 'lucide-vue-next';
</script>

<template>
  <div
    class="relative flex min-w-36 items-stretch justify-start gap-3 rounded-md border border-slate-3 bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 px-4 py-3 pl-5 shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] md:group-hover:skew-x-2"
  >
    <div
      class="absolute top-0 left-0.5 h-full w-1 border-r-2 border-dashed border-slate-6"
    />
    <div
      class="flex min-w-[36%] items-center justify-center rounded-md bg-[#42B883] text-black/60 shadow-[0_0_.5625rem_.25rem_rgba(66,184,131,0.10)]"
    >
      <SmileIcon />
    </div>
    <div class="flex flex-1 flex-col gap-1">
      <div class="h-1.5 w-full rounded-xs bg-slate-7" />
      <div class="h-1.5 w-[90%] rounded-xs bg-slate-7" />
      <div class="mt-0.5 h-1 w-[54%] rounded-xs bg-slate-4" />
      <div class="h-1 w-[48%] rounded-xs bg-slate-4" />
    </div>
  </div>
</template>
