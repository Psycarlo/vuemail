<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { cn } from '../utils/cn';

type Appearance = 'white' | 'gradient';
type Size = '1' | '2' | '3' | '4';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** The element to render: a `button`, or `a` for links. */
    as?: string;
    appearance?: Appearance;
    size?: Size;
    loading?: boolean;
  }>(),
  { as: 'button', appearance: 'white', size: '2', loading: undefined },
);

const attrs = useAttrs();
const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return { type: 'button', ...rest };
});

const appearanceClasses: Record<Appearance, string[]> = {
  white: [
    'border-white bg-white text-black transition-colors duration-200 ease-in-out',
    'hover:bg-white/90',
    'focus:bg-white/90 focus:outline-hidden focus:ring-2 focus:ring-white/20',
    'mt-2 mb-2 aria-disabled:border-transparent aria-disabled:bg-slate-11',
  ],
  gradient: [
    'bg-gradient border-[#34343A] backdrop-blur-[1.25rem]',
    'hover:bg-gradient-hover',
    'focus:bg-gradient-hover focus:outline-hidden focus:ring-2 focus:ring-white/20',
  ],
};

const sizeClasses: Record<Size, string> = {
  '1': '',
  '2': 'text-[.875rem] h-8 px-3 rounded-md gap-2',
  '3': 'text-[.875rem] h-10 px-4 rounded-md gap-2',
  '4': 'text-base h-11 px-4 rounded-md gap-2',
};

const className = computed(() =>
  cn(
    sizeClasses[props.size],
    appearanceClasses[props.appearance],
    'inline-flex items-center justify-center gap-2 border font-medium',
    attrs.class as string,
  ),
);
</script>

<template>
  <component
    :is="as"
    v-bind="forwardedAttrs"
    :aria-disabled="loading"
    :class="className"
  >
    <span
      :class="
        cn(
          '-ml-7 opacity-0 transition-opacity duration-200',
          loading && 'opacity-100',
        )
      "
    >
      <div class="h-5 w-5">
        <svg
          aria-hidden="true"
          fill="currentColor"
          height="100%"
          viewBox="0 0 24 24"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </div>
    </span>
    <slot />
  </component>
</template>
