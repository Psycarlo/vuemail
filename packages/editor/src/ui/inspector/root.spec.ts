// Port of upstream's `root.spec.ts` (computePathFromRoot) and `root.spec.tsx`
// (focus scope compatibility), merged as both would be `root.spec.ts` here.
import { Editor, type Extensions } from '@tiptap/core';
import TipTapStarterKit from '@tiptap/starter-kit';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { defineComponent, h, shallowRef } from 'vue';
import { provideCurrentEditor } from '../../email-editor/use-current-editor';
import { StarterKit } from '../../extensions';
import { focusScopePluginKey } from '../../extensions/focus-scopes';
import { EmailTheming } from '../../plugins';
import { EditorFocusScopeProvider } from '../editor-focus-scope';
import { computePathFromRoot, type FocusedNode, InspectorRoot } from './root';

const BODY: FocusedNode = {
  nodeType: 'body',
  nodeAttrs: {},
  nodePos: { pos: 0, inside: 0 },
};

let editor: Editor | null = null;
let element: HTMLElement | null = null;

afterEach(() => {
  editor?.destroy();
  editor = null;
  element?.remove();
  element = null;
});

function findNodePos(editor: Editor, nodeType: string): number {
  let pos = -1;
  editor.state.doc.descendants((node, position) => {
    if (pos === -1 && node.type.name === nodeType) {
      pos = position;
      return false;
    }
    return true;
  });
  return pos;
}

describe('computePathFromRoot', () => {
  function createEditor(content: unknown) {
    editor = new Editor({
      extensions: [StarterKit, EmailTheming],
      content: content as string,
    });
    return editor;
  }

  it('returns [] when editor is null', () => {
    expect(computePathFromRoot(null, BODY)).toEqual([]);
  });

  it('prepends synthetic body for typical content (no body PM node)', () => {
    const editor = createEditor('<p>hello</p>');
    const paragraphPos = findNodePos(editor, 'paragraph');
    const target: FocusedNode = {
      nodeType: 'paragraph',
      nodeAttrs: {},
      nodePos: { pos: paragraphPos, inside: paragraphPos },
    };

    const path = computePathFromRoot(editor, target);

    expect(path.map((n) => n.nodeType)).toEqual(['body', 'paragraph']);
    expect(path[0].nodeAttrs).toEqual({});
  });

  it('does not duplicate body when hierarchy already contains a real body node', () => {
    const editor = createEditor({
      type: 'doc',
      content: [
        {
          type: 'body',
          attrs: { class: 'real-body' },
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'hi' }] },
          ],
        },
      ],
    });
    const paragraphPos = findNodePos(editor, 'paragraph');
    const target: FocusedNode = {
      nodeType: 'paragraph',
      nodeAttrs: {},
      nodePos: { pos: paragraphPos, inside: paragraphPos },
    };

    const path = computePathFromRoot(editor, target);

    expect(path.map((n) => n.nodeType)).toEqual(['body', 'paragraph']);
    // Body entry should be the real PM body (with its real attrs), not the
    // synthetic empty-attrs one.
    expect(path[0].nodeAttrs.class).toBe('real-body');
  });

  it('returns just [body] when target is the body FocusedNode', () => {
    const editor = createEditor('<p>hi</p>');
    const target: FocusedNode = {
      nodeType: 'body',
      nodeAttrs: {},
      nodePos: { pos: 0, inside: 0 },
    };

    const path = computePathFromRoot(editor, target);

    expect(path.map((n) => n.nodeType)).toEqual(['body']);
  });

  it('prepends synthetic body for text targets', () => {
    const editor = createEditor('<p>hello world</p>');
    editor.commands.setTextSelection(2);

    const path = computePathFromRoot(editor, 'text');

    expect(path[0].nodeType).toBe('body');
    expect(path.filter((n) => n.nodeType === 'body')).toHaveLength(1);
  });
});

describe('InspectorRoot focus scope compatibility', () => {
  function createEditor(extensions: Extensions) {
    element = document.createElement('div');
    document.body.append(element);

    editor = new Editor({
      element,
      extensions,
      content: '<p>Hello world</p>',
    });

    return editor;
  }

  function countFocusScopePlugins(editor: Editor) {
    return editor.state.plugins.filter(
      (plugin) => plugin.spec.key === focusScopePluginKey,
    ).length;
  }

  /** Provides the editor, like `EditorContext.Provider` does in React. */
  function mountWithEditor(editor: Editor, render: () => ReturnType<typeof h>) {
    const EditorHost = defineComponent({
      setup() {
        provideCurrentEditor(shallowRef(editor) as never);
        return render;
      },
    });
    return mount(EditorHost, { attachTo: document.body });
  }

  it('installs focus scope tracking when the editor does not use StarterKit', () => {
    const editor = createEditor([TipTapStarterKit, EmailTheming]);

    const wrapper = mountWithEditor(editor, () =>
      h(InspectorRoot, { 'data-testid': 'inspector' }, () => 'Inspector'),
    );

    const inspector = wrapper.get('[data-testid="inspector"]').element;
    expect(inspector.tagName).toBe('ASIDE');
    editor.view.dom.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    editor.view.dom.dispatchEvent(
      new FocusEvent('focusout', {
        bubbles: true,
        relatedTarget: inspector,
      }),
    );
    inspector.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

    expect(countFocusScopePlugins(editor)).toBe(1);
    expect(editor.isFocused).toBe(true);

    wrapper.unmount();
  });

  it('does not duplicate focus scope tracking when StarterKit already provides it', () => {
    const editor = createEditor([StarterKit.configure(), EmailTheming]);
    expect(countFocusScopePlugins(editor)).toBe(1);

    const wrapper = mountWithEditor(editor, () =>
      h(InspectorRoot, { 'data-testid': 'inspector' }, () => 'Inspector'),
    );

    expect(countFocusScopePlugins(editor)).toBe(1);

    wrapper.unmount();
    expect(countFocusScopePlugins(editor)).toBe(1);
  });

  it('does not duplicate focus scope tracking with an ancestor provider', () => {
    const editor = createEditor([TipTapStarterKit, EmailTheming]);

    const wrapper = mountWithEditor(editor, () =>
      h(EditorFocusScopeProvider, null, () =>
        h(InspectorRoot, { 'data-testid': 'inspector' }, () => 'Inspector'),
      ),
    );

    expect(countFocusScopePlugins(editor)).toBe(1);

    wrapper.unmount();
  });

  it('renders its only child with the inspector attributes with asChild', () => {
    const editor = createEditor([StarterKit.configure(), EmailTheming]);

    const wrapper = mountWithEditor(editor, () =>
      h(InspectorRoot, { asChild: true, 'data-testid': 'inspector' }, () =>
        h('section', 'Inspector'),
      ),
    );

    const inspector = wrapper.get('[data-testid="inspector"]').element;
    expect(inspector.tagName).toBe('SECTION');
    expect(inspector.getAttribute('tabindex')).toBe('-1');

    wrapper.unmount();
  });
});
