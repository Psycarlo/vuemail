<script setup lang="ts">
import { UserRoundIcon } from 'lucide-vue-next';
</script>

<template>
  <div class="relative flex items-center">
    <div
      class="relative size-9 rounded-full border-4 border-black shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] md:group-hover:-translate-x-2 md:group-hover:-rotate-12"
    >
      <div
        class="absolute inset-0 rounded-full border border-[#42D392] bg-[#42B883] text-lg text-transparent"
      >
        <span
          class="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full pt-2"
        >
          <UserRoundIcon class="fill-black/50" />
        </span>
      </div>
    </div>
    <div
      class="relative -ml-2 size-9 rounded-full border-4 border-black shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] md:group-hover:-translate-x-1 md:group-hover:-translate-y-1"
    >
      <div
        class="absolute inset-0 rounded-full border border-[#42D392] bg-[#42B883] text-lg text-transparent"
      >
        <span
          class="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full pt-2"
        >
          <UserRoundIcon class="fill-black/50" />
        </span>
      </div>
    </div>
    <div
      class="relative -ml-2 size-9 rounded-full border-4 border-black shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] md:group-hover:rotate-6"
    >
      <div
        class="absolute inset-0 rounded-full border border-[#42D392] bg-[#42B883] text-lg text-transparent"
      >
        <span
          class="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full pt-2"
        >
          <UserRoundIcon class="fill-black/50" />
        </span>
      </div>
    </div>
  </div>
</template>
