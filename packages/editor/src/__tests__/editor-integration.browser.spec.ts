// Port of upstream's browser (playwright) integration spec. Caret movement
// ({Home}, {End}, clicking into text) goes through the editor's selection.
import type { Content, Editor } from '@tiptap/core';
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import EmailEditor from '../email-editor/email-editor.vue';
import type { EmailEditorRef } from '../email-editor/types';
import {
  focusEditor,
  mod,
  nextFrame,
  pasteHtml,
  pasteText,
  pressKey,
  typeText,
} from './browser-test-helpers';

const htmlTemplate = `
<!doctype html>
<html>
  <body>
    <h1>Pasted heading</h1>
    <p>Pasted body content</p>
  </body>
</html>
`;

const mounted: VueWrapper[] = [];

afterEach(async () => {
  // Some extensions reset attributes in the frame after Enter: let that run
  // before the editor is destroyed.
  await nextFrame();
  await nextFrame();
  for (const wrapper of mounted.splice(0)) {
    wrapper.unmount();
  }
  document.body.innerHTML = '';
});

/** The document position of the start of the first `text` found. */
function findTextPos(editor: Editor, text: string): number {
  let found = -1;
  editor.state.doc.descendants((node, pos) => {
    if (found !== -1) return false;
    if (node.isText && node.text?.includes(text)) {
      found = pos + node.text.indexOf(text);
      return false;
    }
    return true;
  });
  if (found === -1) throw new Error(`"${text}" not found`);
  return found;
}

async function renderEditor(content?: Content) {
  const wrapper = mount(EmailEditor, {
    props: content === undefined ? {} : { content },
    attachTo: document.body,
  });
  mounted.push(wrapper);
  await flushPromises();

  const editor = (wrapper.vm as unknown as EmailEditorRef).editor;
  if (!editor) throw new Error('Editor not ready');
  const editorEl = editor.view.dom as HTMLElement;
  return { wrapper, editor, editorEl };
}

function findButton(name: string) {
  return (
    Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === name,
    ) ?? null
  );
}

describe('editor integration (browser)', () => {
  it('loads and content is editable', async () => {
    const { editor, editorEl } = await renderEditor();

    expect(editorEl.isConnected).toBe(true);
    expect(editorEl.getAttribute('contenteditable')).toBe('true');

    // Type content into the editor
    await focusEditor(editor);
    await typeText('Hello world');

    // Content should be visible
    expect(editorEl.textContent).toContain('Hello world');
  });

  it('slash command opens and inserts a heading', async () => {
    const { editor, editorEl } = await renderEditor();
    await focusEditor(editor);

    // Type "/" to trigger slash command menu
    await typeText('/');
    await flushPromises();

    // The slash command menu should be visible (teleported to the body)
    const titleButton = findButton('Title');
    expect(titleButton).not.toBeNull();
    expect(titleButton?.closest('[data-re-slash-command]')).not.toBeNull();

    // Click "Title" (H1) from the command menu
    titleButton?.click();
    await flushPromises();

    // Menu should close
    expect(findButton('Title')).toBeNull();

    // A heading element should now exist in the editor
    expect(editorEl.innerHTML).toMatch(/<h1/i);

    // Type content into the heading
    await typeText('E2E Heading Content');

    expect(editorEl.textContent).toContain('E2E Heading Content');
  });

  it('slash command inserts a bullet list', async () => {
    const { editor, editorEl } = await renderEditor();
    await focusEditor(editor);

    await typeText('/');
    await flushPromises();

    const bulletListButton = findButton('Bullet list');
    expect(bulletListButton).not.toBeNull();

    bulletListButton?.click();
    await flushPromises();

    expect(findButton('Bullet list')).toBeNull();

    expect(editorEl.innerHTML).toMatch(/<ul/i);

    // Type list items
    await typeText('First item');
    await pressKey('Enter');
    await typeText('Second item');

    expect(editorEl.textContent).toContain('First item');
    expect(editorEl.textContent).toContain('Second item');
  });

  it('filters the slash commands and selects one with the keyboard', async () => {
    const { editor, editorEl } = await renderEditor();
    await focusEditor(editor);

    await typeText('/numbered');
    await flushPromises();

    expect(findButton('Numbered list')).not.toBeNull();
    expect(findButton('Title')).toBeNull();

    await pressKey('Enter');
    await flushPromises();

    expect(findButton('Numbered list')).toBeNull();
    expect(editorEl.innerHTML).toMatch(/<ol/i);
    expect(editorEl.textContent).not.toContain('/numbered');
  });

  it('applies text formatting via keyboard shortcuts', async () => {
    const { editor, editorEl } = await renderEditor();
    await focusEditor(editor);

    // Type and apply bold
    await typeText('Bold text');
    await pressKey('a', [mod]);
    await pressKey('b', [mod]);

    expect(editorEl.innerHTML).toMatch(/<strong/i);

    // Move to end, new line, type and apply italic
    await focusEditor(editor, 'end');
    await pressKey('Enter');
    await typeText('Italic text');
    await pressKey('a', [mod]);
    await pressKey('i', [mod]);

    expect(editorEl.innerHTML).toMatch(/<em/i);

    // Move to end, new line, type and apply underline
    await focusEditor(editor, 'end');
    await pressKey('Enter');
    await typeText('Underlined text');
    await pressKey('a', [mod]);
    await pressKey('u', [mod]);

    expect(editorEl.innerHTML).toMatch(/<u[ >]/i);
  });

  it('pasting plain text into an empty editor inserts text', async () => {
    const { editor, editorEl } = await renderEditor();
    await focusEditor(editor);

    pasteText(editorEl, 'hello world');

    expect(editorEl.textContent).toContain('hello world');
  });

  it('pasting plain text into a non-empty editor appends text', async () => {
    const { editor, editorEl } = await renderEditor();
    await focusEditor(editor);
    await typeText('existing');

    pasteText(editorEl, ' plus pasted');

    expect(editorEl.textContent).toContain('existing plus pasted');
  });

  it('pressing Enter mid-paragraph preserves the paragraph style and class', async () => {
    const { editor, editorEl } = await renderEditor({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: { style: 'font-size: 24px', class: 'lead' },
          content: [{ type: 'text', text: 'Hello world' }],
        },
      ],
    });

    // Click into "Hello world", {Home}, then {ArrowRight} five times
    await focusEditor(editor, findTextPos(editor, 'Hello world') + 5);
    await pressKey('Enter');

    await nextFrame();
    await nextFrame();

    const paragraphs = Array.from(editorEl.querySelectorAll('p')).filter(
      (paragraph) => paragraph.textContent,
    );
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0].textContent).toContain('Hello');
    expect(paragraphs[1].textContent).toContain('world');
    for (const paragraph of paragraphs) {
      expect(paragraph.style.fontSize).toBe('24px');
      expect(paragraph.classList.contains('lead')).toBe(true);
    }
  });

  it('pressing Enter at the end of a paragraph resets style and class on the new paragraph', async () => {
    const { editor, editorEl } = await renderEditor({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: { style: 'font-size: 24px', class: 'lead' },
          content: [{ type: 'text', text: 'Hello world' }],
        },
      ],
    });

    // Click into "Hello world", then {End}
    await focusEditor(
      editor,
      findTextPos(editor, 'Hello world') + 'Hello world'.length,
    );
    await pressKey('Enter');

    await nextFrame();
    await nextFrame();

    const paragraphs = Array.from(editorEl.querySelectorAll('p'));
    expect(paragraphs.length).toBeGreaterThanOrEqual(2);

    const [styled, fresh] = paragraphs;
    expect(styled.textContent).toContain('Hello world');
    expect(styled.style.fontSize).toBe('24px');
    expect(styled.classList.contains('lead')).toBe(true);

    expect(fresh.textContent).toBe('');
    expect(fresh.style.fontSize).toBe('');
    expect(fresh.classList.contains('lead')).toBe(false);
  });

  it('pressing Enter after a completed placeholder still resets the style on the new paragraph', async () => {
    const text = 'Hi {{{contact.email}}}';
    const { editor, editorEl } = await renderEditor({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: { style: 'font-size: 24px' },
          content: [{ type: 'text', text }],
        },
      ],
    });

    // Click into the text, then {End}
    await focusEditor(editor, findTextPos(editor, text) + text.length);
    await pressKey('Enter');

    await nextFrame();
    await nextFrame();

    const paragraphs = Array.from(editorEl.querySelectorAll('p'));
    expect(paragraphs.length).toBeGreaterThanOrEqual(2);

    const [styled, fresh] = paragraphs;
    expect(styled.textContent).toContain('{{{contact.email}}}');
    expect(styled.style.fontSize).toBe('24px');

    expect(fresh.textContent).toBe('');
    expect(fresh.style.fontSize).toBe('');
  });

  it('pasting HTML into a non-empty document preserves existing content', async () => {
    const { editor, editorEl } = await renderEditor({
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Existing heading' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Existing paragraph' }],
        },
      ],
    });

    // Click on the paragraph text to place cursor there, then move to end
    await focusEditor(editor, 'end');

    pasteHtml(editorEl, htmlTemplate);

    // The original content should still be present
    expect(editorEl.textContent).toContain('Existing heading');
    expect(editorEl.textContent).toContain('Existing paragraph');

    // The pasted content should also appear
    expect(editorEl.textContent).toContain('Pasted heading');
    expect(editorEl.textContent).toContain('Pasted body content');
  });
});
