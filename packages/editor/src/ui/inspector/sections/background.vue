<script setup lang="ts">
import { computed } from 'vue';
import PropRow from '../components/prop-row.vue';
import Section from '../components/section.vue';
import type { InspectorNodeContext } from '../node.vue';
import { ColorInput, Label } from '../primitives';

type InspectorBackgroundProps = InspectorNodeContext;

defineOptions({ name: 'BackgroundSection', inheritAttrs: false });

const props = defineProps<InspectorBackgroundProps>();

const value = computed(() => String(props.getStyle('backgroundColor') ?? ''));
</script>

<template>
  <Section title="Background">
    <PropRow>
      <Label>Color</Label>
      <ColorInput
        :value="value"
        :on-change="(v: string) => setStyle('backgroundColor', v)"
      />
    </PropRow>
  </Section>
</template>
