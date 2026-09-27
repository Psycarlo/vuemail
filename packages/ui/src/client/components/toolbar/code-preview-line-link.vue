<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  /** A line of the pretty markup, which the HTML tab of the code view shows. */
  line: number;
}>();

const route = useRoute();

const to = computed(() => ({
  path: route.path,
  query: { ...route.query, view: 'source', lang: 'html' },
  hash: `#L${props.line}`,
}));
</script>

<template>
  <RouterLink :to="to" class="appearance-none underline mx-2">L{{ line.toString().padStart(2, '0') }}</RouterLink>
</template>
