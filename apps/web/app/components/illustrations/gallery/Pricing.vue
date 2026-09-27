<script setup lang="ts">
import { CircleDollarSign } from 'lucide-vue-next';
</script>

<template>
  <div
    class="relative flex aspect-square w-[40%] flex-col items-center justify-center gap-2 rounded-md bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-3 shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:skew-x-3"
  >
    <div class="w-full flex flex-col items-center justify-center gap-1">
      <div class="flex aspect-video w-full items-center justify-center gap-2">
        <div
          class="flex aspect-square w-[54%] items-center justify-center rounded-xs bg-slate-4"
        >
          <CircleDollarSign
            class="opacity-10 transition-all group-hover:opacity-20 group-hover:scale-110"
          />
        </div>
      </div>
      <div class="flex w-[54%] flex-col gap-1">
        <div class="h-2 w-full rounded-xs bg-slate-5" />
        <div
          class="h-2 w-full mt-1 rounded-xs border border-[#42D392] bg-[#42B883] shadow-[0px_0px_9px_4px_rgba(66,184,131,0.10)] group-hover:-skew-x-3"
        />
      </div>
    </div>
  </div>
</template>
