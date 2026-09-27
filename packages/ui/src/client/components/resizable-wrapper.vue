<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useAttrs } from 'vue';
import { cn } from '../utils/cn';
import { VIEW_PRESETS } from './topbar/view-presets';

type Direction = 'north' | 'south' | 'east' | 'west';

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  width: number;
  height: number;

  maxWidth: number;
  maxHeight: number;
  minWidth: number;
  minHeight: number;
}>();

const emit = defineEmits<{
  resize: [newSize: number, direction: Direction];
  resizeEnd: [];
}>();

defineSlots<{
  /** The element to resize, which gets `resizingClass` while resizing. */
  default(props: { resizingClass: string }): unknown;
}>();

const attrs = useAttrs();
const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});

const wrapper = ref<HTMLDivElement>();
const isResizing = ref(false);
const direction = ref<Direction | null>(null);
let mouseMoveListener: ((event: MouseEvent) => void) | undefined;

// The element in the slot, after the handles
const getResizable = () => wrapper.value?.lastElementChild ?? undefined;

const removeListeners = () => {
  if (mouseMoveListener) {
    document.removeEventListener('mousemove', mouseMoveListener);
    mouseMoveListener = undefined;
  }
  document.removeEventListener('mouseup', handleStopResizing);
};

function handleStopResizing() {
  removeListeners();
  isResizing.value = false;
  direction.value = null;
  emit('resizeEnd');
}

const handleStartResizing = (newDirection: Direction) => {
  removeListeners();

  mouseMoveListener = (event) => {
    const resizable = getResizable();
    if (event.button === 0 && resizable) {
      const isHorizontal = newDirection === 'east' || newDirection === 'west';

      const mousePosition = isHorizontal ? event.clientX : event.clientY;
      const resizableBoundingRect = resizable.getBoundingClientRect();
      const center = isHorizontal
        ? resizableBoundingRect.x + resizableBoundingRect.width / 2
        : resizableBoundingRect.y + resizableBoundingRect.height / 2;

      const newPosition = Math.abs(mousePosition - center) * 2;

      isResizing.value = true;
      direction.value = newDirection;

      const threshold = 12;

      for (const preset of VIEW_PRESETS) {
        if (
          isHorizontal &&
          newPosition > preset.dimensions.width - threshold &&
          newPosition < preset.dimensions.width + threshold
        ) {
          emit('resize', preset.dimensions.width, newDirection);
          return;
        }

        if (
          !isHorizontal &&
          newPosition > preset.dimensions.height - threshold &&
          newPosition < preset.dimensions.height + threshold
        ) {
          emit('resize', preset.dimensions.height, newDirection);
          return;
        }
      }

      emit('resize', Math.abs(mousePosition - center) * 2, newDirection);
    } else {
      handleStopResizing();
    }
  };

  document.addEventListener('mouseup', handleStopResizing);
  document.addEventListener('mousemove', mouseMoveListener);
};

onBeforeUnmount(() => {
  // Finishes a resize the preview got unmounted in the middle of
  if (mouseMoveListener) handleStopResizing();
});

const isHorizontalResize = () =>
  direction.value === 'east' || direction.value === 'west';
const isVerticalResize = () =>
  direction.value === 'north' || direction.value === 'south';

const handleClasses = (handle: Direction, vertical: boolean) =>
  cn(
    vertical ? 'h-1 w-8' : 'h-8 w-1',
    'rounded-md bg-black/50 transition-colors',
    {
      'bg-black': direction.value === handle,
    },
  );
</script>

<template>
  <div class="overflow-hidden absolute inset-0">
    <div
      class="absolute mx-auto box-content -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
    >
      <div
        v-for="preset in VIEW_PRESETS"
        :key="preset.name"
        class="-translate-x-1/2 -translate-y-1/2 absolute pointer-events-none select-none"
        :style="{
          width: `${preset.dimensions.width}px`,
          height: `${preset.dimensions.height}px`,
        }"
      >
        <template
          v-if="
            props.width === preset.dimensions.width &&
            isResizing &&
            isHorizontalResize()
          "
        >
          <div
            class="absolute right-0 -top-[100vw] -bottom-[100vw] border-r-2 border-green-5"
          />
          <div
            class="absolute left-0 -top-[100vw] -bottom-[100vw] border-l-2 border-green-5"
          />
        </template>

        <template
          v-if="
            props.height === preset.dimensions.height &&
            isResizing &&
            isVerticalResize()
          "
        >
          <div
            class="absolute top-0 -left-[100vw] -right-[100vw] border-t-2 border-green-5"
          />
          <div
            class="absolute bottom-0 -left-[100vw] -right-[100vw] border-b-2 border-green-5"
          />
        </template>
      </div>
    </div>
  </div>

  <div
    v-bind="forwardedAttrs"
    ref="wrapper"
    :class="cn('relative mx-auto my-auto box-content', attrs.class as string)"
  >
    <div
      aria-label="resize-west"
      :aria-valuemax="maxWidth"
      :aria-valuemin="minWidth"
      :aria-valuenow="width"
      class="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 -left-2 cursor-w-resize p-2 [user-drag:none]"
      draggable="false"
      role="slider"
      tabindex="0"
      @dragstart.prevent
      @mousedown="handleStartResizing('west')"
    >
      <div :class="handleClasses('west', false)" />
    </div>
    <div
      aria-label="resize-east"
      :aria-valuemax="maxWidth"
      :aria-valuemin="minWidth"
      :aria-valuenow="width"
      class="translate-x-1/2 -translate-y-1/2 absolute top-1/2 -right-2 cursor-e-resize p-2 [user-drag:none]"
      draggable="false"
      role="slider"
      tabindex="0"
      @dragstart.prevent
      @mousedown="handleStartResizing('east')"
    >
      <div :class="handleClasses('east', false)" />
    </div>
    <div
      aria-label="resize-north"
      :aria-valuemax="maxHeight"
      :aria-valuemin="minHeight"
      :aria-valuenow="height"
      class="-translate-x-1/2 -translate-y-1/2 absolute -top-2 left-1/2 cursor-n-resize p-2 [user-drag:none]"
      draggable="false"
      role="slider"
      tabindex="0"
      @dragstart.prevent
      @mousedown="handleStartResizing('north')"
    >
      <div :class="handleClasses('north', true)" />
    </div>
    <div
      aria-label="resize-south"
      :aria-valuemax="maxHeight"
      :aria-valuemin="minHeight"
      :aria-valuenow="height"
      class="-translate-x-1/2 translate-y-1/2 absolute -bottom-2 left-1/2 cursor-s-resize p-2 [user-drag:none]"
      draggable="false"
      role="slider"
      tabindex="0"
      @dragstart.prevent
      @mousedown="handleStartResizing('south')"
    >
      <div :class="handleClasses('south', true)" />
    </div>

    <slot :resizing-class="isResizing ? 'select-none' : ''" />
  </div>
</template>
