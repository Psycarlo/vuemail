<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { normalizeHex } from '../utils/is-valid-hex-color';

export interface ColorInputProps
  extends /* @vue-ignore */ Pick<HTMLAttributes, 'class'> {
  value: string;
  /** Called with every new color, also as `@change`. */
  onChange: (value: string) => void;
}

defineOptions({ name: 'ColorInput' });

const { value, onChange } = defineProps<ColorInputProps>();

const handleInput = (event: Event) => {
  onChange((event.target as HTMLInputElement).value);
};
</script>

<template>
  <span data-re-inspector-color-control="">
    <input
      type="color"
      data-re-inspector-color-trigger=""
      :value="normalizeHex(value)"
      @input="handleInput"
    />
    <input
      type="text"
      data-re-inspector-color-hex=""
      :value="value"
      @input="handleInput"
    />
  </span>
</template>
