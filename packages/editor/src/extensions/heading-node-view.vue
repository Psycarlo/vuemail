<script setup lang="ts">
import type { DecorationWithType } from '@tiptap/core';
import { NodeViewContent, NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3';
import { computed } from 'vue';
import { Heading as EmailHeading, type HeadingAs } from 'vuemail';
import { inlineCssToJs } from '../utils/styles';

const props = defineProps(nodeViewProps);

const getPlaceholder = (decorations: readonly DecorationWithType[]) =>
  decorations
    .map(
      (decoration) =>
        (decoration.type as { attrs?: Record<string, string> }).attrs?.[
          'data-placeholder'
        ],
    )
    .find(Boolean);

const level = computed(() => (props.node.attrs.level as number) ?? 1);

const as = computed(() => `h${level.value}` as HeadingAs);

const attrs = computed(() => {
  const { class: className, ...rest } = props.node.attrs;

  return {
    ...rest,
    class: `node-h${level.value} ${className}`,
    style: inlineCssToJs(props.node.attrs.style),
    'data-placeholder': getPlaceholder(props.decorations),
  };
});

// `node-heading` is the class React's node views put on their wrapper, which
// the theme's placeholder styles rely on. (A comment in the template would
// render a fragment around the wrapper.)
</script>

<template>
  <NodeViewWrapper class="node-heading">
    <EmailHeading :as="as" v-bind="attrs">
      <NodeViewContent />
    </EmailHeading>
  </NodeViewWrapper>
</template>
