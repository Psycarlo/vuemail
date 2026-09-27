<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue';

export interface BubbleMenuItemProps
  extends /* @vue-ignore */ ButtonHTMLAttributes {
  /** Used for aria-label and data-item attribute */
  name: string;
  /** Whether this item is currently active */
  isActive: boolean;
  /** Called when clicked, also as `@command` */
  onCommand: () => void;
}

defineOptions({ name: 'BubbleMenuItem' });

const { name, isActive, onCommand } = defineProps<BubbleMenuItemProps>();
</script>

<template>
  <button
    type="button"
    :aria-label="name"
    :aria-pressed="isActive"
    data-re-bubble-menu-item=""
    :data-item="name"
    :data-active="isActive ? '' : undefined"
    @mousedown.prevent
    @click="onCommand()"
  >
    <slot />
  </button>
</template>
