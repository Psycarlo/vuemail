<script lang="ts">
/** The styling solutions the components are written with, both with Vue. */
export type VueCodeVariant = 'tailwind' | 'inline-styles';
</script>

<script setup lang="ts">
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-vue-next';
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui';

const model = defineModel<VueCodeVariant>({ required: true });

const variants: VueCodeVariant[] = ['tailwind', 'inline-styles'];

const labelOf = (variant: VueCodeVariant) =>
  variant === 'tailwind' ? 'Tailwind CSS' : 'Inline CSS';
</script>

<template>
  <SelectRoot v-model="model">
    <SelectTrigger
      aria-label="Choose the styling solution"
      class="flex h-8 items-center justify-center gap-1 rounded-sm bg-slate-3 px-3 leading-none outline-hidden focus-within:ring-2 focus-within:ring-slate-6/50 data-placeholder:text-slate-11"
    >
      <SelectValue>{{ labelOf(model) }}</SelectValue>
      <SelectIcon>
        <ChevronDownIcon :size="14" />
      </SelectIcon>
    </SelectTrigger>
    <SelectPortal>
      <SelectContent class="z-2 overflow-hidden rounded-md bg-[#1F2122]">
        <SelectScrollUpButton
          class="flex h-6 cursor-default items-center justify-center"
        >
          <ChevronUpIcon :size="12" />
        </SelectScrollUpButton>
        <SelectViewport class="p-1">
          <SelectItem
            v-for="variant in variants"
            :key="variant"
            class="relative flex h-8 cursor-pointer select-none items-center rounded-[.25rem] px-6 py-2 text-slate-11 text-xs leading-none transition-colors ease-[cubic-bezier(.36,.66,.6,1)] data-disabled:pointer-events-none data-highlighted:bg-slate-3 data-highlighted:text-slate-12 data-highlighted:outline-hidden"
            :value="variant"
          >
            <SelectItemText>{{ labelOf(variant) }}</SelectItemText>
            <SelectItemIndicator
              class="absolute left-0 inline-flex w-6 items-center justify-center text-slate-12"
            >
              <CheckIcon :size="10" />
            </SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
