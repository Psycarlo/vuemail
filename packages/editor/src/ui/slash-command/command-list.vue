<script lang="ts">
import {
  type Component,
  cloneVNode,
  type FunctionalComponent,
  h,
  isVNode,
  type VNodeChild,
} from 'vue';
import type { SlashCommandItem, SlashCommandRenderProps } from './types';

const CATEGORY_ORDER = ['Text', 'Media', 'Layout', 'Utility'];

function groupByCategory(
  items: SlashCommandItem[],
): { category: string; items: SlashCommandItem[] }[] {
  const seen = new Map<string, SlashCommandItem[]>();

  for (const item of items) {
    const existing = seen.get(item.category);
    if (existing) {
      existing.push(item);
    } else {
      seen.set(item.category, [item]);
    }
  }

  const ordered: { category: string; items: SlashCommandItem[] }[] = [];
  for (const cat of CATEGORY_ORDER) {
    const group = seen.get(cat);
    if (group) {
      ordered.push({ category: cat, items: group });
      seen.delete(cat);
    }
  }
  for (const [category, group] of seen) {
    ordered.push({ category, items: group });
  }

  return ordered;
}

function isComponent(icon: SlashCommandItem['icon']): icon is Component {
  return (
    typeof icon === 'function' ||
    (typeof icon === 'object' &&
      icon !== null &&
      !Array.isArray(icon) &&
      !isVNode(icon))
  );
}

/** Renders an item's icon, which is an element or a component. */
const ItemIcon: FunctionalComponent<{ icon: SlashCommandItem['icon'] }> = ({
  icon,
}) => {
  if (isComponent(icon)) {
    return h(icon);
  }
  return isVNode(icon) ? cloneVNode(icon) : (icon as VNodeChild);
};
</script>

<script setup lang="ts">
import { computed, useTemplateRef, watch } from 'vue';
import { updateScrollView } from './utils';

defineOptions({ name: 'CommandList' });

const props = defineProps<SlashCommandRenderProps>();

const containerRef = useTemplateRef<HTMLDivElement>('container');

watch(
  () => props.selectedIndex,
  () => {
    const container = containerRef.value;
    if (!container) return;
    const selected = container.querySelector<HTMLElement>('[data-selected]');
    if (selected) {
      updateScrollView(container, selected);
    }
  },
  { flush: 'post', immediate: true },
);

const isFiltering = computed(() => props.query.trim().length > 0);

const groups = computed(() => {
  let flatIndex = 0;
  return groupByCategory(props.items).map((group) => ({
    category: group.category,
    items: group.items.map((item) => ({ item, index: flatIndex++ })),
  }));
});
</script>

<template>
  <div v-if="items.length === 0" data-re-slash-command="">
    <div data-re-slash-command-empty="">No results</div>
  </div>

  <div v-else-if="isFiltering" data-re-slash-command="">
    <div ref="container" data-re-slash-command-scroll="">
      <button
        v-for="(item, index) in items"
        :key="item.title"
        data-re-slash-command-item=""
        :data-selected="index === selectedIndex || undefined"
        type="button"
        @click="onSelect(index)"
      >
        <ItemIcon :icon="item.icon" />
        <span>{{ item.title }}</span>
      </button>
    </div>
  </div>

  <div v-else data-re-slash-command="">
    <div ref="container" data-re-slash-command-scroll="">
      <div v-for="group in groups" :key="group.category">
        <div data-re-slash-command-category="">{{ group.category }}</div>
        <button
          v-for="{ item, index } in group.items"
          :key="item.title"
          data-re-slash-command-item=""
          :data-selected="index === selectedIndex || undefined"
          type="button"
          @click="onSelect(index)"
        >
          <ItemIcon :icon="item.icon" />
          <span>{{ item.title }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
