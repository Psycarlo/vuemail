<script setup lang="ts">
const { tone = 'slate' } = defineProps<{ tone?: EditorIllustrationTone }>();
</script>

<template>
  <div
    aria-hidden="true"
    :class="`relative h-14 w-[70%] max-w-44 rounded-md border ${editorIllustrationSurfaceByTone[tone].outer}`"
  >
    <div
      :class="`absolute inset-2 rounded-xs border ${editorIllustrationSurfaceByTone[tone].inner}`"
    />
  </div>
</template>
