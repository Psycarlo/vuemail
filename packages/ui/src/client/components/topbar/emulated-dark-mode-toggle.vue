<script setup lang="ts">
import { Toggle, TooltipTrigger } from 'reka-ui';
import IconMoon from '../../icons/icon-moon.vue';
import IconSun from '../../icons/icon-sun.vue';
import { cn } from '../../utils/cn';
import Tooltip from '../tooltip.vue';
import TooltipContent from '../tooltip-content.vue';

const props = defineProps<{
  enabled: boolean;
}>();

const emit = defineEmits<{
  change: [enabled: boolean];
}>();
</script>

<template>
  <Tooltip>
    <TooltipTrigger as-child>
      <Toggle
        :class="
          cn(
            'relative w-9 h-9 flex items-center justify-center border border-slate-6 text-sm rounded-lg transition duration-200 ease-in-out',
            'text-slate-11 hover:text-slate-12 aria-pressed:bg-slate-4',
          )
        "
        :model-value="enabled"
        value="dark"
        @update:model-value="emit('change', !props.enabled)"
      >
        <div class="relative w-5 h-5">
          <div
            :class="
              cn(
                'absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out',
                enabled
                  ? 'opacity-0 scale-50 rotate-90'
                  : 'opacity-100 scale-100 rotate-0',
              )
            "
          >
            <IconMoon />
          </div>
          <div
            :class="
              cn(
                'absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out',
                enabled
                  ? 'opacity-100 scale-100 rotate-0'
                  : 'opacity-0 scale-50 -rotate-90',
              )
            "
          >
            <IconSun />
          </div>
        </div>
      </Toggle>
    </TooltipTrigger>
    <TooltipContent>
      When enabled, inverts colors in the preview emulating what email clients
      do in dark mode.
    </TooltipContent>
  </Tooltip>
</template>
