import type { Editor } from '@tiptap/vue-3';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { StarterKit } from '../extensions';
import EditorProvider from './editor-provider.vue';
import { useCurrentEditor } from './use-current-editor';

const content = {
  type: 'doc',
  content: [
    { type: 'paragraph', content: [{ type: 'text', text: 'Hello there' }] },
  ],
};

describe('<EditorProvider>', () => {
  it('creates an editor from just its extensions and content', async () => {
    const wrapper = mount(EditorProvider, {
      props: { extensions: [StarterKit], content },
      attachTo: document.body,
    });
    // The editor is created once mounted, and then moved into place
    await flushPromises();

    expect(wrapper.find('.tiptap').text()).toContain('Hello there');
    wrapper.unmount();
  });

  it('gives its editor to the components inside and to its slots', async () => {
    let injected: Editor | undefined;
    const Child = defineComponent(() => {
      const { editor } = useCurrentEditor();
      return () => {
        injected = editor.value;
        return null;
      };
    });
    let fromSlot: Editor | undefined;

    const wrapper = mount(EditorProvider, {
      props: { extensions: [StarterKit], content },
      slots: {
        default: ({ editor }: { editor: Editor | undefined }) => {
          fromSlot = editor;
          return h(Child);
        },
      },
      attachTo: document.body,
    });
    await flushPromises();

    const { editor } = wrapper.vm as unknown as { editor: Editor };
    expect(editor.getText()).toContain('Hello there');
    expect(injected).toBe(editor);
    expect(fromSlot).toBe(editor);
    wrapper.unmount();
  });

  it('follows `editable` and destroys the editor when unmounted', async () => {
    const onUpdate = vi.fn();
    const wrapper = mount(EditorProvider, {
      props: { extensions: [StarterKit], content, onUpdate },
      attachTo: document.body,
    });
    await flushPromises();
    const { editor } = wrapper.vm as unknown as { editor: Editor };

    onUpdate.mockClear();
    editor.commands.insertContent('!');
    expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ editor }));

    await wrapper.setProps({ editable: false });
    expect(editor.isEditable).toBe(false);

    wrapper.unmount();
    expect(editor.isDestroyed).toBe(true);
  });
});
