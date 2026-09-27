<script setup lang="ts">
const { isActive = false } = defineProps<{
  label: string;
  isActive?: boolean;
}>();

const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    :aria-pressed="isActive"
    :class="[
      'inline-flex items-center justify-center rounded p-1.5 text-gray-400 focus-visible:outline-none transition-colors',
      isActive
        ? 'bg-black/5 text-gray-900'
        : 'hover:bg-black/5 hover:text-gray-700',
    ]"
    @mousedown.prevent
    @click="emit('click')"
  >
    <slot />
  </button>
</template>
