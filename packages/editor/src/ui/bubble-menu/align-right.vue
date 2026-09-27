<script setup lang="ts">
import { setTextAlignment } from '../../utils/set-text-alignment';
import { AlignRightIcon } from '../icons';
import { useEditorState } from '../use-editor-state';
import { useBubbleMenuContext } from './context';
import BubbleMenuItem from './item.vue';

defineOptions({ name: 'BubbleMenuAlignRight' });

const context = useBubbleMenuContext();

const isActive = useEditorState({
  editor: () => context.editor,
  selector: ({ editor }) => editor?.isActive({ alignment: 'right' }) ?? false,
});
</script>

<template>
  <BubbleMenuItem
    name="align-right"
    :is-active="isActive"
    :on-command="() => setTextAlignment(context.editor, 'right')"
  >
    <slot><AlignRightIcon /></slot>
  </BubbleMenuItem>
</template>
