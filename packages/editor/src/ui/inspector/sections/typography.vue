<script setup lang="ts">
import { computed } from 'vue';
import type { KnownCssProperties } from '../../../plugins/email-theming/types';
import NumberInput from '../components/number-input.vue';
import PropRow from '../components/prop-row.vue';
import Section from '../components/section.vue';
import { ALIGNMENT_ITEMS, FORMAT_ITEMS } from '../config/text-config';
import {
  ColorInput,
  IconButton,
  Label,
  ToggleGroup,
  Tooltip,
} from '../primitives';

// Pick<InspectorNodeContext | InspectorTextContext, 'getStyle' | 'setStyle' | 'presetColors'>
// & Partial<Pick<InspectorTextContext, 'marks' | 'toggleMark' | 'alignment' | 'setAlignment'>>
export interface TypographyContext {
  getStyle: (prop: KnownCssProperties) => string | number | undefined;
  setStyle: (prop: KnownCssProperties, value: string | number) => void;
  presetColors: string[];
  marks?: Record<string, boolean>;
  toggleMark?: (mark: string) => void;
  alignment?: string;
  setAlignment?: (value: string) => void;
}

defineOptions({ name: 'TypographySection', inheritAttrs: false });

const props = defineProps<TypographyContext>();

const color = computed(() => String(props.getStyle('color') ?? ''));
const fontSize = computed(() => props.getStyle('fontSize') ?? '');
const lineHeight = computed(() => props.getStyle('lineHeight') ?? '');

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);
</script>

<template>
  <Section title="Typography">
    <PropRow>
      <Label>Color</Label>
      <ColorInput
        :value="color"
        :on-change="(v: string) => setStyle('color', v)"
      />
    </PropRow>

    <PropRow>
      <Label>Size</Label>
      <NumberInput
        :value="fontSize"
        :on-change="(v: number | '') => setStyle('fontSize', v)"
        unit="px"
        :min="1"
      />
    </PropRow>

    <PropRow>
      <Label>Line height</Label>
      <NumberInput
        :value="lineHeight"
        :on-change="(v: number | '') => setStyle('lineHeight', v)"
        unit="%"
      />
    </PropRow>

    <PropRow v-if="marks && toggleMark">
      <Label>Format</Label>
      <div class="flex items-center gap-0.5">
        <Tooltip.Root v-for="item in FORMAT_ITEMS" :key="item.value">
          <Tooltip.Trigger>
            <IconButton
              :aria-pressed="marks[item.value] ?? false"
              :aria-label="item.label"
              @click="toggleMark(item.value)"
            >
              <component :is="item.icon" :size="16" />
            </IconButton>
          </Tooltip.Trigger>
          <Tooltip.Content>{{ item.label }}</Tooltip.Content>
        </Tooltip.Root>
      </div>
    </PropRow>

    <PropRow v-if="alignment && setAlignment">
      <Label>Align</Label>
      <ToggleGroup.Root :value="alignment" :on-value-change="setAlignment">
        <Tooltip.Root v-for="item in ALIGNMENT_ITEMS" :key="item.value">
          <Tooltip.Trigger>
            <ToggleGroup.Item :value="item.value">
              <component :is="item.icon" :size="16" />
            </ToggleGroup.Item>
          </Tooltip.Trigger>
          <Tooltip.Content>{{ capitalize(item.value) }}</Tooltip.Content>
        </Tooltip.Root>
      </ToggleGroup.Root>
    </PropRow>
  </Section>
</template>
