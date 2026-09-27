<script setup lang="ts">
import {
  computed,
  type HTMLAttributes,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue';
import { CheckIcon, UnlinkIcon } from '../icons';
import { useEditorState } from '../use-editor-state';
import { useBubbleMenuContext } from './context';
import { focusEditor, getUrlFromString } from './utils';

export interface BubbleMenuImageFormProps
  extends /* @vue-ignore */ Pick<HTMLAttributes, 'class'> {
  validateUrl?: (value: string) => string | null;
  /** Called after the link is applied, also as `@link-apply` */
  onLinkApply?: (href: string) => void;
  /** Called after the link is removed, also as `@link-remove` */
  onLinkRemove?: () => void;
}

defineOptions({ name: 'BubbleMenuImageForm' });

const props = defineProps<BubbleMenuImageFormProps>();

const context = useBubbleMenuContext();
const inputRef = useTemplateRef<HTMLInputElement>('input');
const formRef = useTemplateRef<HTMLFormElement>('form');

const imageHref = useEditorState({
  editor: () => context.editor,
  selector: ({ editor }) =>
    (editor?.getAttributes('image').href as string | null) ?? '',
});

const inputValue = shallowRef(imageHref.value ?? '');

watch(
  [() => context.isEditing, imageHref],
  ([isEditing, href], _previous, onCleanup) => {
    if (!isEditing) {
      return;
    }
    inputValue.value = href ?? '';
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
    editor.chain().focus().updateAttributes('image', { href: null }).run();
    context.setIsEditing(false);
    focusEditor(editor);
    props.onLinkRemove?.();
    return;
  }

  const validate = props.validateUrl ?? getUrlFromString;
  const finalValue = validate(value);

  if (!finalValue) {
    editor.chain().focus().updateAttributes('image', { href: null }).run();
    context.setIsEditing(false);
    focusEditor(editor);
    props.onLinkRemove?.();
    return;
  }

  editor.chain().focus().updateAttributes('image', { href: finalValue }).run();
  context.setIsEditing(false);
  focusEditor(editor);
  props.onLinkApply?.(finalValue);
}

function handleUnlink(e: MouseEvent) {
  e.stopPropagation();
  const editor = context.editor;
  editor.chain().focus().updateAttributes('image', { href: null }).run();
  context.setIsEditing(false);
  focusEditor(editor);
  props.onLinkRemove?.();
}

const hasLink = computed(() => (imageHref.value ?? '') !== '');
</script>

<template>
  <form
    v-if="context.isEditing"
    ref="form"
    data-re-img-bm-form=""
    @mousedown.stop
    @click.stop
    @keydown.stop
    @submit="handleSubmit"
  >
    <input
      ref="input"
      v-model="inputValue"
      data-re-img-bm-input=""
      placeholder="Paste a link"
      type="text"
      @focus.stop
    />

    <button
      v-if="hasLink"
      type="button"
      aria-label="Remove link"
      data-re-img-bm-unlink=""
      @click="handleUnlink"
    >
      <UnlinkIcon />
    </button>
    <button
      v-else
      type="submit"
      aria-label="Apply link"
      data-re-img-bm-apply=""
      @mousedown.stop
    >
      <CheckIcon />
    </button>
  </form>
</template>
