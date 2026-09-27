<script setup lang="ts">
import {
  TooltipContent,
  type TooltipContentEmits,
  type TooltipContentProps,
  TooltipPortal,
  useForwardPropsEmits,
} from 'reka-ui';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TooltipContentProps>(), {
  sideOffset: 6,
});
const emits = defineEmits<TooltipContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      v-bind="{ ...$attrs, ...forwarded }"
      class="z-20 rounded-md border border-slate-6 bg-black px-3 py-2 text-white text-xs font-sans max-w-60"
    >
      <slot />
    </TooltipContent>
  </TooltipPortal>
</template>
