<script setup lang="ts">
import PropRow from '../components/prop-row.vue';
import Section from '../components/section.vue';
import { ColorInput, Label, TextField } from '../primitives';

// Pick<InspectorTextContext, 'linkHref' | 'linkColor' | 'setLinkColor' | 'isLinkActive' | 'presetColors'>
export interface InspectorLinkProps {
  linkHref: string;
  linkColor: string;
  setLinkColor: (color: string) => void;
  isLinkActive: boolean;
  presetColors: string[];
}

defineOptions({ name: 'LinkSection', inheritAttrs: false });

defineProps<InspectorLinkProps>();
</script>

<template>
  <Section v-if="isLinkActive" title="Link">
    <PropRow>
      <Label>URL</Label>
      <TextField type="text" :value="linkHref" readonly />
    </PropRow>
    <PropRow>
      <Label>Color</Label>
      <ColorInput :value="linkColor" :on-change="setLinkColor" />
    </PropRow>
  </Section>
</template>
