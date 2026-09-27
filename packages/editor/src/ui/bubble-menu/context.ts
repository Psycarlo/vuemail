import type { Editor } from '@tiptap/core';
import { type InjectionKey, inject, provide } from 'vue';

/**
 * What `<BubbleMenu>` provides to the components inside of it. Its properties
 * are reactive: read them from the context instead of destructuring them to
 * keep them up to date.
 */
export interface BubbleMenuContextValue {
  editor: Editor;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export const BubbleMenuContext: InjectionKey<BubbleMenuContextValue> = Symbol(
  'vuemail.editor.bubbleMenu',
);

export function provideBubbleMenuContext(
  context: BubbleMenuContextValue,
): BubbleMenuContextValue {
  provide(BubbleMenuContext, context);
  return context;
}

export function useBubbleMenuContext(): BubbleMenuContextValue {
  const context = inject(BubbleMenuContext, null);
  if (!context) {
    throw new Error(
      'BubbleMenu compound components must be used within <BubbleMenu>',
    );
  }
  return context;
}
