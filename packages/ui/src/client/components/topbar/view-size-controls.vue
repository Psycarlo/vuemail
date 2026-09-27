<script setup lang="ts">
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  TooltipTrigger,
} from 'reka-ui';
import { ref, watch } from 'vue';
import IconArrowDown from '../../icons/icon-arrow-down.vue';
import { cn } from '../../utils/cn';
import Tooltip from '../tooltip.vue';
import TooltipContent from '../tooltip-content.vue';
import { VIEW_PRESETS, type ViewDimensions } from './view-presets';

const props = defineProps<{
  minWidth: number;
  minHeight: number;
  viewWidth: number;
  viewHeight: number;
}>();

const emit = defineEmits<{
  'update:viewWidth': [width: number];
  'update:viewHeight': [height: number];
}>();

const isDropdownOpen = ref(false);
const internalWidth = ref(props.viewWidth);
const internalHeight = ref(props.viewHeight);

const handlePresetSelect = (dimensions: ViewDimensions) => {
  emit('update:viewWidth', dimensions.width);
  emit('update:viewHeight', dimensions.height);
};

watch(
  () => [props.viewWidth, props.viewHeight] as const,
  ([viewWidth, viewHeight]) => {
    internalWidth.value = viewWidth;
    internalHeight.value = viewHeight;
  },
);

const onWidthInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value);

  internalWidth.value = value;

  if (value >= props.minWidth) {
    emit('update:viewWidth', value);
  }
};

const onHeightInput = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value);

  internalHeight.value = value;

  if (value >= props.minHeight) {
    emit('update:viewHeight', value);
  }
};
</script>

<template>
  <div
    class="relative flex h-9 w-fit overflow-hidden rounded-lg border border-slate-6 text-sm transition-colors duration-300 ease-in-out"
  >
    <Tooltip v-for="preset in VIEW_PRESETS" :key="preset.name">
      <TooltipTrigger as-child>
        <button
          :class="
            cn(
              'relative flex items-center justify-center w-9 transition-colors hover:text-slate-12',
              {
                'bg-slate-4': viewWidth === preset.dimensions.width,
              },
            )
          "
          type="button"
          @click="handlePresetSelect(preset.dimensions)"
        >
          <svg fill="none" height="15" viewBox="0 0 15 15" width="15">
            <path
              clip-rule="evenodd"
              :d="preset.iconPath"
              fill="currentColor"
              fill-rule="evenodd"
            />
          </svg>
        </button>
      </TooltipTrigger>
      <TooltipContent>{{ preset.name }}</TooltipContent>
    </Tooltip>

    <PopoverRoot v-model:open="isDropdownOpen">
      <PopoverTrigger as-child>
        <button
          class="relative flex items-center justify-center overflow-hidden w-9 text-slate-11 text-sm leading-none outline-hidden transition-colors ease-linear focus-within:text-slate-12 hover:text-slate-12 focus:text-slate-12"
          type="button"
        >
          <span class="sr-only">View presets</span>
          <IconArrowDown
            :class="
              cn(
                'transform transition-transform duration-200 ease-[cubic-bezier(.36,.66,.6,1)]',
                {
                  '-rotate-180': isDropdownOpen,
                },
              )
            "
          />
        </button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          align="end"
          class="flex min-w-48 flex-col gap-2 rounded-md border border-slate-8 border-solid bg-black px-2 py-2 text-white"
          :side-offset="5"
        >
          <div class="flex w-full items-center justify-between text-sm gap-2">
            <span class="font-medium text-slate-11 text-xs">Width</span>
            <input
              class="w-20 appearance-none rounded-lg border border-slate-6 bg-slate-5 px-1 py-1 text-sm text-slate-12 placeholder-slate-10 outline-hidden transition duration-300 ease-in-out focus:ring-1 focus:ring-slate-10"
              type="number"
              :value="internalWidth"
              @input="onWidthInput"
            />
          </div>

          <div class="flex w-full items-center justify-between text-sm gap-2">
            <span class="font-medium text-slate-11 text-xs">Height</span>
            <input
              class="w-20 appearance-none rounded-lg border border-slate-6 bg-slate-5 px-1 py-1 text-sm text-slate-12 placeholder-slate-10 outline-hidden transition duration-300 ease-in-out focus:ring-1 focus:ring-slate-10"
              type="number"
              :value="internalHeight"
              @input="onHeightInput"
            />
          </div>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </div>
</template>
