<script setup lang="ts">
import { computed } from 'vue';

type HeadingSize = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';
type HeadingColor = 'white' | 'gray' | 'gradient';
type HeadingWeight = 'medium' | 'bold';

const props = withDefaults(
  defineProps<{
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    size?: HeadingSize;
    color?: HeadingColor;
    weight?: HeadingWeight;
  }>(),
  { as: 'h1', size: '3', color: 'white', weight: 'bold' },
);

const sizes: Record<HeadingSize, string | string[]> = {
  '1': 'text-xs',
  '2': 'text-sm',
  '3': 'text-base',
  '4': 'text-lg',
  '5': 'text-lg sm:text-xl tracking-[-0.16px]',
  '6': 'text-2xl tracking-[-0.01em]',
  '7': 'text-[28px] leading-[34px] tracking-[-0.416px]',
  '8': 'text-[28px] leading-[38px] sm:text-[35px] sm:leading-[42px] tracking-[-0.025em]',
  '9': 'text-6xl leading-[64px] tracking-[-0.05em]',
  '10': [
    'text-[40px] leading-[48px]',
    'md:text-[68px] md:leading-[64px] tracking-[-0.05em]',
  ],
};

const colors: Record<HeadingColor, string> = {
  gray: 'text-slate-11',
  white: 'text-slate-12',
  gradient:
    'bg-clip-text text-transparent bg-linear-to-br from-white/90 via-white/80 to-95% to-green-11/70',
};

const weights: Record<HeadingWeight, string> = {
  medium: 'font-medium',
  bold: 'font-bold',
};

const classes = computed(() => [
  sizes[props.size],
  colors[props.color],
  weights[props.weight],
]);
</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>
