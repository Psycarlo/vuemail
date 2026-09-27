import type { Editor } from '@tiptap/vue-3';
import {
  type InjectionKey,
  inject,
  provide,
  type ShallowRef,
  shallowRef,
} from 'vue';

export interface CurrentEditorContext {
  /** The editor, once it's created, which only happens in the browser. */
  editor: ShallowRef<Editor | undefined>;
}

const currentEditorKey: InjectionKey<CurrentEditorContext> =
  Symbol('vuemail.editor');

/** Makes an editor available to the components inside of `<EmailEditor>`. */
export function provideCurrentEditor(
  editor: ShallowRef<Editor | undefined>,
): CurrentEditorContext {
  const context = { editor };
  provide(currentEditorKey, context);
  return context;
}

/**
 * The editor of the `<EmailEditor>` this component is rendered in, like
 * `useCurrentEditor` from `@tiptap/react`.
 */
export function useCurrentEditor(): CurrentEditorContext {
  return inject(currentEditorKey, () => ({ editor: shallowRef() }), true);
}
