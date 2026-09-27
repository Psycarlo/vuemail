<script setup lang="ts">
import { motion } from 'motion-v';
import {
  type AcceptableValue,
  ToggleGroupItem,
  ToggleGroupRoot,
  TooltipTrigger,
} from 'reka-ui';
import IconMonitor from '../../icons/icon-monitor.vue';
import IconSource from '../../icons/icon-source.vue';
import { cn } from '../../utils/cn';
import { tabTransition } from '../../utils/constants';
import Tooltip from '../tooltip.vue';
import TooltipContent from '../tooltip-content.vue';

defineProps<{
  activeView: string;
}>();

const emit = defineEmits<{
  'update:activeView': [view: string];
}>();

const onValueChange = (value: AcceptableValue | AcceptableValue[]) => {
  if (typeof value === 'string' && value) emit('update:activeView', value);
};
</script>

<template>
  <ToggleGroupRoot
    aria-label="View mode"
    class="lg:absolute lg:left-1/2 lg:-translate-x-1/2 inline-block items-center bg-slate-2 border border-slate-6 rounded-md overflow-hidden h-[36px]"
    type="single"
    :model-value="activeView"
    @update:model-value="onValueChange"
  >
    <ToggleGroupItem value="preview">
      <Tooltip>
        <TooltipTrigger as-child>
          <div
            :class="
              cn(
                'w-9 flex items-center py-2 transition ease-in-out duration-200 relative hover:text-slate-12',
                {
                  'text-slate-11': activeView !== 'preview',
                  'text-slate-12': activeView === 'preview',
                },
              )
            "
          >
            <motion.span
              v-if="activeView === 'preview'"
              :animate="{ opacity: 1 }"
              class="absolute left-0 right-0 top-0 bottom-0 bg-slate-4"
              :exit="{ opacity: 0 }"
              :initial="{ opacity: 0 }"
              layout-id="topbar-tabs"
              :transition="tabTransition"
            />
            <IconMonitor class="m-auto" />
          </div>
        </TooltipTrigger>
        <TooltipContent>Preview</TooltipContent>
      </Tooltip>
    </ToggleGroupItem>
    <ToggleGroupItem value="source">
      <Tooltip>
        <TooltipTrigger as-child>
          <div
            :class="
              cn(
                'w-9 flex  py-2 transition ease-in-out duration-200 relative hover:text-slate-12',
                {
                  'text-slate-11': activeView !== 'source',
                  'text-slate-12': activeView === 'source',
                },
              )
            "
          >
            <motion.span
              v-if="activeView === 'source'"
              :animate="{ opacity: 1 }"
              class="absolute left-0 right-0 top-0 bottom-0 bg-slate-4"
              :exit="{ opacity: 0 }"
              :initial="{ opacity: 0 }"
              layout-id="topbar-tabs"
              :transition="tabTransition"
            />
            <IconSource class="m-auto" />
          </div>
        </TooltipTrigger>
        <TooltipContent>Code</TooltipContent>
      </Tooltip>
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>
