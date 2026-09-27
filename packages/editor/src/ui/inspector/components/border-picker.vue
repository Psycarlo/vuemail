<script lang="ts">
import {
  type Component,
  defineComponent,
  h,
  type PropType,
  type SlotsType,
  type VNode,
} from 'vue';
import { SUPPORTED_CSS_PROPERTIES } from '../../../plugins/email-theming/themes';
import {
  PanelBottomIcon,
  PanelLeftIcon,
  PanelRightIcon,
  PanelTopIcon,
} from '../../icons';
import { useDragToChange } from '../hooks/use-drag-to-change';
import { useNumericInput } from '../hooks/use-numeric-input';
import { TextField } from '../primitives';

export type BatchableChangeFn = (
  propOrChanges: string | [string, string | number][],
  value?: string | number,
) => void;

type Side = 'Top' | 'Right' | 'Bottom' | 'Left';

const SIDES: { side: Side; icon: Component }[] = [
  { side: 'Top', icon: PanelTopIcon },
  { side: 'Right', icon: PanelRightIcon },
  { side: 'Bottom', icon: PanelBottomIcon },
  { side: 'Left', icon: PanelLeftIcon },
];

function getSideValue(
  styleObject: Record<string, string | number | undefined>,
  side: Side,
  prop: 'Width' | 'Color' | 'Style',
): string | number | undefined {
  const sideKey = `border${side}${prop}`;
  const shorthandKey = `border${prop}`;
  return styleObject[sideKey] ?? styleObject[shorthandKey];
}

function allSidesEqual(
  styleObject: Record<string, string | number | undefined>,
): boolean {
  const topWidth = getSideValue(styleObject, 'Top', 'Width');
  const topColor = getSideValue(styleObject, 'Top', 'Color');
  const topStyle = getSideValue(styleObject, 'Top', 'Style');

  return SIDES.every(({ side }) => {
    return (
      getSideValue(styleObject, side, 'Width') === topWidth &&
      getSideValue(styleObject, side, 'Color') === topColor &&
      getSideValue(styleObject, side, 'Style') === topStyle
    );
  });
}

const BORDER_STYLE_OPTIONS = SUPPORTED_CSS_PROPERTIES.borderStyle
  .options as Record<string, string>;

const BorderWidthInput = defineComponent({
  name: 'BorderWidthInput',
  props: {
    value: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined,
    },
    onChange: {
      type: Function as PropType<(value: number | '') => void>,
      required: true,
    },
  },
  slots: Object as SlotsType<{ icon?: () => VNode[] }>,
  setup(props, { slots }) {
    const { displayValue, ...handlers } = useNumericInput({
      value: () => props.value,
      onCommit: (value) => props.onChange(value),
      allowEmpty: true,
      min: 0,
    });

    const { dragProps } = useDragToChange({
      value: () => props.value,
      onCommit: (value) => props.onChange(value),
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
          placeholder: String(
            SUPPORTED_CSS_PROPERTIES.borderWidth.defaultValue,
          ),
          ...handlers,
        }),
        h('span', { 'data-re-inspector-unit': '', ...dragProps }, 'px'),
      ]);
  },
});
</script>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { SquareDashedIcon, SquareIcon, XIcon } from '../../icons';
import {
  ColorInput,
  IconButton,
  Label,
  Select,
  ToggleGroup,
  Tooltip,
} from '../primitives';
import PropRow from './prop-row.vue';

export interface BorderPickerProps {
  styleObject: Record<string, string | number | undefined>;
  /** Also as `@change`. */
  onChange: BatchableChangeFn;
}

defineOptions({ name: 'BorderPicker' });

const { styleObject, onChange } = defineProps<BorderPickerProps>();

const expanded = ref(!allSidesEqual(styleObject));

const handleModeChange = (mode: string) => {
  if (mode === 'uniform' && expanded.value) {
    const width =
      getSideValue(styleObject, 'Top', 'Width') ??
      String(SUPPORTED_CSS_PROPERTIES.borderWidth.defaultValue);
    const color =
      getSideValue(styleObject, 'Top', 'Color') ??
      String(SUPPORTED_CSS_PROPERTIES.borderColor.defaultValue);
    const style =
      getSideValue(styleObject, 'Top', 'Style') ??
      String(SUPPORTED_CSS_PROPERTIES.borderStyle.defaultValue);

    const changes: [string, string | number][] = [
      ['borderWidth', width],
      ['borderColor', color],
      ['borderStyle', style],
    ];
    for (const { side } of SIDES) {
      changes.push(
        [`border${side}Width`, ''],
        [`border${side}Color`, ''],
        [`border${side}Style`, ''],
      );
    }

    onChange(changes);
    expanded.value = false;
  } else if (mode === 'individual' && !expanded.value) {
    const width =
      styleObject.borderWidth ??
      String(SUPPORTED_CSS_PROPERTIES.borderWidth.defaultValue);
    const color =
      styleObject.borderColor ??
      String(SUPPORTED_CSS_PROPERTIES.borderColor.defaultValue);
    const style =
      styleObject.borderStyle ??
      String(SUPPORTED_CSS_PROPERTIES.borderStyle.defaultValue);

    const changes: [string, string | number][] = [];
    for (const { side } of SIDES) {
      changes.push(
        [`border${side}Width`, styleObject[`border${side}Width`] ?? width],
        [`border${side}Color`, styleObject[`border${side}Color`] ?? color],
        [`border${side}Style`, styleObject[`border${side}Style`] ?? style],
      );
    }
    changes.push(
      ['borderWidth', ''],
      ['borderColor', ''],
      ['borderStyle', ''],
    );

    onChange(changes);
    expanded.value = true;
  }
};

const uniformColor = computed(() =>
  String(
    styleObject.borderColor ??
      SUPPORTED_CSS_PROPERTIES.borderColor.defaultValue,
  ),
);

const clearSide = (side: Side) => {
  onChange([
    [`border${side}Width`, ''],
    [`border${side}Style`, ''],
    [`border${side}Color`, ''],
  ]);
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
      <Label>Border</Label>
      <ModeToggle />
    </PropRow>

    <div class="flex flex-col gap-1.5">
      <div
        v-for="{ side, icon } in SIDES"
        :key="side"
        class="flex flex-col items-center gap-1"
      >
        <div class="flex gap-1 w-full">
          <BorderWidthInput
            :value="getSideValue(styleObject, side, 'Width')"
            :on-change="(v: number | '') => onChange(`border${side}Width`, v)"
            class="w-full"
          >
            <template #icon><component :is="icon" :size="14" /></template>
          </BorderWidthInput>

          <ColorInput
            :value="
              String(
                getSideValue(styleObject, side, 'Color') ??
                  SUPPORTED_CSS_PROPERTIES.borderColor.defaultValue,
              )
            "
            :on-change="(v: string) => onChange(`border${side}Color`, v)"
            class="w-full"
          />
        </div>

        <div class="flex gap-1 w-full">
          <Select.Root
            class="w-full"
            :value="
              String(
                getSideValue(styleObject, side, 'Style') ??
                  SUPPORTED_CSS_PROPERTIES.borderStyle.defaultValue,
              )
            "
            @change="
              onChange(
                `border${side}Style`,
                ($event.target as HTMLSelectElement).value,
              )
            "
          >
            <Select.Item
              v-for="[val, label] in Object.entries(BORDER_STYLE_OPTIONS)"
              :key="val"
              :value="val"
            >
              {{ label }}
            </Select.Item>
          </Select.Root>

          <IconButton
            :aria-label="`Clear ${side.toLowerCase()} border`"
            @click="clearSide(side)"
          >
            <XIcon :size="14" />
          </IconButton>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex flex-col gap-3 w-full">
    <PropRow>
      <Label>Border</Label>
      <div class="flex items-center gap-1">
        <BorderWidthInput
          :value="styleObject.borderWidth ?? ''"
          :on-change="(v: number | '') => onChange('borderWidth', v)"
        />
        <ModeToggle />
      </div>
    </PropRow>

    <PropRow>
      <Label>Border color</Label>
      <ColorInput
        :value="uniformColor"
        :on-change="(v: string) => onChange('borderColor', v)"
      />
    </PropRow>
  </div>
</template>
