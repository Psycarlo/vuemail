<script setup lang="ts">
defineProps<{ message: string }>();
</script>

<template>
  <div class="flex flex-col items-center justify-center pt-8">
    <div class="relative mb-8 flex items-center justify-center">
      <div
        class="h-12 w-12 rounded-full bg-linear-to-br from-green-400/80 to-green-600/80 opacity-10 blur-xl absolute m-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
      />
      <div
        class="h-12 w-12 rounded-full border border-slate-4 absolute m-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />
      <div
        class="h-10 w-10 rounded-full flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          class="h-5 w-5 rounded-full border-2 border-white/50 border-t-transparent animate-spin-fast"
        />
      </div>
    </div>
    <h3 class="text-slate-12 font-medium text-base mb-1">Processing</h3>
    <p class="text-slate-11 text-sm text-center max-w-[320px]">
      {{ message }}
    </p>
  </div>
</template>
