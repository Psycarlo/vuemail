<script lang="ts">
import { PluginKey } from '@tiptap/pm/state';

const buttonPluginKey = new PluginKey('buttonBubbleMenu');
</script>

<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { useCurrentEditor } from '../../email-editor/use-current-editor';
import { useEditorState } from '../use-editor-state';
import BubbleMenuButtonEditLink from './button-edit-link.vue';
import BubbleMenuButtonForm from './button-form.vue';
import BubbleMenuButtonToolbar from './button-toolbar.vue';
import BubbleMenuButtonUnlink from './button-unlink.vue';
import BubbleMenuRoot from './root.vue';
import { bubbleMenuTriggers } from './triggers';

export interface BubbleMenuButtonDefaultProps
  extends /* @vue-ignore */ HTMLAttributes {
  placement?: 'top' | 'bottom';
  offset?: number;
  /** Called when the menu hides, also as `@hide` */
  onHide?: () => void;
  validateUrl?: (value: string) => string | null;
  /** Called after the link is applied, also as `@link-apply` */
  onLinkApply?: (href: string) => void;
  /** Called after the link is removed, also as `@link-remove` */
  onLinkRemove?: () => void;
}

defineOptions({ name: 'BubbleMenuButtonDefault' });

const {
  placement = 'top',
  offset,
  onHide,
  validateUrl,
  onLinkApply,
  onLinkRemove,
} = defineProps<BubbleMenuButtonDefaultProps>();

// The same editor the menu provides to its content.
const { editor } = useCurrentEditor();

const buttonHref = useEditorState({
  editor,
  selector: ({ editor: e }) =>
    (e?.getAttributes('button').href as string) ?? '',
});

const hasLink = computed(
  () => (buttonHref.value ?? '') !== '' && buttonHref.value !== '#',
);

const trigger = bubbleMenuTriggers.node('button');
</script>

<template>
  <BubbleMenuRoot
    :trigger="trigger"
    :plugin-key="buttonPluginKey"
    :placement="placement"
    :offset="offset"
    :on-hide="onHide"
  >
    <BubbleMenuButtonToolbar>
      <BubbleMenuButtonEditLink />
      <BubbleMenuButtonUnlink v-if="hasLink" :on-link-remove="onLinkRemove" />
    </BubbleMenuButtonToolbar>
    <BubbleMenuButtonForm
      :validate-url="validateUrl"
      :on-link-apply="onLinkApply"
      :on-link-remove="onLinkRemove"
    />
  </BubbleMenuRoot>
</template>
