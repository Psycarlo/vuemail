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

const RadiusInput = defineComponent({
  name: 'RadiusInput',
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

interface ExpandedRadius {
  borderTopLeftRadius: number;
  borderTopRightRadius: number;
  borderBottomRightRadius: number;
  borderBottomLeftRadius: number;
}

function expandShorthand(value: string | number): ExpandedRadius {
  if (typeof value === 'number') {
    return {
      borderTopLeftRadius: value,
      borderTopRightRadius: value,
      borderBottomRightRadius: value,
      borderBottomLeftRadius: value,
    };
  }

  const [topLeft, topRight, bottomRight, bottomLeft] = value
    .split(' ')
    .map((v) => Number.parseInt(v, 10));

  return {
    borderTopLeftRadius: topLeft,
    borderTopRightRadius: topRight ?? topLeft,
    borderBottomRightRadius: bottomRight ?? topLeft,
    borderBottomLeftRadius: bottomLeft ?? topRight ?? topLeft,
  };
}

function collapseToShorthand(
  values: ExpandedRadius & { unit: string },
): string {
  const {
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomRightRadius,
    borderBottomLeftRadius,
    unit,
  } = values;

  if (
    borderTopLeftRadius === borderTopRightRadius &&
    borderTopLeftRadius === borderBottomRightRadius &&
    borderTopLeftRadius === borderBottomLeftRadius
  ) {
    return `${borderTopLeftRadius}${unit}`;
  }

  if (
    borderTopLeftRadius === borderBottomRightRadius &&
    borderTopRightRadius === borderBottomLeftRadius
  ) {
    return `${borderTopLeftRadius}${unit} ${borderTopRightRadius}${unit}`;
  }

  if (borderTopRightRadius === borderBottomLeftRadius) {
    return `${borderTopLeftRadius}${unit} ${borderTopRightRadius}${unit} ${borderBottomRightRadius}${unit}`;
  }

  return `${borderTopLeftRadius}${unit} ${borderTopRightRadius}${unit} ${borderBottomRightRadius}${unit} ${borderBottomLeftRadius}${unit}`;
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  CornerBottomLeftIcon,
  CornerBottomRightIcon,
  CornerTopLeftIcon,
  CornerTopRightIcon,
  SquareDashedIcon,
  SquareIcon,
} from '../../icons';
import { Label, ToggleGroup, Tooltip } from '../primitives';
import PropRow from './prop-row.vue';

export interface BorderRadiusPickerProps {
  value: string | number;
  /** Also as `@change`. */
  onChange: (values: string) => void;
  unit?: 'px' | '%';
}

defineOptions({ name: 'BorderRadiusPicker' });

const { value, onChange, unit = 'px' } = defineProps<BorderRadiusPickerProps>();

const expandedValues = computed(() => expandShorthand(value));

const initialValues = expandShorthand(value);
const allEqual = Object.values(initialValues).every(
  (v) => v === initialValues.borderTopLeftRadius,
);

const expanded = ref(!allEqual);

const handleModeChange = (mode: string) => {
  if (mode === 'uniform' && expanded.value) {
    const uniform =
      expandedValues.value.borderTopLeftRadius ??
      expandedValues.value.borderTopRightRadius ??
      expandedValues.value.borderBottomRightRadius ??
      expandedValues.value.borderBottomLeftRadius ??
      0;
    onChange(`${uniform}${unit}`);
    expanded.value = false;
  } else if (mode === 'individual' && !expanded.value) {
    expanded.value = true;
  }
};

const changeCorner = (corner: keyof ExpandedRadius, v: number) => {
  onChange(
    collapseToShorthand({ ...expandedValues.value, [corner]: v, unit }),
  );
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
        h(Tooltip.Content, null, () => 'Per corner'),
      ]),
    ],
  );
</script>

<template>
  <div v-if="expanded" class="flex flex-col gap-2">
    <PropRow>
      <Label>Rounded</Label>
      <ModeToggle />
    </PropRow>

    <div class="flex flex-col items-center gap-1.5">
      <div class="flex items-center gap-1.5">
        <RadiusInput
          :value="expandedValues.borderTopLeftRadius"
          :on-change="(v: number) => changeCorner('borderTopLeftRadius', v)"
          :unit="unit"
        >
          <template #icon><CornerTopLeftIcon :size="14" /></template>
        </RadiusInput>
        <RadiusInput
          :value="expandedValues.borderTopRightRadius"
          :on-change="(v: number) => changeCorner('borderTopRightRadius', v)"
          :unit="unit"
        >
          <template #icon><CornerTopRightIcon :size="14" /></template>
        </RadiusInput>
      </div>
      <div class="flex items-center gap-1.5">
        <RadiusInput
          :value="expandedValues.borderBottomLeftRadius"
          :on-change="(v: number) => changeCorner('borderBottomLeftRadius', v)"
          :unit="unit"
        >
          <template #icon><CornerBottomLeftIcon :size="14" /></template>
        </RadiusInput>
        <RadiusInput
          :value="expandedValues.borderBottomRightRadius"
          :on-change="(v: number) => changeCorner('borderBottomRightRadius', v)"
          :unit="unit"
        >
          <template #icon><CornerBottomRightIcon :size="14" /></template>
        </RadiusInput>
      </div>
    </div>
  </div>

  <PropRow v-else>
    <Label>Rounded</Label>
    <div class="flex items-center gap-1">
      <RadiusInput
        :value="expandedValues.borderTopLeftRadius"
        :on-change="(v: number) => onChange(`${v}${unit}`)"
        :unit="unit"
      />
      <ModeToggle />
    </div>
  </PropRow>
</template>
