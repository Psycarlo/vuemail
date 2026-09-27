<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { cn } from '../utils/cn';

type TextSize = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type TextColor = 'gray' | 'white';
type TextTransform = 'uppercase' | 'lowercase' | 'capitalize';
type TextWeight = 'normal' | 'medium';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    as?: 'span' | 'div' | 'p';
    size?: TextSize;
    color?: TextColor;
    transform?: TextTransform;
    weight?: TextWeight;
  }>(),
  { as: 'span', size: '2', color: 'gray', weight: 'normal' },
);

const attrs = useAttrs();
const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});

const sizeClasses: Record<TextSize, string | string[]> = {
  '1': 'text-xs',
  '2': 'text-sm',
  '3': 'text-base',
  '4': 'text-lg',
  '5': ['text-17px', 'md:text-xl tracking-[-0.16px]'],
  '6': 'text-2xl tracking-[-0.288px]',
  '7': 'text-[28px] leading-[34px] tracking-[-0.416px]',
  '8': 'text-[35px] leading-[42px] tracking-[-0.64px]',
  '9': 'text-6xl leading-[73px] tracking-[-0.896px]',
};

const colorClasses: Record<TextColor, string> = {
  white: 'text-slate-12',
  gray: 'text-slate-11',
};

const weightClasses: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
};

const className = computed(() =>
  cn(
    attrs.class as string,
    props.transform,
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
