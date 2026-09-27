import { Editor } from '@tiptap/core';
import TipTapStarterKit from '@tiptap/starter-kit';
import { mount } from '@vue/test-utils';
import {
  defineComponent,
  h,
  nextTick,
  type ShallowRef,
  shallowRef,
  triggerRef,
} from 'vue';
import { provideCurrentEditor } from '../email-editor/use-current-editor';
import {
  EditorFocusScope,
  EditorFocusScopeProvider,
  useEditorFocusScope,
} from './editor-focus-scope';

function waitForCreate() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Provides an editor (or a stand-in for one) to its slot, like
 * `EditorContext.Provider` does in React.
 */
function createEditorHost(editor: unknown) {
  const editorRef = shallowRef(editor) as ShallowRef<Editor>;
  const EditorHost = defineComponent({
    setup(_, { slots }) {
      provideCurrentEditor(editorRef as never);
      return () => slots.default?.();
    },
  });
  return { EditorHost, editorRef };
}

function createFocusScopeEditor() {
  const registerScope = vi.fn();
  const unregisterScope = vi.fn();
  const editor = {
    extensionStorage: {
      focusScope: {
        registerScope,
        unregisterScope,
      },
    },
  };
  return { editor, registerScope, unregisterScope };
}

describe('EditorFocusScope', () => {
  it('renders children without a provider', () => {
    const wrapper = mount(EditorFocusScope, {
      slots: {
        default: () => h('button', { type: 'button' }, 'Scoped action'),
      },
    });

    expect(wrapper.get('button').text()).toBe('Scoped action');
  });

  it('registers and unregisters children with extension storage', () => {
    const { editor, registerScope, unregisterScope } = createFocusScopeEditor();
    const { EditorHost } = createEditorHost(editor);

    const wrapper = mount(EditorHost, {
      slots: {
        default: () =>
          h(EditorFocusScope, null, () =>
            h('button', { type: 'button' }, 'Scoped action'),
          ),
      },
    });

    const button = wrapper.get('button').element;
    expect(registerScope).toHaveBeenCalledWith(button);

    wrapper.unmount();
    expect(unregisterScope).toHaveBeenCalledWith(button);
  });

  it('unregisters the previous child when the scoped element changes', async () => {
    const { editor, registerScope, unregisterScope } = createFocusScopeEditor();
    const { EditorHost } = createEditorHost(editor);
    const showLink = shallowRef(false);

    const wrapper = mount(EditorHost, {
      slots: {
        default: () =>
          h(EditorFocusScope, null, () =>
            showLink.value
              ? h('a', { href: '/second' }, 'Second action')
              : h('button', { type: 'button' }, 'First action'),
          ),
      },
    });

    const firstButton = wrapper.get('button').element;
    expect(registerScope).toHaveBeenCalledWith(firstButton);

    showLink.value = true;
    await nextTick();

    const secondLink = wrapper.get('a').element;
    expect(unregisterScope).toHaveBeenCalledWith(firstButton);
    expect(registerScope).toHaveBeenCalledWith(secondLink);
  });

  it('unregisters from the old focus scope when extension storage changes', async () => {
    const firstRegisterScope = vi.fn();
    const firstUnregisterScope = vi.fn();
    const secondRegisterScope = vi.fn();
    const secondUnregisterScope = vi.fn();
    const editor = {
      extensionStorage: {
        focusScope: {
          registerScope: firstRegisterScope,
          unregisterScope: firstUnregisterScope,
        },
      },
    };
    const { EditorHost, editorRef } = createEditorHost(editor);

    const wrapper = mount(EditorHost, {
      slots: {
        default: () =>
          h(EditorFocusScope, null, () =>
            h('button', { type: 'button' }, 'Scoped action'),
          ),
      },
    });

    const button = wrapper.get('button').element;
    expect(firstRegisterScope).toHaveBeenCalledWith(button);

    editor.extensionStorage.focusScope = {
      registerScope: secondRegisterScope,
      unregisterScope: secondUnregisterScope,
    };
    // The storage isn't reactive: tell Vue the editor changed, which is what
    // re-rendering with the same editor does in React.
    triggerRef(editorRef);
    await nextTick();

    expect(firstUnregisterScope).toHaveBeenCalledWith(button);
    expect(secondRegisterScope).toHaveBeenCalledWith(button);

    wrapper.unmount();
    expect(secondUnregisterScope).toHaveBeenCalledWith(button);
  });

  it('registers the root element of a component child, and unregisters it on unmount', () => {
    const { editor, registerScope, unregisterScope } = createFocusScopeEditor();
    const { EditorHost } = createEditorHost(editor);

    const ComponentChild = defineComponent({
      setup: () => () => h('div', 'Component child'),
    });

    const wrapper = mount(EditorHost, {
      slots: {
        default: () => h(EditorFocusScope, null, () => h(ComponentChild)),
      },
    });

    const child = wrapper.get('div').element;
    expect(registerScope).toHaveBeenCalledWith(child);

    wrapper.unmount();
    expect(unregisterScope).toHaveBeenCalledWith(child);
  });
});

describe('EditorFocusScopeProvider', () => {
  it('renders children', () => {
    const wrapper = mount(EditorFocusScopeProvider, {
      props: { clearSelectionOnBlur: false },
      slots: {
        default: () => h('button', { type: 'button' }, 'Inside provider'),
      },
    });

    expect(wrapper.get('button').text()).toBe('Inside provider');
  });

  it('installs focus scope tracking when the editor does not use StarterKit', async () => {
    const element = document.createElement('div');
    document.body.append(element);
    const editor = new Editor({
      element,
      extensions: [TipTapStarterKit],
      content: '<p>Hello world</p>',
    });
    await waitForCreate();
    const { EditorHost } = createEditorHost(editor);

    const wrapper = mount(EditorHost, {
      slots: {
        default: () =>
          h(EditorFocusScopeProvider, null, () =>
            h(EditorFocusScope, null, () =>
              h('button', { type: 'button' }, 'Scoped action'),
            ),
          ),
      },
      attachTo: document.body,
    });

    const button = wrapper.get('button').element;
    editor.view.dom.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    editor.view.dom.dispatchEvent(
      new FocusEvent('focusout', {
        bubbles: true,
        relatedTarget: button,
      }),
    );
    button.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

    expect(editor.isFocused).toBe(true);

    wrapper.unmount();
    editor.destroy();
    element.remove();
  });
});

describe('useEditorFocusScope', () => {
  it('returns the extension storage registration functions', () => {
    const { editor, registerScope, unregisterScope } = createFocusScopeEditor();
    const { EditorHost } = createEditorHost(editor);

    const Probe = defineComponent({
      setup() {
        const focusScope = useEditorFocusScope();
        focusScope.registerScope(null);
        focusScope.unregisterScope(null);
        return () => null;
      },
    });

    mount(EditorHost, { slots: { default: () => h(Probe) } });

    expect(registerScope).toHaveBeenCalledWith(null);
    expect(unregisterScope).toHaveBeenCalledWith(null);
  });
});
