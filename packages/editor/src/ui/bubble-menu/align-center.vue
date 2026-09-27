<script setup lang="ts">
import { setTextAlignment } from '../../utils/set-text-alignment';
import { AlignCenterIcon } from '../icons';
import { useEditorState } from '../use-editor-state';
import { useBubbleMenuContext } from './context';
import BubbleMenuItem from './item.vue';

defineOptions({ name: 'BubbleMenuAlignCenter' });

const context = useBubbleMenuContext();

const isActive = useEditorState({
  editor: () => context.editor,
  selector: ({ editor }) => editor?.isActive({ alignment: 'center' }) ?? false,
});
</script>

<template>
  <BubbleMenuItem
    name="align-center"
    :is-active="isActive"
    :on-command="() => setTextAlignment(context.editor, 'center')"
  >
    <slot><AlignCenterIcon /></slot>
  </BubbleMenuItem>
</template>
