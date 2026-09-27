import type { Editor } from '@tiptap/core';
import {
  type ComputedRef,
  computed,
  type MaybeRefOrGetter,
  shallowRef,
  toValue,
  watch,
} from 'vue';

export interface EditorStateSnapshot {
  editor: Editor | null;
  transactionNumber: number;
}

export interface UseEditorStateOptions<TSelectorResult> {
  editor: MaybeRefOrGetter<Editor | null | undefined>;
  selector: (snapshot: EditorStateSnapshot) => TSelectorResult;
  /** Decides whether a new selection is the same as the last one (deep equality by default). */
  equalityFn?: (a: TSelectorResult, b: TSelectorResult | null) => boolean;
}

/**
 * Selects a piece of the editor state, updating after every transaction of
 * the editor, like `useEditorState` from `@tiptap/react`.
 *
 * The selection only changes (and only re-renders what depends on it) when
 * `equalityFn` considers it different from the last one. Reactive values the
 * selector reads, like props, are tracked as well.
 */
export function useEditorState<TSelectorResult>({
  editor,
  selector,
  equalityFn = isDeepEqual,
}: UseEditorStateOptions<TSelectorResult>): ComputedRef<TSelectorResult> {
  const transactionNumber = shallowRef(0);

  watch(
    () => toValue(editor),
    (currentEditor, _previousEditor, onCleanup) => {
      if (!currentEditor) {
        return;
      }

      const onTransaction = () => {
        transactionNumber.value += 1;
      };

      currentEditor.on('transaction', onTransaction);
      onCleanup(() => {
        currentEditor.off('transaction', onTransaction);
      });
    },
    { immediate: true, flush: 'sync' },
  );

  return computed((previous?: TSelectorResult) => {
    const next = selector({
      editor: toValue(editor) ?? null,
      transactionNumber: transactionNumber.value,
    });

    if (previous !== undefined && equalityFn(next, previous)) {
      return previous;
    }

    return next;
  });
}

export function isDeepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) {
    return true;
  }

  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null
  ) {
    return false;
  }

  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length && a.every((item, i) => isDeepEqual(item, b[i]))
    );
  }

  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
    return false;
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  return (
    aKeys.length === bKeys.length &&
    aKeys.every(
      (key) =>
        Object.hasOwn(b, key) &&
        isDeepEqual(
          (a as Record<string, unknown>)[key],
          (b as Record<string, unknown>)[key],
        ),
    )
  );
}
