import { Editor } from '@tiptap/core';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, type PropType, shallowRef } from 'vue';
import EditorProvider from '../../email-editor/editor-provider.vue';
import { provideCurrentEditor } from '../../email-editor/use-current-editor';
import { StarterKit } from '../../extensions';
import BubbleMenuRoot from './root.vue';

vi.mock('@tiptap/vue-3/menus', async () => {
  const { defineComponent, h } = await import('vue');
  return {
    BubbleMenu: defineComponent({
      inheritAttrs: false,
      props: {
        editor: { type: Object, required: true },
        pluginKey: { type: Object, default: undefined },
        shouldShow: { type: Function, default: null },
        options: {
          type: Object as () => {
            placement?: string;
            offset?: number;
            onHide?: () => void;
          },
          default: () => ({}),
        },
      },
      setup(props, { attrs, slots }) {
        return () =>
          h(
            'div',
            {
              class: attrs.class,
              'data-testid': 'bubble-menu-root',
              'data-re-bubble-menu': '',
              'data-placement': props.options?.placement,
              'data-offset': props.options?.offset,
            },
            slots.default?.(),
          );
      },
    }),
  };
});

const extensions = [StarterKit];

function waitForCreate() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function createEditor() {
  const element = document.createElement('div');
  document.body.append(element);

  const editor = new Editor({
    element,
    extensions: [StarterKit.configure()],
    content: '<p>Hello world</p>',
  });

  return { editor, element };
}

/** Provides an existing editor, like `EditorContext.Provider` does in React. */
const EditorHost = defineComponent({
  props: { editor: { type: Object as PropType<Editor>, required: true } },
  setup(props, { slots }) {
    provideCurrentEditor(shallowRef(props.editor) as never);
    return () => slots.default?.();
  },
});

async function renderWithEditor(ui: () => ReturnType<typeof h>) {
  const wrapper = mount(EditorProvider, {
    props: { extensions },
    slots: { default: ui },
    attachTo: document.body,
  });
  await flushPromises();
  return wrapper;
}

describe('BubbleMenuRoot', () => {
  it('renders null when no editor context is available', () => {
    const wrapper = mount(BubbleMenuRoot, {
      slots: { default: () => h('div', 'child') },
    });
    expect(wrapper.html()).toBe('');
    expect(wrapper.find('[data-re-bubble-menu]').exists()).toBe(false);
  });

  describe('when rendered inside EditorProvider (default bubble menu)', () => {
    it('renders the default bubble menu with all sections', async () => {
      const wrapper = await renderWithEditor(() => h(BubbleMenuRoot));

      expect(wrapper.find('[data-testid="bubble-menu-root"]').exists()).toBe(
        true,
      );

      expect(
        wrapper.get('[data-re-node-selector-trigger]').find('span').text(),
      ).toBe('Text');
      expect(wrapper.find('[aria-label="Add link"]').exists()).toBe(true);

      for (const label of [
        'bold',
        'italic',
        'underline',
        'strike',
        'code',
        'uppercase',
        'align-left',
        'align-center',
        'align-right',
      ]) {
        expect(wrapper.find(`[aria-label="${label}"]`).exists()).toBe(true);
      }

      wrapper.unmount();
    });

    it('renders two item groups', async () => {
      const wrapper = await renderWithEditor(() => h(BubbleMenuRoot));

      expect(wrapper.findAll('fieldset')).toHaveLength(2);

      wrapper.unmount();
    });

    it('renders custom children instead of the default menu', async () => {
      const wrapper = await renderWithEditor(() =>
        h(BubbleMenuRoot, null, () => h('span', 'custom child')),
      );

      expect(wrapper.text()).toContain('custom child');
      expect(wrapper.find('[aria-label="bold"]').exists()).toBe(false);
      expect(wrapper.find('[aria-label="Add link"]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('keeps the editor focused when focus moves into the bubble menu', async () => {
      const { editor, element } = createEditor();
      await waitForCreate();

      const wrapper = mount(EditorHost, {
        props: { editor },
        slots: {
          default: () =>
            h(BubbleMenuRoot, null, () => h('span', 'custom child')),
        },
        attachTo: document.body,
      });

      const root = wrapper.get('[data-testid="bubble-menu-root"]').element;
      editor.view.dom.dispatchEvent(
        new FocusEvent('focusin', { bubbles: true }),
      );
      editor.view.dom.dispatchEvent(
        new FocusEvent('focusout', {
          bubbles: true,
          relatedTarget: root,
        }),
      );
      root.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

      expect(editor.isFocused).toBe(true);

      wrapper.unmount();
      editor.destroy();
      element.remove();
    });

    it('forwards placement and offset to the BubbleMenu', async () => {
      const wrapper = await renderWithEditor(() =>
        h(BubbleMenuRoot, { placement: 'top', offset: 16 }),
      );

      const root = wrapper.get('[data-testid="bubble-menu-root"]')
        .element as HTMLElement;
      expect(root.dataset.placement).toBe('top');
      expect(root.dataset.offset).toBe('16');

      wrapper.unmount();
    });

    it('forwards className to the BubbleMenu', async () => {
      const wrapper = await renderWithEditor(() =>
        h(BubbleMenuRoot, { class: 'custom-class' }),
      );

      const root = wrapper.get('[data-testid="bubble-menu-root"]').element;
      expect(root.className).toBe('custom-class');

      wrapper.unmount();
    });
  });
});
