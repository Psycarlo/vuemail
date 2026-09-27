<script setup lang="ts">
import { computed } from 'vue';
import NumberInput from '../components/number-input.vue';
import PropRow from '../components/prop-row.vue';
import Section from '../components/section.vue';
import type { InspectorNodeContext } from '../node.vue';
import { Label } from '../primitives';

const SIZE_AS_ATTRIBUTES = ['image'];

type InspectorSizeProps = InspectorNodeContext;

defineOptions({ name: 'SizeSection', inheritAttrs: false });

const props = defineProps<InspectorSizeProps>();

const useAttrs = computed(() => SIZE_AS_ATTRIBUTES.includes(props.nodeType));

const width = computed(() =>
  useAttrs.value
    ? ((props.getAttr('width') as string | number) ?? '')
    : (props.getStyle('width') ?? ''),
);
const height = computed(() =>
  useAttrs.value
    ? ((props.getAttr('height') as string | number) ?? '')
    : (props.getStyle('height') ?? ''),
);

const setWidth = (v: number | '') => {
  if (useAttrs.value) {
    props.setAttr('width', v === '' ? '' : v);
  } else {
    props.setStyle('width', v);
  }
};

const setHeight = (v: number | '') => {
  if (useAttrs.value) {
    props.setAttr('height', v === '' ? '' : v);
  } else {
    props.setStyle('height', v);
  }
};
</script>

<template>
  <Section title="Size">
    <PropRow>
      <Label>Width</Label>
      <NumberInput
        :value="width"
        :on-change="setWidth"
        unit="px"
        placeholder="auto"
        :min="0"
      />
    </PropRow>
    <PropRow>
      <Label>Height</Label>
      <NumberInput
        :value="height"
        :on-change="setHeight"
        unit="px"
        placeholder="auto"
        :min="0"
      />
    </PropRow>
  </Section>
</template>
