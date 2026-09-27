<script setup lang="ts">
import { SearchIcon } from 'lucide-vue-next';
</script>

<template>
  <div
    class="relative flex w-[40%] flex-col gap-2 rounded-md border-2 border-dashed border-transparent bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-4 shadow-xs transition-all duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] before:absolute before:top-1/2 before:left-3 before:h-full before:w-1 before:-translate-y-1/2 before:border-l-2 before:border-dashed before:border-transparent before:transition-all before:transition-duration-150 before:ease-[cubic-bezier(.42,0,.58,1.8)] before:content-[''] after:absolute after:top-1/2 after:right-3 after:h-full after:w-1 after:-translate-y-1/2 after:border-r-2 after:border-dashed after:border-transparent after:transition-all after:transition-duration-150 after:ease-[cubic-bezier(.42,0,.58,1.8)] after:content-[''] group-hover:border-slate-4 group-hover:via-black/20 group-hover:to-[#42B883]/5 group-hover:before:border-slate-4 group-hover:after:border-slate-4 md:group-hover:-skew-x-2"
  >
    <div
      class="absolute left-[66%] top-[84%] -translate-x-1/2 rotate-50 opacity-0 transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:-translate-y-3 group-hover:translate-x-0 group-hover:rotate-0 group-hover:opacity-100"
    >
      <SearchIcon
        :stroke-width="3"
        class="h-6 w-6 fill-slate-4 text-[#42B883]"
      />
    </div>
    <div class="flex w-full gap-1">
      <div
        class="h-1 w-[24%] rounded-xs bg-[#42B883] shadow-[0px_0px_9px_4px_rgba(66,184,131,0.10)] transition-colors ease-in-out group-hover:bg-slate-8"
      />
      <div class="h-1 shrink grow basis-0 rounded-xs bg-slate-5" />
    </div>
    <div class="h-1 w-[80%] rounded-xs bg-slate-5" />
    <div class="h-1 w-[60%] rounded-xs bg-slate-5" />
    <div
      class="h-1 w-[24%] rounded-xs bg-slate-7 shadow-[0px_0px_9px_4px_rgba(66,184,131,0.10)] transition-colors ease-in-out group-hover:bg-[#42B883]"
    />
    <div />
    <div />
    <div class="h-1 w-[24%] rounded-xs bg-slate-7" />
    <div class="h-1 w-[36%] rounded-xs bg-slate-7" />
  </div>
</template>
