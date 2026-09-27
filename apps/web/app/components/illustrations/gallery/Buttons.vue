<script setup lang="ts">
import { MousePointer2Icon } from 'lucide-vue-next';
</script>

<template>
  <div
    class="relative flex h-6 w-[24%] items-center justify-center rounded-md border border-[#42D392] bg-[#42B883] p-1 shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] md:group-hover:rotate-3"
  >
    <div class="h-2 w-[80%] rounded-xs bg-black/30" />
    <MousePointer2Icon
      class="-bottom-4 md:group-hover:-rotate-12 absolute left-[80%] transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)]"
      fill="currentColor"
      stroke="currentColor"
    />
  </div>
</template>
