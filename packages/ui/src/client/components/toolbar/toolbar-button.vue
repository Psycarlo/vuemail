<script setup lang="ts">
import { motion } from 'motion-v';
import { TooltipProvider, TooltipTrigger } from 'reka-ui';
import { computed, useAttrs } from 'vue';
import { cn } from '../../utils/cn';
import Tooltip from '../tooltip.vue';
import TooltipContent from '../tooltip-content.vue';

// Triggers wrapping this button, like the tabs', pass their attributes on to it
defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    active?: boolean;
    tooltip?: string;
    delayDuration?: number;
  }>(),
  { delayDuration: 500 },
);

const attrs = useAttrs();
const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});
</script>

<template>
  <TooltipProvider>
    <Tooltip :delay-duration="delayDuration">
      <TooltipTrigger as-child>
        <button
          type="button"
          v-bind="forwardedAttrs"
          :class="
            cn(
              'h-full w-fit shrink-0 whitespace-nowrap font-regular flex text-sm text-slate-10 items-center align-middle justify-center px-1 gap-2 relative',
              'hover:text-slate-12 transition-colors',
              active && 'data-[state=active]:text-green-11',
              attrs.class as string,
            )
          "
        >
          <slot />
          <motion.span
            v-if="active"
            class="bottom-0 absolute rounded-xs left-0 w-full bg-green-11 h-px"
            layout-id="active-toolbar-button"
            :transition="{
              type: 'spring',
              bounce: 0.2,
              duration: 0.6,
            }"
          />
        </button>
      </TooltipTrigger>
      <TooltipContent v-if="tooltip">{{ tooltip }}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
