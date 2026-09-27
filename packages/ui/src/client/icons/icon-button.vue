<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { cn } from '../utils/cn';

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();
const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});
</script>

<template>
  <button
    type="button"
    v-bind="forwardedAttrs"
    :class="
      cn(
        'focus:ring-gray-8 rounded-sm text-slate-11 transition duration-200 ease-in-out hover:text-slate-12 focus:text-slate-12 focus:outline-hidden focus:ring-2',
        attrs.class as string,
      )
    "
  >
    <slot />
  </button>
</template>
