<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3';
import { Hr } from '@vuemaildev/vuemail';
import { computed } from 'vue';
import { inlineCssToJs } from '../utils/styles';

const props = defineProps(nodeViewProps);

const attrs = computed(() => {
  const { class: _className, ...rest } = props.node.attrs;

  return {
    ...rest,
    class: 'node-hr',
    style: inlineCssToJs(props.node.attrs.style),
  };
});

// `node-horizontalRule` is the class React's node views put on their wrapper.
// (A comment in the template would render a fragment around the wrapper.)
</script>

<template>
  <NodeViewWrapper class="node-horizontalRule">
    <Hr v-bind="attrs" />
  </NodeViewWrapper>
</template>
