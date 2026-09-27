<script setup lang="ts">
import { ref } from 'vue';
import { MinusIcon, PlusIcon } from '../../icons';
import { IconButton, Text, Tooltip } from '../primitives';

interface SectionProps {
  title?: string;
  onAdd?: () => void;
  onRemove?: () => void;
}

defineOptions({ name: 'InspectorSection' });

const { title, onAdd, onRemove } = defineProps<SectionProps>();

const collapsed = ref(false);
</script>

<template>
  <div data-re-inspector-section="" :data-has-title="title ? '' : undefined">
    <div v-if="title" data-re-inspector-section-header="">
      <button
        type="button"
        data-re-inspector-section-toggle=""
        @click="collapsed = !collapsed"
      >
        <Text>{{ title }}</Text>
      </button>
      <Tooltip.Root v-if="collapsed && onAdd">
        <Tooltip.Trigger>
          <IconButton :aria-label="`Add ${title}`" @click="onAdd">
            <PlusIcon :size="16" />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content>{{ `Add ${title}` }}</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root v-if="!collapsed && onRemove">
        <Tooltip.Trigger>
          <IconButton :aria-label="`Remove ${title}`" @click="onRemove">
            <MinusIcon :size="16" />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content>{{ `Remove ${title}` }}</Tooltip.Content>
      </Tooltip.Root>
    </div>
    <div v-if="!collapsed && $slots.default" data-re-inspector-section-body="">
      <slot />
    </div>
  </div>
</template>
