<script setup lang="ts">
defineProps<{ title: string; description: string }>();

// An example's page shows its title and description itself
const hideHeader = inject(editorExamplePageKey, false);
</script>

<template>
  <div class="flex flex-col h-full">
    <template v-if="!hideHeader">
      <h2 class="text-lg font-semibold text-slate-12 mb-1">{{ title }}</h2>
      <p class="text-sm text-slate-11 mb-4">{{ description }}</p>
    </template>
    <div
      class="example-shell-content dark focus-visible:outline-none border border-slate-4 rounded-xl p-4 flex-1 min-h-[350px] flex flex-col grow"
    >
      <slot />
    </div>
  </div>
</template>
