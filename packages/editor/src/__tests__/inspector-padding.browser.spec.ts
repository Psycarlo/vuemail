// Port of upstream's browser (playwright) spec. Clicking moves
// the focus in a browser: here the element is focused before it's clicked.
import { NodeSelection } from '@tiptap/pm/state';
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { vi } from 'vitest';
import { h } from 'vue';
import EmailEditor from '../email-editor/email-editor.vue';
import type { EmailEditorRef } from '../email-editor/types';
import { Inspector } from '../ui/inspector';
import { nextFrame, pressKey, typeText } from './browser-test-helpers';

const CONTENT = {
  type: 'doc',
  content: [
    {
      type: 'section',
      attrs: {
        style:
          'padding-top: 44px; padding-right: 44px; padding-bottom: 44px; padding-left: 44px;',
      },
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Inside section' }],
        },
      ],
    },
  ],
};

const mounted: VueWrapper[] = [];

afterEach(async () => {
  await nextFrame();
  for (const wrapper of mounted.splice(0)) {
    wrapper.unmount();
  }
  document.body.innerHTML = '';
});

async function renderHarness(
  content: typeof CONTENT,
  { withOutsideButton = true } = {},
): Promise<EmailEditorRef> {
  let editorRef: EmailEditorRef | null = null;
  const wrapper = mount(
    {
      render: () => [
        h(
          EmailEditor,
          {
            content,
            onReady: (ref: EmailEditorRef) => {
              editorRef = ref;
            },
          },
          () =>
            h(Inspector.Root, { 'data-testid': 'inspector' }, () =>
              h(Inspector.Node),
            ),
        ),
        withOutsideButton
          ? h('button', { type: 'button' }, 'Outside editor')
          : null,
      ],
    },
    { attachTo: document.body },
  );
  mounted.push(wrapper);
  await flushPromises();
  if (!editorRef) throw new Error('Editor not ready');
  return editorRef;
}

function getOutsideButton() {
  const button = Array.from(document.querySelectorAll('button')).find(
    (b) => b.textContent === 'Outside editor',
  );
  if (!button) throw new Error('Outside button not rendered');
  return button;
}

/** Clicking a button focuses it in a browser, before the click itself. */
function click(element: HTMLElement) {
  element.focus();
  element.click();
}

function selectSectionNode(editorRef: EmailEditorRef | null) {
  const editor = editorRef?.editor;
  if (!editor) throw new Error('Editor not ready');
  let sectionPos = -1;
  editor.state.doc.descendants((node, pos) => {
    if (sectionPos === -1 && node.type.name === 'section') {
      sectionPos = pos;
      return false;
    }
    return true;
  });
  if (sectionPos === -1) throw new Error('Section not found');
  editor.view.focus();
  const selection = NodeSelection.create(editor.state.doc, sectionPos);
  editor.view.dispatch(editor.state.tr.setSelection(selection));
}

async function waitForSpacingSection() {
  return vi.waitFor(() => {
    const inspector = document.querySelector<HTMLElement>(
      '[data-testid="inspector"]',
    );
    if (!inspector) throw new Error('Inspector not rendered yet');
    const header = Array.from(
      inspector.querySelectorAll<HTMLElement>(
        '[data-re-inspector-section-header]',
      ),
    ).find((h) => h.textContent?.includes('Spacing'));
    const section = header?.closest<HTMLElement>('[data-re-inspector-section]');
    if (!section) throw new Error('Spacing section not rendered yet');
    return section;
  });
}

async function waitForPaddingInputWithValue(expected: string) {
  return vi.waitFor(async () => {
    const spacing = await waitForSpacingSection();
    const input = spacing.querySelector<HTMLInputElement>(
      'input[data-re-inspector-input]',
    );
    if (!input) throw new Error('Padding input not rendered yet');
    if (input.value !== expected) {
      throw new Error(`expected ${expected}, got ${input.value}`);
    }
    return input;
  });
}

function getPerSidePaddingButton(spacing: HTMLElement) {
  const tooltip = Array.from(
    spacing.querySelectorAll<HTMLElement>('[data-re-inspector-tooltip]'),
  ).find((el) => el.textContent?.includes('Per side'));
  const button = tooltip?.querySelector<HTMLButtonElement>(
    '[data-re-inspector-toggle-item]',
  );
  if (!button) throw new Error('Per side padding button not rendered yet');
  return button;
}

describe('inspector padding input (browser)', () => {
  it('keeps the same value after focus + blur', async () => {
    const editorRef = await renderHarness(CONTENT);

    selectSectionNode(editorRef);

    const paddingInput = await waitForPaddingInputWithValue('44');

    paddingInput.focus();
    expect(document.activeElement).toBe(paddingInput);

    paddingInput.blur();
    expect(document.activeElement).not.toBe(paddingInput);

    // The value must still be "44" — not reset to "0".
    expect(paddingInput.value).toBe('44');
  });

  it('keeps a newly committed value after a subsequent focus + blur', async () => {
    const editorRef = await renderHarness(CONTENT);

    selectSectionNode(editorRef);

    const paddingInput = await waitForPaddingInputWithValue('44');

    paddingInput.focus();
    paddingInput.select();
    // Typing "12" over the selection
    await typeText('12');
    await pressKey('Enter');

    await vi.waitFor(() => {
      if (paddingInput.value !== '12') {
        throw new Error(`expected 12, got ${paddingInput.value}`);
      }
    });

    paddingInput.focus();
    paddingInput.blur();

    expect(paddingInput.value).toBe('12');
  });

  it('keeps focus after expanding padding controls, then blurs on an outside click', async () => {
    const editorRef = await renderHarness(CONTENT);

    selectSectionNode(editorRef);

    const editor = editorRef.editor;
    if (!editor) throw new Error('Editor not ready');
    expect(editor.isFocused).toBe(true);

    const spacing = await waitForSpacingSection();
    const perSideButton = getPerSidePaddingButton(spacing);
    click(perSideButton);
    // Expanding the controls replaces the focused toggle. Chromium then fires a
    // `focusout` without a `relatedTarget` on it (which the focus scopes
    // recover from), happy-dom fires nothing: dispatch it like Chromium.
    perSideButton.dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: null }),
    );

    await vi.waitFor(() => {
      const inputs = spacing.querySelectorAll<HTMLInputElement>(
        'input[data-re-inspector-input]',
      );
      if (inputs.length < 4) {
        throw new Error('Per-side padding inputs not rendered yet');
      }
    });

    expect(editor.isFocused).toBe(true);

    click(getOutsideButton());

    await vi.waitFor(() => {
      if (editor.isFocused) {
        throw new Error('Editor is still focused');
      }
    });

    expect(editor.isFocused).toBe(false);
  });

  it('blurs the editor when focus moves outside the editor and inspector', async () => {
    const editorRef = await renderHarness(CONTENT);

    selectSectionNode(editorRef);

    const editor = editorRef.editor;
    if (!editor) throw new Error('Editor not ready');
    expect(editor.isFocused).toBe(true);

    click(getOutsideButton());

    await vi.waitFor(() => {
      if (editor.isFocused) {
        throw new Error('Editor is still focused');
      }
    });

    expect(editor.isFocused).toBe(false);
  });
});

const HSL_CONTENT = {
  type: 'doc',
  content: [
    {
      type: 'section',
      attrs: {
        style: 'background-color: hsl(200, 50%, 40%);',
      },
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Inside section' }],
        },
      ],
    },
  ],
};

async function waitForBackgroundSection() {
  return vi.waitFor(() => {
    const inspector = document.querySelector<HTMLElement>(
      '[data-testid="inspector"]',
    );
    if (!inspector) throw new Error('Inspector not rendered yet');
    const header = Array.from(
      inspector.querySelectorAll<HTMLElement>(
        '[data-re-inspector-section-header]',
      ),
    ).find((h) => h.textContent?.includes('Background'));
    const section = header?.closest<HTMLElement>('[data-re-inspector-section]');
    if (!section) throw new Error('Background section not rendered yet');
    return section;
  });
}

describe('inspector background color input (browser)', () => {
  it('does not strip % from HSL color values at parse time', async () => {
    const editorRef = await renderHarness(HSL_CONTENT, {
      withOutsideButton: false,
    });

    selectSectionNode(editorRef);

    const hexInput = await vi.waitFor(() => {
      const bg = document.querySelector<HTMLElement>(
        '[data-testid="inspector"]',
      );
      if (!bg) throw new Error('Inspector not rendered yet');
      return waitForBackgroundSection().then((section) => {
        const input = section.querySelector<HTMLInputElement>(
          'input[data-re-inspector-color-hex]',
        );
        if (!input) throw new Error('Color hex input not rendered yet');
        if (input.value === '') {
          throw new Error('Color hex input not populated yet');
        }
        return input;
      });
    });

    expect(hexInput.value).toBe('hsl(200, 50%, 40%)');
  });
});
