<script setup lang="ts">
import { Toggle, TooltipTrigger } from 'reka-ui';
import IconPanelRight from '../../icons/icon-panel-right.vue';
import { cn } from '../../utils/cn';
import Tooltip from '../tooltip.vue';
import TooltipContent from '../tooltip-content.vue';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  change: [open: boolean];
}>();
</script>

<template>
  <Tooltip>
    <TooltipTrigger as-child>
      <Toggle
        aria-label="Props panel"
        :class="
          cn(
            'relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-6 text-sm transition duration-200 ease-in-out',
            'text-slate-11 aria-pressed:bg-slate-4 hover:text-slate-12',
          )
        "
        :model-value="open"
        value="props"
        @update:model-value="emit('change', !props.open)"
      >
        <IconPanelRight :size="20" />
      </Toggle>
    </TooltipTrigger>
    <TooltipContent>Show/hide the props panel</TooltipContent>
  </Tooltip>
</template>
