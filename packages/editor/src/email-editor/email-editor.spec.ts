import { flushPromises, mount } from '@vue/test-utils';
import EmailEditor from './email-editor.vue';
import type { EmailEditorRef } from './types';

const content = {
  type: 'doc',
  content: [
    { type: 'paragraph', content: [{ type: 'text', text: 'Hello there' }] },
  ],
};

const waitForReady = () => new Promise((resolve) => setTimeout(resolve, 20));

describe('<EmailEditor>', () => {
  it('calls onReady once the editor is mounted in the page, like React Email', async () => {
    const readyStates: {
      json: unknown;
      mountedInEditor: boolean;
      text: string | undefined;
    }[] = [];
    const wrapper = mount(EmailEditor, {
      props: {
        content,
        onReady: (ref: EmailEditorRef) => {
          const dom = ref.editor?.view.dom;
          readyStates.push({
            json: ref.getJSON(),
            mountedInEditor: Boolean(dom && document.body.contains(dom)),
            text: dom?.textContent ?? undefined,
          });
        },
      },
      attachTo: document.body,
    });
    await flushPromises();
    await waitForReady();

    expect(readyStates).toHaveLength(1);
    expect(readyStates[0].mountedInEditor).toBe(true);
    expect(readyStates[0].text).toContain('Hello there');
    expect(JSON.stringify(readyStates[0].json)).toContain('Hello there');
    wrapper.unmount();
  });

  it('calls onUpdate on changes, and onReady again for the editor of a new theme', async () => {
    const onReady = vi.fn();
    const onUpdate = vi.fn();
    const wrapper = mount(EmailEditor, {
      props: { content, onReady, onUpdate },
      attachTo: document.body,
    });
    await flushPromises();
    await waitForReady();
    expect(onReady).toHaveBeenCalledTimes(1);

    const ref = wrapper.vm as unknown as EmailEditorRef;
    ref.editor?.commands.insertContent('!');
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ getEmail: expect.any(Function) }),
    );

    const firstEditor = ref.editor;
    await wrapper.setProps({ theme: 'minimal' });
    await flushPromises();
    await waitForReady();

    expect(onReady).toHaveBeenCalledTimes(2);
    expect(ref.editor).not.toBe(firstEditor);
    expect(firstEditor?.isDestroyed).toBe(true);
    // Like React Email, the new editor starts again from `content`
    expect(ref.editor?.getText()).toContain('Hello there');
    expect(ref.editor?.getText()).not.toContain('!');
    wrapper.unmount();
  });
});
