<script lang="ts">
import {
  type Component,
  defineComponent,
  h,
  type PropType,
  type SlotsType,
  type VNode,
} from 'vue';
import { useDragToChange } from '../hooks/use-drag-to-change';
import { useNumericInput } from '../hooks/use-numeric-input';
import { TextField } from '../primitives';

const PaddingInput = defineComponent({
  name: 'PaddingInput',
  props: {
    value: { type: Number, default: undefined },
    onChange: {
      type: Function as PropType<(value: number) => void>,
      required: true,
    },
    unit: { type: String, required: true },
  },
  slots: Object as SlotsType<{ icon?: () => VNode[] }>,
  setup(props, { slots }) {
    const onCommit = (v: number | '') => props.onChange(v === '' ? 0 : v);
    const { displayValue, ...handlers } = useNumericInput({
      value: () => props.value,
      onCommit,
      allowEmpty: false,
      min: 0,
    });

    const { dragProps } = useDragToChange({
      value: () => props.value,
      onCommit,
      min: 0,
    });

    return () =>
      h('span', { 'data-re-inspector-number': '' }, [
        slots.icon
          ? h(
              'span',
              { class: 'pointer-events-none', 'aria-hidden': 'true' },
              slots.icon(),
            )
          : null,
        h(TextField as Component, {
          type: 'text',
          inputmode: 'numeric',
          'data-type': 'number',
          value: displayValue.value,
          ...handlers,
        }),
        h('span', { 'data-re-inspector-unit': '', ...dragProps }, props.unit),
      ]);
  },
});

export interface PaddingValues {
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
}

export interface PaddingPickerProps {
  value: Partial<PaddingValues>;
  /** Also as `@change`. */
  onChange: (values: Partial<PaddingValues>) => void;
  unit?: 'px' | '%';
}
</script>

<script setup lang="ts">
import { ref } from 'vue';
import {
  PanelBottomIcon,
  PanelLeftIcon,
  PanelRightIcon,
  PanelTopIcon,
  SquareDashedIcon,
  SquareIcon,
} from '../../icons';
import { Label, ToggleGroup, Tooltip } from '../primitives';
import PropRow from './prop-row.vue';

defineOptions({ name: 'PaddingPicker' });

const { value, onChange, unit = 'px' } = defineProps<PaddingPickerProps>();

const allEqual =
  value.paddingTop === value.paddingBottom &&
  value.paddingTop === value.paddingLeft &&
  value.paddingTop === value.paddingRight;

const expanded = ref(!allEqual);

const handleChange = (key: keyof PaddingValues, newValue: number) => {
  onChange({
    paddingTop: value.paddingTop ?? 0,
    paddingRight: value.paddingRight ?? 0,
    paddingBottom: value.paddingBottom ?? 0,
    paddingLeft: value.paddingLeft ?? 0,
    [key]: newValue,
  });
};

const handleUniformChange = (newValue: number) => {
  onChange({
    paddingTop: newValue,
    paddingRight: newValue,
    paddingBottom: newValue,
    paddingLeft: newValue,
  });
};

const handleModeChange = (mode: string) => {
  if (mode === 'uniform' && expanded.value) {
    const uniform = value.paddingTop ?? 0;
    onChange({
      paddingTop: uniform,
      paddingRight: uniform,
      paddingBottom: uniform,
      paddingLeft: uniform,
    });
    expanded.value = false;
  } else if (mode === 'individual' && !expanded.value) {
    expanded.value = true;
  }
};

const ModeToggle = () =>
  h(
    ToggleGroup.Root,
    {
      value: expanded.value ? 'individual' : 'uniform',
      onValueChange: handleModeChange,
    },
    () => [
      h(Tooltip.Root, null, () => [
        h(Tooltip.Trigger, null, () =>
          h(ToggleGroup.Item, { value: 'uniform' }, () =>
            h(SquareIcon, { size: 16 }),
          ),
        ),
        h(Tooltip.Content, null, () => 'Uniform'),
      ]),
      h(Tooltip.Root, null, () => [
        h(Tooltip.Trigger, null, () =>
          h(ToggleGroup.Item, { value: 'individual' }, () =>
            h(SquareDashedIcon, { size: 16 }),
          ),
        ),
        h(Tooltip.Content, null, () => 'Per side'),
      ]),
    ],
  );
</script>

<template>
  <div v-if="expanded" class="flex flex-col gap-2">
    <PropRow>
      <Label>Padding</Label>
      <ModeToggle />
    </PropRow>

    <div class="flex flex-col items-center gap-1.5">
      <div class="flex items-center gap-1">
        <PaddingInput
          :value="value.paddingTop"
          :on-change="(v: number) => handleChange('paddingTop', v)"
          :unit="unit"
        >
          <template #icon><PanelTopIcon :size="14" /></template>
        </PaddingInput>
        <PaddingInput
          :value="value.paddingRight"
          :on-change="(v: number) => handleChange('paddingRight', v)"
          :unit="unit"
        >
          <template #icon><PanelRightIcon :size="14" /></template>
        </PaddingInput>
      </div>
      <div class="flex items-center gap-1">
        <PaddingInput
          :value="value.paddingBottom"
          :on-change="(v: number) => handleChange('paddingBottom', v)"
          :unit="unit"
        >
          <template #icon><PanelBottomIcon :size="14" /></template>
        </PaddingInput>
        <PaddingInput
          :value="value.paddingLeft"
          :on-change="(v: number) => handleChange('paddingLeft', v)"
          :unit="unit"
        >
          <template #icon><PanelLeftIcon :size="14" /></template>
        </PaddingInput>
      </div>
    </div>
  </div>

  <PropRow v-else>
    <Label>Padding</Label>
    <div class="flex items-center gap-1">
      <PaddingInput
        :value="value.paddingTop"
        :on-change="handleUniformChange"
        :unit="unit"
      />
      <ModeToggle />
    </div>
  </PropRow>
</template>
