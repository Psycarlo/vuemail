<script setup lang="ts">
import { computed } from 'vue';
import NumberInput from '../components/number-input.vue';
import PropRow from '../components/prop-row.vue';
import Section from '../components/section.vue';
import {
  EXCLUDED_ATTRIBUTES,
  LIVEBLOCKS_INTERNAL_PROPS,
  LOCAL_PROPS_SCHEMA,
} from '../config/attribute-schema';
import type { InspectorNodeContext } from '../node.vue';
import { Label, Select, Textarea, TextField } from '../primitives';

type InspectorAttributesProps = InspectorNodeContext;
type AttributeConfig = (typeof LOCAL_PROPS_SCHEMA)[string];

defineOptions({ name: 'AttributesSection', inheritAttrs: false });

const props = defineProps<InspectorAttributesProps>();

function getVisibleAttributes(
  _nodeType: string,
  getAttr: (name: string) => unknown,
) {
  const results: Array<{
    name: string;
    config: AttributeConfig;
    value: unknown;
  }> = [];

  for (const [name, config] of Object.entries(LOCAL_PROPS_SCHEMA)) {
    if (EXCLUDED_ATTRIBUTES.includes(name)) continue;
    if (LIVEBLOCKS_INTERNAL_PROPS.includes(name)) continue;

    const value = getAttr(name);
    if (value !== undefined && value !== null) {
      results.push({ name, config, value });
    }
  }

  return results;
}

const nodeAttrs = computed(() =>
  getVisibleAttributes(props.nodeType, props.getAttr),
);

const getSelectOptions = (options: Record<string, string | boolean>) =>
  Object.entries(options).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string',
  );

const handleSelectChange = (
  name: string,
  config: AttributeConfig,
  event: Event,
) => {
  const newValue = (event.target as HTMLSelectElement).value;
  props.setAttr(name, newValue);
  config.customUpdate?.({ newValue });
};

const handleInput = (name: string, event: Event) => {
  props.setAttr(name, (event.target as HTMLInputElement).value);
};
</script>

<template>
  <Section v-if="nodeAttrs.length > 0" title="Attributes">
    <PropRow v-for="{ name, config, value } in nodeAttrs" :key="name">
      <Label>{{ config.label }}</Label>
      <Select.Root
        v-if="config.type === 'select' && config.options"
        :value="String(value ?? config.defaultValue)"
        @change="handleSelectChange(name, config, $event)"
      >
        <Select.Item
          v-for="[val, label] in getSelectOptions(config.options)"
          :key="val"
          :value="val"
        >
          {{ label }}
        </Select.Item>
      </Select.Root>
      <NumberInput
        v-else-if="config.type === 'number'"
        :value="(value ?? config.defaultValue) as string | number"
        :on-change="(v: number | '') => setAttr(name, v)"
        :unit="config.unit"
        :min="0"
      />
      <Textarea
        v-else-if="config.type === 'textarea'"
        :value="String(value ?? config.defaultValue)"
        @input="handleInput(name, $event)"
      />
      <TextField
        v-else
        type="text"
        :value="String(value ?? config.defaultValue)"
        @input="handleInput(name, $event)"
      />
    </PropRow>
  </Section>
</template>
