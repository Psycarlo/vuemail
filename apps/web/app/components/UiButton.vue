<script setup lang="ts">
import { Primitive } from 'reka-ui';
import { computed } from 'vue';

type Appearance = 'white' | 'gradient';
type Size = '1' | '2' | '3' | '4' | '5';

const props = withDefaults(
  defineProps<{
    asChild?: boolean;
    appearance?: Appearance;
    size?: Size;
  }>(),
  { appearance: 'white', size: '2' },
);

const appearances: Record<Appearance, string[]> = {
  white: [
    'bg-white text-black',
    'hover:bg-white/90',
    'focus-visible:ring-slate-10 focus-visible:bg-white/90 focus-visible:outline-hidden focus-visible:ring-2',
    'selection:text-black',
  ],
  gradient: [
    'bg-gradient border-[#34343A] backdrop-blur-[1.25rem]',
    'hover:bg-gradientHover',
    'focus-visible:bg-gradientHover focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/20',
  ],
};

const sizes: Record<Size, string> = {
  '1': '',
  '2': 'h-8 gap-2 rounded-xl px-3 text-[.875rem] transition-colors',
  '3': 'h-10 gap-2 rounded-xl px-4 text-[.875rem] transition-colors',
  '4': 'h-11 gap-2 rounded-xl px-4 text-base transition-colors',
  '5': 'h-12 gap-2 rounded-xl px-4 text-base transition-colors',
};

const classes = computed(() => [
  sizes[props.size],
  appearances[props.appearance],
  'inline-flex items-center justify-center border font-medium',
]);
</script>

<template>
  <Primitive
    :as="asChild ? undefined : 'button'"
    :as-child="asChild"
    :class="classes"
    :type="asChild ? undefined : 'button'"
  >
    <slot />
  </Primitive>
</template>
