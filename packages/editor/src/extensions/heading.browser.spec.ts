// The heading's Vue node view renders another element for each level: when
// the level changes, ProseMirror must keep rendering into the element that's
// in the document (and keep the selection), like with React's node views.
import type { Editor } from '@tiptap/core';
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { focusEditor, nextFrame } from '../__tests__/browser-test-helpers';
import EditorProvider from '../email-editor/editor-provider.vue';
import { StarterKit } from '.';

const mounted: VueWrapper[] = [];

afterEach(() => {
  for (const wrapper of mounted.splice(0)) {
    wrapper.unmount();
  }
  document.body.innerHTML = '';
});

async function renderEditor(content: string) {
  const wrapper = mount(EditorProvider, {
    props: { extensions: [StarterKit], content },
    attachTo: document.body,
  });
  mounted.push(wrapper);
  await flushPromises();
  const editor = (wrapper.vm as unknown as { editor: Editor }).editor;
  if (!editor) throw new Error('Editor not ready');
  return editor;
}

describe('Heading node view (browser)', () => {
  it('keeps ProseMirror rendering into the heading when its level changes', async () => {
    const editor = await renderEditor('<h1>Heading text</h1>');
    // Inside the container, the heading's content starts at 2
    const contentStart = 2;

    const expectInSync = (level: number) => {
      const heading = editor.view.dom.querySelector('h1, h2, h3');
      expect(heading?.tagName).toBe(`H${level}`);
      expect(heading?.textContent).toBe('Heading text');

      // Where ProseMirror puts the content must be the element in the page
      const { node } = editor.view.domAtPos(contentStart);
      expect(editor.view.dom.contains(node)).toBe(true);
      expect(heading?.contains(node)).toBe(true);
    };

    for (const level of [2, 3, 1, 3]) {
      editor.commands.setNode('heading', { level });
      expectInSync(level);
      await flushPromises();
      expectInSync(level);
      await nextFrame();
      expectInSync(level);
    }

    // Marks go into the visible heading too
    editor
      .chain()
      .setTextSelection({ from: contentStart, to: contentStart + 7 })
      .toggleBold()
      .run();
    await nextFrame();
    expect(editor.view.dom.querySelector('h3 strong')?.textContent).toBe(
      'Heading',
    );
  });

  it('keeps the caret where it was when the level changes', async () => {
    const editor = await renderEditor('<h1>Heading text</h1>');
    const caret = 2 + 'Heading'.length;

    await focusEditor(editor, caret);
    editor.chain().focus().setNode('heading', { level: 2 }).run();
    await nextFrame();
    await nextFrame();

    expect(editor.state.selection.from).toBe(caret);
    expect(editor.state.selection.to).toBe(caret);
    expect(editor.view.dom.querySelector('h2')?.textContent).toBe(
      'Heading text',
    );
  });
});
