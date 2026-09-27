<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3';
import { computed } from 'vue';
import { Hr } from 'vuemail';
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
</script>

<template>
  <!-- `node-horizontalRule` is the class React's node views put on their wrapper -->
  <NodeViewWrapper class="node-horizontalRule">
    <Hr v-bind="attrs" />
  </NodeViewWrapper>
</template>
