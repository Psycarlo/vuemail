<script setup lang="ts">
import type { AnchorHTMLAttributes } from 'vue';
import { ExternalLinkIcon } from '../icons';
import { useEditorState } from '../use-editor-state';
import { useBubbleMenuContext } from './context';

export interface BubbleMenuLinkOpenLinkProps
  extends /* @vue-ignore */ Omit<
    AnchorHTMLAttributes,
    'href' | 'target' | 'rel'
  > {}

defineOptions({ name: 'BubbleMenuLinkOpenLink', inheritAttrs: false });

defineProps<BubbleMenuLinkOpenLinkProps>();

const context = useBubbleMenuContext();

const linkHref = useEditorState({
  editor: () => context.editor,
  selector: ({ editor }) =>
    (editor?.getAttributes('link').href as string) ?? '',
});
</script>

<template>
  <a
    v-bind="$attrs"
    :href="linkHref ?? ''"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Open link"
    data-re-link-bm-item=""
    data-item="open-link"
  >
    <slot><ExternalLinkIcon /></slot>
  </a>
</template>
