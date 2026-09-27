<script setup lang="ts">
import { computed } from 'vue';
import { useCurrentEditor } from '../../email-editor/use-current-editor';
import { getNodeMeta } from './config/node-meta';
import { type FocusedNode, useInspector } from './root';

export interface InspectorBreadcrumbSegment {
  node: FocusedNode;
  focus: () => void;
}

export interface InspectorBreadcrumbSlots {
  /** Replaces the default breadcrumb, receiving its segments. */
  default?: (props: { segments: InspectorBreadcrumbSegment[] }) => unknown;
}

defineOptions({ name: 'InspectorBreadcrumb' });

defineSlots<InspectorBreadcrumbSlots>();

const { editor } = useCurrentEditor();
const { pathFromRoot } = useInspector();

const segments = computed<InspectorBreadcrumbSegment[]>(() => {
  const currentEditor = editor.value;
  if (!currentEditor || pathFromRoot.value.length === 0) {
    return [];
  }
  return pathFromRoot.value.map((focusedNode) => ({
    node: focusedNode,
    focus() {
      if (focusedNode.nodeType === 'body') {
        // Body is a logical root, not always a concrete ProseMirror node —
        // blur to surface the document-level inspector rather than risk
        // selecting whatever is at pos 0.
        if (typeof document !== 'undefined') {
          const active = document.activeElement;
          if (active instanceof HTMLElement) {
            active.blur();
          }
        }
        currentEditor.commands.blur();
        return;
      }
      currentEditor.commands.setNodeSelection(focusedNode.nodePos.pos);
      currentEditor.commands.focus();
    },
  }));
});

const MAX_VISIBLE = 3;

function getVisibleSegments(list: InspectorBreadcrumbSegment[]) {
  if (list.length <= MAX_VISIBLE) {
    return {
      items: list.map((s, i) => ({ segment: s, index: i })),
      hasEllipsis: false,
    };
  }

  const first = { segment: list[0], index: 0 };
  const last = list.slice(-2).map((s, i) => ({
    segment: s,
    index: list.length - 2 + i,
  }));

  return { items: [first, ...last], hasEllipsis: true };
}

const visibleSegments = computed(() => getVisibleSegments(segments.value));
</script>

<template>
  <slot v-if="$slots.default" :segments="segments" />
  <nav v-else data-re-inspector-breadcrumb="">
    <ol data-re-inspector-breadcrumb-list="">
      <li
        v-for="({ segment, index }, i) in visibleSegments.items"
        :key="index"
        data-re-inspector-breadcrumb-item=""
      >
        <span v-if="i !== 0" data-re-inspector-breadcrumb-separator="">/</span>
        <template v-if="i === 1 && visibleSegments.hasEllipsis">
          <span data-re-inspector-breadcrumb-ellipsis="">&hellip;</span>
          <span data-re-inspector-breadcrumb-separator="">/</span>
        </template>
        <button
          type="button"
          data-re-inspector-breadcrumb-button=""
          :data-clickable="index !== segments.length - 1 ? '' : undefined"
          @click="segment.focus()"
        >
          {{ getNodeMeta(segment.node.nodeType).label }}
        </button>
      </li>
    </ol>
  </nav>
</template>
