<script setup lang="ts">
import { usePreviewContext } from '../composables/use-preview';
import { usePropsPanel } from '../composables/use-props-panel';
import { cn } from '../utils/cn';
import PreviewPropsEditor from './preview-props-editor.vue';

defineProps<{ open: boolean }>();

const { animated } = usePropsPanel();
const { emailSlug } = usePreviewContext();
</script>

<template>
  <aside
    :class="
      cn(
        'shrink-0 overflow-hidden border-l border-slate-6',
        animated && 'transition-[width] duration-200 will-change-[width]',
        open ? 'w-72' : 'w-0 border-l-0',
      )
    "
    :inert="!open"
  >
    <div class="flex h-full w-72 flex-col">
      <div
        class="flex h-10 shrink-0 items-center border-b border-slate-6 px-4 font-medium text-slate-12 text-xs"
      >
        Props
      </div>
      <div class="grow overflow-y-auto px-4 pt-3 text-slate-11 text-xs">
        <PreviewPropsEditor :key="emailSlug" />
      </div>
    </div>
  </aside>
</template>
