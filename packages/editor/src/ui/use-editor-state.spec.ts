import { Editor } from '@tiptap/core';
import { effectScope, shallowRef } from 'vue';
import { StarterKit } from '../extensions';
import { useEditorState } from './use-editor-state';

const createEditor = () =>
  new Editor({ extensions: [StarterKit], content: '<p>Hello</p>' });

describe('useEditorState()', () => {
  const scope = effectScope();
  afterAll(() => scope.stop());

  it('selects from the editor again after each transaction', () => {
    const editor = createEditor();
    const isBold = scope.run(() =>
      useEditorState({
        editor,
        selector: ({ editor }) => editor?.isActive('bold') ?? false,
      }),
    )!;

    expect(isBold.value).toBe(false);
    editor.commands.selectAll();
    editor.commands.toggleBold();
    expect(isBold.value).toBe(true);
    editor.destroy();
  });

  it('keeps the same selection while it stays deeply equal', () => {
    const editor = createEditor();
    const selector = vi.fn(({ editor }) => ({
      bold: editor?.isActive('bold') ?? false,
    }));
    const state = scope.run(() => useEditorState({ editor, selector }))!;

    const first = state.value;
    editor.commands.insertContent('!');
    expect(state.value).toBe(first);
    expect(selector).toHaveBeenCalledTimes(2);
    editor.destroy();
  });

  it('follows the editor it is given, once there is one', () => {
    const editor = shallowRef<Editor>();
    const text = scope.run(() =>
      useEditorState({
        editor,
        selector: ({ editor }) => editor?.getText() ?? null,
      }),
    )!;

    expect(text.value).toBeNull();
    editor.value = createEditor();
    expect(text.value).toContain('Hello');
    editor.value.commands.insertContent(' there');
    expect(text.value).toContain('Hello there');
    editor.value.destroy();
  });
});
