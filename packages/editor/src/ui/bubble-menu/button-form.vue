<script setup lang="ts">
import { type HTMLAttributes, shallowRef, useTemplateRef, watch } from 'vue';
import { CheckIcon, UnlinkIcon } from '../icons';
import { useEditorState } from '../use-editor-state';
import { useBubbleMenuContext } from './context';
import { focusEditor, getUrlFromString } from './utils';

export interface BubbleMenuButtonFormProps
  extends /* @vue-ignore */ Pick<HTMLAttributes, 'class'> {
  validateUrl?: (value: string) => string | null;
  /** Called after the link is applied, also as `@link-apply` */
  onLinkApply?: (href: string) => void;
  /** Called after the link is removed, also as `@link-remove` */
  onLinkRemove?: () => void;
}

defineOptions({ name: 'BubbleMenuButtonForm' });

const props = defineProps<BubbleMenuButtonFormProps>();

const context = useBubbleMenuContext();
const inputRef = useTemplateRef<HTMLInputElement>('input');
const formRef = useTemplateRef<HTMLFormElement>('form');

const buttonHref = useEditorState({
  editor: () => context.editor,
  selector: ({ editor }) =>
    (editor?.getAttributes('button').href as string) ?? '',
});
const displayHref = () => (buttonHref.value === '#' ? '' : buttonHref.value);
const inputValue = shallowRef(displayHref());

watch(
  [() => context.isEditing, () => context.editor],
  ([isEditing, editor], _previous, onCleanup) => {
    if (!isEditing) {
      return;
    }
    const currentHref = (editor.getAttributes('button').href as string) ?? '';
    inputValue.value = currentHref === '#' ? '' : currentHref;
    const timeoutId = setTimeout(() => {
      inputRef.value?.focus();
    }, 0);
    onCleanup(() => clearTimeout(timeoutId));
  },
  { immediate: true },
);

watch(
  () => context.isEditing,
  (isEditing, _wasEditing, onCleanup) => {
    if (!isEditing) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        context.setIsEditing(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.value && !formRef.value.contains(event.target as Node)) {
        const form = formRef.value;
        const submitEvent = new SubmitEvent('submit', {
          bubbles: true,
          cancelable: true,
        });
        form.dispatchEvent(submitEvent);
        context.setIsEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    onCleanup(() => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    });
  },
  { immediate: true },
);

function handleSubmit(e: Event) {
  e.preventDefault();

  const editor = context.editor;
  const value = inputValue.value.trim();

  if (value === '') {
    editor.commands.updateButton({ href: '#' });
    context.setIsEditing(false);
    focusEditor(editor);
    props.onLinkRemove?.();
    return;
  }

  const validate = props.validateUrl ?? getUrlFromString;
  const finalValue = validate(value);

  if (!finalValue) {
    editor.commands.updateButton({ href: '#' });
    context.setIsEditing(false);
    focusEditor(editor);
    props.onLinkRemove?.();
    return;
  }

  editor.commands.updateButton({ href: finalValue });
  context.setIsEditing(false);
  focusEditor(editor);
  props.onLinkApply?.(finalValue);
}

function handleUnlink(e: MouseEvent) {
  e.stopPropagation();
  const editor = context.editor;
  editor.commands.updateButton({ href: '#' });
  context.setIsEditing(false);
  focusEditor(editor);
  props.onLinkRemove?.();
}
</script>

<template>
  <form
    v-if="context.isEditing"
    ref="form"
    data-re-btn-bm-form=""
    @mousedown.stop
    @click.stop
    @keydown.stop
    @submit="handleSubmit"
  >
    <input
      ref="input"
      v-model="inputValue"
      data-re-btn-bm-input=""
      placeholder="Paste a link"
      type="text"
      @focus.stop
    />

    <button
      v-if="displayHref()"
      type="button"
      aria-label="Remove link"
      data-re-btn-bm-unlink=""
      @click="handleUnlink"
    >
      <UnlinkIcon />
    </button>
    <button
      v-else
      type="submit"
      aria-label="Apply link"
      data-re-btn-bm-apply=""
      @mousedown.stop
    >
      <CheckIcon />
    </button>
  </form>
</template>
