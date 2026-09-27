<script setup lang="ts">
import { computed } from 'vue';
import BorderPicker from '../components/border-picker.vue';
import BorderRadiusPicker from '../components/border-radius-picker.vue';
import Section from '../components/section.vue';
import type { InspectorNodeContext } from '../node.vue';

type InspectorBorderProps = InspectorNodeContext;

defineOptions({ name: 'BorderSection', inheritAttrs: false });

const props = defineProps<InspectorBorderProps>();

const BORDER_PROPS = [
  'borderWidth',
  'borderColor',
  'borderStyle',
  'borderTopWidth',
  'borderTopColor',
  'borderTopStyle',
  'borderRightWidth',
  'borderRightColor',
  'borderRightStyle',
  'borderBottomWidth',
  'borderBottomColor',
  'borderBottomStyle',
  'borderLeftWidth',
  'borderLeftColor',
  'borderLeftStyle',
  'borderRadius',
] as const;

type BorderProp = (typeof BORDER_PROPS)[number];

const styleObject = computed(() => {
  const result: Record<string, string | number | undefined> = {};
  for (const prop of BORDER_PROPS) {
    result[prop] = props.getStyle(prop);
  }
  return result;
});

const handleChange = (
  propOrChanges: string | [string, string | number][],
  value?: string | number,
) => {
  if (Array.isArray(propOrChanges)) {
    props.batchSetStyle(
      propOrChanges.map(([p, v]) => ({
        prop: p as BorderProp,
        value: v,
      })),
    );
  } else {
    props.setStyle(propOrChanges as BorderProp, value!);
  }
};
</script>

<template>
  <Section title="Border">
    <BorderPicker :style-object="styleObject" :on-change="handleChange" />
    <BorderRadiusPicker
      :value="getStyle('borderRadius') ?? 0"
      :on-change="(v: string) => setStyle('borderRadius', v)"
    />
  </Section>
</template>
