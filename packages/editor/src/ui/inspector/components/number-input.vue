<script setup lang="ts">
import { computed } from 'vue';
import { useDragToChange } from '../hooks/use-drag-to-change';
import { useNumericInput } from '../hooks/use-numeric-input';
import { Select, TextField } from '../primitives';

interface NumberInputProps {
  value: string | number;
  /** Called with every committed value, also as `@change`. */
  onChange: (value: number | '') => void;
  placeholder?: string;
  unit?: 'px' | '%';
  min?: number;
  unitOptions?: string[];
  /** Also as `@unit-change`. */
  onUnitChange?: (unit: string) => void;
}

defineOptions({ name: 'NumberInput' });

const props = defineProps<NumberInputProps>();

defineSlots<{
  /** An icon before the input. */
  icon?: () => unknown;
}>();

const { displayValue, onInput, onBlur, onFocus, onKeydown } = useNumericInput({
  value: () => props.value,
  onCommit: (value) => props.onChange(value),
  min: () => props.min,
  fallbackValue: () =>
    props.placeholder ? Number(props.placeholder) : undefined,
});

const { dragProps } = useDragToChange({
  value: () => props.value,
  onCommit: (value) => props.onChange(value),
  min: () => props.min,
});

const hasUnitSelect = computed(
  () => props.unitOptions && props.unitOptions.length > 1 && props.onUnitChange,
);

const handleUnitChange = (event: Event) => {
  props.onUnitChange?.((event.target as HTMLSelectElement).value);
};
</script>

<template>
  <span data-re-inspector-number="">
    <span v-if="$slots.icon" class="pointer-events-none" aria-hidden="true">
      <slot name="icon" />
    </span>
    <TextField
      :value="displayValue"
      :placeholder="placeholder"
      type="text"
      inputmode="numeric"
      data-type="number"
      @input="onInput"
      @blur="onBlur"
      @focus="onFocus"
      @keydown="onKeydown"
    />
    <Select.Root
      v-if="hasUnitSelect"
      :value="unit"
      @change="handleUnitChange"
    >
      <Select.Item v-for="opt in unitOptions" :key="opt" :value="opt">
        {{ opt }}
      </Select.Item>
    </Select.Root>
    <span v-else-if="unit" data-re-inspector-unit="" v-bind="dragProps">
      {{ unit }}
    </span>
  </span>
</template>
