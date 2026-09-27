// Port of upstream's browser (playwright) spec.
import { NodeSelection, TextSelection } from '@tiptap/pm/state';
import { flushPromises, mount } from '@vue/test-utils';
import { vi } from 'vitest';
import { h } from 'vue';
import EmailEditor from '../email-editor/email-editor.vue';
import type { EmailEditorRef } from '../email-editor/types';
import { Inspector, type InspectorBreadcrumbSegment } from '../ui/inspector';
import { nextFrame, pressKey } from './browser-test-helpers';

const CONTENT = {
  type: 'doc',
  content: [
    {
      type: 'twoColumns',
      attrs: {
        cellspacing: 8,
      },
      content: [
        {
          type: 'columnsColumn',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Column A' }],
            },
          ],
        },
        {
          type: 'columnsColumn',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Column B' }],
            },
          ],
        },
      ],
    },
  ],
};

function renderHarness() {
  return mount(EmailEditor, {
    props: { content: CONTENT },
    slots: {
      default: () =>
        h(Inspector.Root, { 'data-testid': 'inspector' }, () => [
          h(Inspector.Breadcrumb, null, {
            default: ({
              segments,
            }: {
              segments: InspectorBreadcrumbSegment[];
            }) =>
              h(
                'nav',
                { 'aria-label': 'Inspector breadcrumb' },
                segments.map((segment) =>
                  h(
                    'button',
                    {
                      type: 'button',
                      key: `${segment.node.nodeType}-${segment.node.nodePos.pos}`,
                      'data-node-type': segment.node.nodeType,
                      onClick: segment.focus,
                    },
                    segment.node.nodeType,
                  ),
                ),
              ),
          }),
          h(Inspector.Node),
        ]),
    },
    attachTo: document.body,
  });
}

function getEditorRef(wrapper: ReturnType<typeof renderHarness>) {
  return wrapper.vm as unknown as EmailEditorRef;
}

function findNodePos(editorRef: EmailEditorRef | null, nodeType: string) {
  const editor = editorRef?.editor;
  if (!editor) throw new Error('Editor not ready');

  let nodePos = -1;
  editor.state.doc.descendants((node, pos) => {
    if (nodePos === -1 && node.type.name === nodeType) {
      nodePos = pos;
      return false;
    }
    return true;
  });

  if (nodePos === -1) throw new Error(`${nodeType} not found`);
  return nodePos;
}

function selectFirstParagraphText(editorRef: EmailEditorRef | null) {
  const editor = editorRef?.editor;
  if (!editor) throw new Error('Editor not ready');

  const paragraphPos = findNodePos(editorRef, 'paragraph');
  editor.view.focus();
  editor.view.dispatch(
    editor.state.tr.setSelection(
      TextSelection.create(editor.state.doc, paragraphPos + 1),
    ),
  );
}

async function waitForColumnsSection() {
  return vi.waitFor(() => {
    const inspector = document.querySelector<HTMLElement>(
      '[data-testid="inspector"]',
    );
    if (!inspector) throw new Error('Inspector not rendered yet');

    const header = Array.from(
      inspector.querySelectorAll<HTMLElement>(
        '[data-re-inspector-section-header]',
      ),
    ).find((h) => h.textContent?.includes('Column spacing'));
    const section = header?.closest<HTMLElement>('[data-re-inspector-section]');
    if (!section) throw new Error('Columns section not rendered yet');
    return section;
  });
}

describe('inspector column spacing input (browser)', () => {
  it('edits the selected column layout cellspacing attribute', async () => {
    const wrapper = renderHarness();
    await flushPromises();
    const editorRef = getEditorRef(wrapper);

    const editorElement = document.querySelector('[contenteditable]');
    expect(editorElement?.isConnected).toBe(true);

    selectFirstParagraphText(editorRef);

    const columnsBreadcrumb = await vi.waitFor(() => {
      const button = document.querySelector<HTMLButtonElement>(
        '[data-node-type="twoColumns"]',
      );
      if (!button) throw new Error('Columns breadcrumb not rendered yet');
      return button;
    });
    columnsBreadcrumb.click();

    await vi.waitFor(() => {
      const selection = editorRef.editor?.state.selection;
      expect(selection).toBeInstanceOf(NodeSelection);
      expect((selection as NodeSelection).node.type.name).toBe('twoColumns');
    });

    const section = await waitForColumnsSection();
    const input = section.querySelector<HTMLInputElement>(
      'input[data-re-inspector-input]',
    );
    if (!input) throw new Error('Column spacing input not rendered yet');

    expect(input.value).toBe('8');

    input.focus();
    await pressKey('ArrowUp');

    await vi.waitFor(() => {
      const columnsPos = findNodePos(editorRef, 'twoColumns');
      const columnsNode = editorRef.editor?.state.doc.nodeAt(columnsPos);
      expect(columnsNode?.attrs.cellspacing).toBe(9);
    });

    const selection = editorRef.editor?.state.selection;
    expect(selection).toBeInstanceOf(NodeSelection);
    expect((selection as NodeSelection).node.type.name).toBe('twoColumns');

    await nextFrame();
    wrapper.unmount();
  });
});
