<script setup lang="ts">
defineProps<{ code: string; githubUrl: string }>();
</script>

<template>
  <div class="flex h-full w-full flex-col bg-slate-3">
    <div
      class="relative flex w-full items-center justify-between border-slate-4 border-b border-solid p-4 text-xs"
    >
      <span class="font-mono text-slate-11">example.vue</span>
      <div class="flex items-center gap-2">
        <a
          :href="githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center justify-center rounded-md p-1.5 text-slate-11 transition-colors hover:text-slate-12"
        >
          <IconGitHub :size="16" />
        </a>
        <CopyCode class="shadow-none p-2 h-8 w-8" :code="code" />
      </div>
    </div>
    <div class="h-full w-full overflow-auto">
      <SiteCodeBlock :code="code" language="vue" :is-gradient-line="false" />
    </div>
  </div>
</template>
