<script setup lang="ts">
import { TooltipProvider, TooltipTrigger } from 'reka-ui';
import { useShell } from '../composables/use-shell';
import IconHideSidebar from '../icons/icon-hide-sidebar.vue';
import Heading from './heading.vue';
import Tooltip from './tooltip.vue';
import TooltipContent from './tooltip-content.vue';

defineProps<{
  emailTitle: string;
}>();

const { toggleSidebar } = useShell();
</script>

<template>
  <TooltipProvider>
    <header
      class="flex h-14 items-center justify-between gap-3 border-slate-6 border-b px-3 py-2"
    >
      <div class="flex w-fit items-center gap-3">
        <Tooltip>
          <TooltipTrigger as-child>
            <button
              class="hidden rounded-lg px-2 py-2 text-slate-11 transition duration-200 ease-in-out hover:bg-slate-5 hover:text-slate-12 lg:flex"
              type="button"
              @click="toggleSidebar()"
            >
              <IconHideSidebar :height="20" :width="20" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Show/hide sidebar</TooltipContent>
        </Tooltip>
        <div class="hidden items-center overflow-hidden text-center lg:flex">
          <Heading as="h2" class="truncate" size="2" weight="medium">
            {{ emailTitle }}
          </Heading>
        </div>
      </div>
      <div
        class="flex w-full items-center justify-between gap-3 lg:w-fit lg:justify-start"
      >
        <slot />
      </div>
    </header>
  </TooltipProvider>
</template>
