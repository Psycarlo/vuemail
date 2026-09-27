<script setup lang="ts">
import { Primitive } from 'reka-ui';

defineProps<{
  active?: boolean;
  as?: string;
  asChild?: boolean;
}>();
</script>

<template>
  <Primitive
    :as="asChild ? undefined : (as ?? 'button')"
    :as-child="asChild"
    :class="[
      'inline-flex w-full items-center justify-center px-2 md:w-fit',
      'inline-flex h-8 scroll-m-2 items-center rounded-md text-slate-11 text-sm transition-colors hover:bg-slate-6 hover:text-slate-12 focus:bg-slate-6 focus:outline-hidden focus:ring-3 focus:ring-slate-3 md:justify-center',
      'data-[active=true]:bg-slate-6 data-[active=true]:text-slate-12',
    ]"
    :data-active="active"
    :type="!asChild && !as ? 'button' : undefined"
  >
    <slot />
  </Primitive>
</template>
