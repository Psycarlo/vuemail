<script setup lang="ts">
import { computed } from 'vue';

type TextSize = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type TextColor = 'gray' | 'white';

const props = withDefaults(
  defineProps<{
    as?: 'span' | 'div' | 'p';
    size?: TextSize;
    color?: TextColor;
  }>(),
  { as: 'span', size: '2', color: 'gray' },
);

const sizes: Record<TextSize, string | string[]> = {
  '1': 'text-xs',
  '2': 'text-sm',
  '3': 'text-base',
  '4': 'text-base sm:text-lg',
  '5': ['text-[17px]', 'md:text-xl tracking-[-0.16px]'],
  '6': 'text-2xl tracking-[-0.288px]',
  '7': 'text-[28px] leading-[34px] tracking-[-0.416px]',
  '8': 'text-[35px] leading-[42px] tracking-[-0.64px]',
  '9': 'text-6xl leading-[73px] tracking-[-0.896px]',
};

const colors: Record<TextColor, string> = {
  white: 'text-slate-12',
  gray: 'text-slate-11',
};

const classes = computed(() => [sizes[props.size], colors[props.color]]);
</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>
