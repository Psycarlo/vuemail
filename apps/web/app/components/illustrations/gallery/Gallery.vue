<script setup lang="ts">
import { ImageIcon } from 'lucide-vue-next';
</script>

<template>
  <div class="relative flex h-full w-full items-stretch gap-2 overflow-visible">
    <div
      class="flex h-max shrink grow basis-0 flex-col items-end gap-2 overflow-visible pb-2"
    >
      <div
        class="aspect-square w-[30%] rounded-xs bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-2 shadow-xs"
      >
        <div class="h-full w-full rounded-xs bg-slate-3" />
      </div>
      <div
        class="aspect-square w-[30%] rounded-xs bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-2 shadow-xs"
      >
        <div
          class="flex h-full w-full items-center justify-center rounded-xs bg-slate-3 transition-colors md:group-hover:bg-slate-4"
        >
          <ImageIcon
            class="opacity-5 transition-opacity md:group-hover:opacity-20"
          />
        </div>
      </div>
      <div
        class="aspect-square w-[30%] rounded-xs bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-2 shadow-xs"
      >
        <div class="h-full w-full rounded-xs bg-slate-3" />
      </div>
    </div>
    <div
      class="flex h-max shrink grow basis-0 flex-col items-start gap-2 overflow-visible pt-2"
    >
      <div
        class="aspect-square w-[30%] rounded-xs bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-2 shadow-xs"
      >
        <div class="h-full w-full rounded-xs bg-slate-3" />
      </div>
      <div
        class="aspect-square w-[30%] rounded-xs bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-2 shadow-xs"
      >
        <div class="h-full w-full rounded-xs bg-slate-3" />
      </div>
      <div
        class="aspect-square w-[30%] rounded-xs bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-2 shadow-xs"
      >
        <div class="h-full w-full rounded-xs bg-slate-3" />
      </div>
    </div>
  </div>
</template>
