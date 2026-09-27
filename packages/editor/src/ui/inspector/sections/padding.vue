<script setup lang="ts">
import { computed } from 'vue';
import PaddingPicker from '../components/padding-picker.vue';
import Section from '../components/section.vue';
import type { InspectorNodeContext } from '../node.vue';

type InspectorPaddingProps = InspectorNodeContext;
type PaddingProp =
  | 'paddingTop'
  | 'paddingRight'
  | 'paddingBottom'
  | 'paddingLeft';

defineOptions({ name: 'PaddingSection', inheritAttrs: false });

const props = defineProps<InspectorPaddingProps>();

const value = computed(() => ({
  paddingTop: Number(props.getStyle('paddingTop')) || 0,
  paddingRight: Number(props.getStyle('paddingRight')) || 0,
  paddingBottom: Number(props.getStyle('paddingBottom')) || 0,
  paddingLeft: Number(props.getStyle('paddingLeft')) || 0,
}));

const handleChange = (values: Partial<Record<PaddingProp, number>>) => {
  const changes = Object.entries(values).map(([prop, val]) => ({
    prop: prop as PaddingProp,
    value: val as number,
  }));
  props.batchSetStyle(changes);
};
</script>

<template>
  <Section title="Spacing">
    <PaddingPicker :value="value" :on-change="handleChange" />
  </Section>
</template>
