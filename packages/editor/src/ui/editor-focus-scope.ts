import { extensions as nativeTiptapExtensions } from '@tiptap/core';
import {
  Comment,
  type ComponentPublicInstance,
  type ComputedRef,
  cloneVNode,
  computed,
  defineComponent,
  Fragment,
  type InjectionKey,
  inject,
  isVNode,
  onBeforeUnmount,
  provide,
  type SlotsType,
  shallowRef,
  Text,
  type VNode,
  type VNodeChild,
  watch,
} from 'vue';
import { useCurrentEditor } from '../email-editor/use-current-editor';
import {
  createFocusScopePlugin,
  createFocusScopesStorage,
  type FocusScopesStorage,
  focusScopePluginKey,
} from '../extensions/focus-scopes';

type FocusScopeContextValue = FocusScopesStorage;

/** Provided by `<EditorFocusScopeProvider>` to the focus scopes inside. */
export const FocusScopeContext: InjectionKey<
  ComputedRef<FocusScopeContextValue>
> = Symbol('vuemail.editor.focusScope');

const noopFocusScope: FocusScopeContextValue = {
  registerScope: () => {},
  unregisterScope: () => {},
};

/**
 * The focus scope registration functions of the current editor. They always
 * forward to the focus scope that's current when they're called.
 */
export function useEditorFocusScope(): FocusScopeContextValue {
  const context = inject(FocusScopeContext, null);
  const { editor } = useCurrentEditor();

  const current = () =>
    context?.value ??
    editor.value?.extensionStorage?.focusScope ??
    noopFocusScope;

  return {
    registerScope: (el) => current().registerScope(el),
    unregisterScope: (el) => current().unregisterScope(el),
  };
}

export interface EditorFocusScopeProviderProps {
  clearSelectionOnBlur?: boolean;
}

/**
 * @deprecated Focus scope tracking now lives in the FocusScopes extension,
 * included by default through StarterKit. This component is kept as a
 * compatibility wrapper for editors that do not use StarterKit.
 */
export const EditorFocusScopeProvider = defineComponent({
  name: 'EditorFocusScopeProvider',
  props: {
    clearSelectionOnBlur: { type: Boolean, default: true },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots }) {
    const { editor } = useCurrentEditor();
    const fallbackFocusScope = shallowRef<FocusScopeContextValue | null>(null);

    watch(
      [editor, () => props.clearSelectionOnBlur],
      ([currentEditor, clearSelectionOnBlur], _previous, onCleanup) => {
        if (!currentEditor) return;

        const hasFocusScopePlugin = currentEditor.state.plugins.some(
          (plugin) => plugin.spec.key === focusScopePluginKey,
        );
        if (hasFocusScopePlugin) {
          fallbackFocusScope.value =
            currentEditor.extensionStorage.focusScope ?? null;
          return;
        }

        const defaultFocusPlugin = currentEditor.state.plugins.find(
          (plugin) =>
            plugin.spec.key === nativeTiptapExtensions.focusEventsPluginKey,
        );
        if (defaultFocusPlugin) {
          currentEditor.unregisterPlugin(
            nativeTiptapExtensions.focusEventsPluginKey,
          );
        }

        const storage =
          currentEditor.extensionStorage.focusScope ??
          createFocusScopesStorage();
        currentEditor.extensionStorage.focusScope = storage;
        currentEditor.registerPlugin(
          createFocusScopePlugin({
            editor: currentEditor,
            storage,
            clearSelectionOnBlur,
          }),
        );
        fallbackFocusScope.value = storage;

        onCleanup(() => {
          currentEditor.unregisterPlugin(focusScopePluginKey);
          if (!currentEditor.isDestroyed && defaultFocusPlugin) {
            currentEditor.registerPlugin(defaultFocusPlugin);
          }
        });
      },
      { immediate: true },
    );

    provide(
      FocusScopeContext,
      computed(
        () =>
          fallbackFocusScope.value ??
          editor.value?.extensionStorage?.focusScope ??
          noopFocusScope,
      ),
    );

    return () => slots.default?.();
  },
});

function resolveElement(
  value: Element | ComponentPublicInstance | null,
): HTMLElement | null {
  const element = value instanceof Element ? value : (value?.$el ?? null);
  return element instanceof HTMLElement ? element : null;
}

function isRenderedNode(child: unknown): child is VNode {
  return isVNode(child) && child.type !== Comment && child.type !== Text;
}

function flattenFragments(children: VNodeChild): VNodeChild[] {
  return (Array.isArray(children) ? children : [children]).flatMap((child) =>
    isVNode(child) && child.type === Fragment
      ? flattenFragments(child.children as VNodeChild)
      : [child],
  );
}

/**
 * Keeps the editor focused while the focus is inside of its only child, like
 * a menu or an inspector panel rendered outside of the editor.
 */
export const EditorFocusScope = defineComponent({
  name: 'EditorFocusScope',
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(_props, { slots }) {
    const context = inject(FocusScopeContext, null);
    const { editor } = useCurrentEditor();
    const focusScope = computed(
      () =>
        context?.value ?? editor.value?.extensionStorage?.focusScope ?? null,
    );
    const attachedElement = shallowRef<HTMLElement | null>(null);

    watch(
      [focusScope, attachedElement],
      ([scope, element], [previousScope, previousElement]) => {
        if (
          previousScope &&
          previousElement &&
          (previousScope !== scope || previousElement !== element)
        ) {
          previousScope.unregisterScope(previousElement);
        }
        if (scope && element) {
          scope.registerScope(element);
        }
      },
      { flush: 'sync' },
    );

    onBeforeUnmount(() => {
      if (focusScope.value && attachedElement.value) {
        focusScope.value.unregisterScope(attachedElement.value);
      }
    });

    const setScopeRef = (value: Element | ComponentPublicInstance | null) => {
      attachedElement.value = resolveElement(value);
    };

    // The ref is always attached, even without a focus scope to register
    // with, so that what's rendered never changes shape when one shows up.
    return () => {
      const nodes = flattenFragments(slots.default?.());
      const index = nodes.findIndex(isRenderedNode);
      if (index !== -1) {
        nodes[index] = cloneVNode(
          nodes[index] as VNode,
          { ref: setScopeRef },
          true,
        );
      }
      return nodes.length === 1 ? nodes[0] : nodes;
    };
  },
});
