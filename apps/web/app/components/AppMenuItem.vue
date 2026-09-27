<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ href: string }>();
const emit = defineEmits<{ click: [] }>();

const route = useRoute();

const isActive = computed(() => {
  const normalizedPathname = route.path.replace(/\/$/, '');
  const normalizedHref = props.href.replace(/\/$/, '');
  const sectionHref = normalizedHref.startsWith('/')
    ? `/${normalizedHref.split('/')[1] ?? ''}`
    : normalizedHref;
  return (
    normalizedPathname === sectionHref ||
    normalizedPathname.startsWith(`${sectionHref}/`)
  );
});
</script>

<template>
  <TabButton
    as-child
    :data-active="isActive"
    tabindex="0"
    @click="emit('click')"
  >
    <SmartLink :href="href"><slot /></SmartLink>
  </TabButton>
</template>
