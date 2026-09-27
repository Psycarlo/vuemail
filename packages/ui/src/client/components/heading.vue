<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { cn } from '../utils/cn';

type HeadingSize = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';
type HeadingColor = 'white' | 'gray';
type HeadingWeight = 'medium' | 'bold';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    size?: HeadingSize;
    color?: HeadingColor;
    weight?: HeadingWeight;
  }>(),
  { as: 'h1', size: '3', color: 'white', weight: 'bold' },
);

const attrs = useAttrs();
const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});

const sizeClasses: Record<HeadingSize, string | string[]> = {
  '1': 'text-xs',
  '2': 'text-sm',
  '3': 'text-base',
  '4': 'text-lg',
  '5': 'text-xl tracking-[-0.16px]',
  '6': 'text-2xl tracking-[-0.288px]',
  '7': 'text-[28px] leading-[34px] tracking-[-0.416px]',
  '8': 'text-[35px] leading-[42px] tracking-[-0.64px]',
  '9': 'text-6xl leading-[73px] tracking-[-0.896px]',
  '10': [
    'text-[38px] leading-[46px]',
    'md:text-[70px] md:leading-[85px] tracking-[-1.024px;]',
  ],
};

const colorClasses: Record<HeadingColor, string> = {
  gray: 'text-slate-11',
  white: 'text-slate-12',
};

const weightClasses: Record<HeadingWeight, string> = {
  medium: 'font-medium',
  bold: 'font-bold',
};

const className = computed(() =>
  cn(
    attrs.class as string,
    sizeClasses[props.size],
    colorClasses[props.color],
    weightClasses[props.weight],
  ),
);
</script>

<template>
  <component :is="as" v-bind="forwardedAttrs" :class="className">
    <slot />
  </component>
</template>
