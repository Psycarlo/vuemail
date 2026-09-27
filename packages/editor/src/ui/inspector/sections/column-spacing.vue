<script setup lang="ts">
import { computed } from 'vue';
import NumberInput from '../components/number-input.vue';
import PropRow from '../components/prop-row.vue';
import Section from '../components/section.vue';
import type { InspectorNodeContext } from '../node.vue';
import { Label } from '../primitives';

const COLUMN_PARENT_TYPES = new Set([
  'twoColumns',
  'threeColumns',
  'fourColumns',
]);

type InspectorColumnSpacingProps = InspectorNodeContext;

defineOptions({ name: 'ColumnSpacingSection', inheritAttrs: false });

const props = defineProps<InspectorColumnSpacingProps>();

const cellspacing = computed(() => {
  const rawCellspacing = props.getAttr('cellspacing');
  return rawCellspacing === undefined ||
    rawCellspacing === null ||
    rawCellspacing === ''
    ? 0
    : (rawCellspacing as string | number);
});

const setCellspacing = (value: number | '') => {
  props.setAttr('cellspacing', value === '' ? 0 : value);
};
</script>

<template>
  <Section v-if="COLUMN_PARENT_TYPES.has(nodeType)" title="Column spacing">
    <PropRow>
      <Label>Cell spacing</Label>
      <NumberInput
        :value="cellspacing"
        :on-change="setCellspacing"
        unit="px"
        placeholder="0"
        :min="0"
      />
    </PropRow>
  </Section>
</template>
