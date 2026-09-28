<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  line: number;
  column?: number;
  /**
   * The code the line is of: the source of the email, which the Vue tab of
   * the code view shows, or the pretty markup, which the HTML tab shows.
   */
  type: 'source' | 'html';
}>();

const route = useRoute();

const to = computed(() => ({
  path: route.path,
  query: {
    ...route.query,
    view: 'source',
    lang: props.type === 'html' ? 'html' : 'vue',
  },
  hash: `#L${props.line}`,
}));
</script>

<template>
  <RouterLink :to="to" class="appearance-none underline mx-2">L{{ line.toString().padStart(2, '0') }}</RouterLink>
</template>
