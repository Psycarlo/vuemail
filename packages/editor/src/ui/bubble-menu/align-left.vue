<script setup lang="ts">
import { getSelectionAlignment, setTextAlignment } from '../../utils';
import { AlignLeftIcon } from '../icons';
import { useEditorState } from '../use-editor-state';
import { useBubbleMenuContext } from './context';
import BubbleMenuItem from './item.vue';

defineOptions({ name: 'BubbleMenuAlignLeft' });

const context = useBubbleMenuContext();

const isActive = useEditorState({
  editor: () => context.editor,
  selector: ({ editor }) =>
    editor ? getSelectionAlignment(editor) === 'left' : false,
});
</script>

<template>
  <BubbleMenuItem
    name="align-left"
    :is-active="isActive"
    :on-command="() => setTextAlignment(context.editor, 'left')"
  >
    <slot><AlignLeftIcon /></slot>
  </BubbleMenuItem>
</template>
