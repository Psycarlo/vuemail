<script setup lang="ts">
import {
  computed,
  type HTMLAttributes,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue';
import {
  type EditorEventSubscription,
  editorEventBus,
} from '../../core/event-bus';
import { CheckIcon, LinkIcon, UnlinkIcon } from '../icons';
import { useEditorState } from '../use-editor-state';
import { useBubbleMenuContext } from './context';
import { focusEditor, getUrlFromString, setLinkHref } from './utils';

export interface BubbleMenuLinkSelectorProps
  extends /* @vue-ignore */ Pick<HTMLAttributes, 'class'> {
  /** Whether to show the link icon toggle button (default: true) */
  showToggle?: boolean;
  /** Custom URL validator. Return the valid URL string or null. */
  validateUrl?: (value: string) => string | null;
  /** Called after link is applied, also as `@link-apply` */
  onLinkApply?: (href: string) => void;
  /** Called after link is removed, also as `@link-remove` */
  onLinkRemove?: () => void;
  /** Controlled open state */
  open?: boolean;
  /** Called when open state changes, also as `@open-change` */
  onOpenChange?: (open: boolean) => void;
}

defineOptions({ name: 'BubbleMenuLinkSelector' });

const props = withDefaults(defineProps<BubbleMenuLinkSelectorProps>(), {
  showToggle: true,
  open: undefined,
});

defineSlots<{
  /** Plugin slot: extra actions rendered inside the link input form */
  default?: () => unknown;
}>();

const context = useBubbleMenuContext();
const uncontrolledOpen = shallowRef(false);

const isControlled = computed(() => props.open !== undefined);
const isOpen = computed(() =>
  isControlled.value ? Boolean(props.open) : uncontrolledOpen.value,
);
const setIsOpen = (value: boolean) => {
  if (!isControlled.value) {
    uncontrolledOpen.value = value;
  }
  props.onOpenChange?.(value);
};

const editorState = useEditorState({
  editor: () => context.editor,
  selector: ({ editor }) => ({
    isLinkActive: editor?.isActive('link') ?? false,
    hasLink: Boolean(editor?.getAttributes('link').href),
    currentHref: (editor?.getAttributes('link').href as string) || '',
  }),
});

let subscription: EditorEventSubscription | null = null;

onMounted(() => {
  subscription = editorEventBus.on('bubble-menu:add-link', () => {
    setIsOpen(true);
  });
});

onBeforeUnmount(() => {
  setIsOpen(false);
  subscription?.unsubscribe();
});

const handleOpenLink = () => {
  setIsOpen(!isOpen.value);
};

// The link form, shown while the selector is open.
const inputRef = useTemplateRef<HTMLInputElement>('input');
const formRef = useTemplateRef<HTMLFormElement>('form');
const displayHref = computed(() =>
  editorState.value.currentHref === '#' ? '' : editorState.value.currentHref,
);
const inputValue = shallowRef('');

watch(
  isOpen,
  (open, _wasOpen, onCleanup) => {
    if (!open) {
      return;
    }

    inputValue.value = displayHref.value;

    const timeoutId = setTimeout(() => {
      inputRef.value?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (context.editor.getAttributes('link').href === '#') {
          context.editor.chain().unsetLink().run();
        }
        setIsOpen(false);
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
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    onCleanup(() => {
      clearTimeout(timeoutId);
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
    setLinkHref(editor, '');
    setIsOpen(false);
    focusEditor(editor);
    props.onLinkRemove?.();
    return;
  }

  const validate = props.validateUrl ?? getUrlFromString;
  const finalValue = validate(value);

  if (!finalValue) {
    setLinkHref(editor, '');
    setIsOpen(false);
    focusEditor(editor);
    props.onLinkRemove?.();
    return;
  }

  setLinkHref(editor, finalValue);
  setIsOpen(false);
  focusEditor(editor);
  props.onLinkApply?.(finalValue);
}

function handleUnlink(e: MouseEvent) {
  e.stopPropagation();
  const editor = context.editor;
  setLinkHref(editor, '');
  setIsOpen(false);
  focusEditor(editor);
  props.onLinkRemove?.();
}
</script>

<template>
  <div
    data-re-link-selector=""
    :data-open="isOpen ? '' : undefined"
    :data-has-link="editorState.hasLink ? '' : undefined"
  >
    <button
      v-if="showToggle"
      type="button"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      aria-label="Add link"
      :aria-pressed="editorState.isLinkActive && editorState.hasLink"
      data-re-link-selector-trigger=""
      @click="handleOpenLink"
    >
      <LinkIcon />
    </button>
    <form
      v-if="isOpen"
      ref="form"
      data-re-link-selector-form=""
      @mousedown.stop
      @click.stop
      @keydown.stop
      @submit="handleSubmit"
    >
      <input
        ref="input"
        v-model="inputValue"
        data-re-link-selector-input=""
        placeholder="Paste a link"
        type="text"
        @focus.stop
      />

      <slot />

      <button
        v-if="displayHref"
        type="button"
        aria-label="Remove link"
        data-re-link-selector-unlink=""
        @click="handleUnlink"
      >
        <UnlinkIcon />
      </button>
      <button
        v-else
        type="submit"
        aria-label="Apply link"
        data-re-link-selector-apply=""
        @mousedown.stop
      >
        <CheckIcon />
      </button>
    </form>
  </div>
</template>
