<script setup lang="ts">
useHead({
  bodyAttrs: {
    class:
      'h-screen-ios overflow-x-hidden bg-black font-sans text-slate-11 text-sm selection:bg-green-5 selection:text-green-12 antialiased',
  },
});
</script>

<template>
  <div
    class="relative mx-auto flex flex-col justify-between px-2 md:max-w-7xl md:px-4"
  >
    <AppTopbar />
  </div>
  <NuxtPage />
</template>
