// Changing the block type through the bubble menu's node selector, with real
// clicks, keeps the selection and the menu, however many times it's changed.
import type { Editor } from '@tiptap/core';
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { userEvent } from 'vitest/browser';
import { h } from 'vue';
import { nextFrame } from '../../__tests__/browser-test-helpers';
import EditorProvider from '../../email-editor/editor-provider.vue';
import { StarterKit } from '../../extensions';
import { BubbleMenu } from '.';

const content = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Select this text to change its type.' }],
    },
  ],
};

const mounted: VueWrapper[] = [];

afterEach(() => {
  for (const wrapper of mounted.splice(0)) {
    wrapper.unmount();
  }
  document.body.innerHTML = '';
});

async function renderEditor() {
  const wrapper = mount(EditorProvider, {
    props: { extensions: [StarterKit], content },
    slots: { default: () => h(BubbleMenu) },
    attachTo: document.body,
  });
  mounted.push(wrapper);
  await flushPromises();
  const editor = (wrapper.vm as unknown as { editor: Editor }).editor;
  if (!editor) throw new Error('Editor not ready');
  return editor;
}

const menu = () => document.querySelector<HTMLElement>('[data-re-bubble-menu]');

const trigger = () =>
  document.querySelector<HTMLElement>(
    '[data-re-bubble-menu] [data-re-node-selector-trigger]',
  );

const item = (name: string) =>
  Array.from(
    document.querySelectorAll<HTMLElement>('[data-re-node-selector-item]'),
  ).find((element) => element.textContent?.trim() === name);

describe('BubbleMenu node selector (browser)', () => {
  it('keeps the selection and the menu when changing the block type repeatedly', async () => {
    const editor = await renderEditor();
    const textStart = 2;
    const textEnd = textStart + 'Select this'.length;

    editor
      .chain()
      .focus()
      .setTextSelection({ from: textStart, to: textEnd })
      .run();
    await nextFrame();
    await vi.waitFor(() => expect(trigger()?.isConnected).toBe(true));

    const picks = [
      { name: 'Title', type: 'heading', level: 1 },
      { name: 'Subtitle', type: 'heading', level: 2 },
      { name: 'Heading', type: 'heading', level: 3 },
      { name: 'Title', type: 'heading', level: 1 },
      { name: 'Text', type: 'paragraph', level: undefined },
    ];

    for (const pick of picks) {
      const button = trigger();
      if (!button)
        throw new Error(`the menu is gone before picking ${pick.name}`);
      await userEvent.click(button);
      await vi.waitFor(() => expect(item(pick.name)).toBeDefined());
      await userEvent.click(item(pick.name) as HTMLElement);
      await nextFrame();
      await nextFrame();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const block = editor.state.doc.firstChild?.firstChild;
      expect(block?.type.name).toBe(pick.type);
      expect(block?.attrs.level).toBe(pick.level);
      expect({
        from: editor.state.selection.from,
        to: editor.state.selection.to,
      }).toEqual({ from: textStart, to: textEnd });
      expect(menu()?.isConnected).toBe(true);
      expect(trigger()?.textContent).toContain(pick.name);
    }
  });
});
