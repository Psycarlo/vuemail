<script setup lang="ts">
import { TooltipContent, TooltipPortal } from 'reka-ui';

withDefaults(defineProps<{ sideOffset?: number }>(), { sideOffset: 6 });
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      class="z-20 rounded-md border border-slate-6 bg-black px-3 py-2 text-white text-xs"
      :side-offset="sideOffset"
    >
      <slot />
    </TooltipContent>
  </TooltipPortal>
</template>
