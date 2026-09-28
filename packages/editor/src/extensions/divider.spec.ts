import { Editor } from '@tiptap/core';
import { EditorContent, Editor as VueEditor } from '@tiptap/vue-3';
import { mount } from '@vue/test-utils';
import { render } from '@vuemaildev/vuemail';
import { h, nextTick, type VNodeChild } from 'vue';
import { DEFAULT_STYLES } from '../utils/default-styles';
import { Divider } from './divider';
import { StarterKit } from './index';

function renderToHtml(content: () => VNodeChild) {
  return render(h({ render: content }), { pretty: true });
}

function createDividerEditor() {
  const element = document.createElement('div');
  document.body.append(element);
  return new Editor({
    element,
    extensions: [
      StarterKit.configure({ Container: false, TrailingNode: false }),
    ],
    content: {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Before' }] },
        { type: 'horizontalRule', attrs: { class: 'divider' } },
        { type: 'paragraph', content: [{ type: 'text', text: 'After' }] },
      ],
    },
  });
}

function getHrPosition(editor: Editor): number {
  let pos = -1;
  editor.state.doc.descendants((node, p) => {
    if (node.type.name === 'horizontalRule') pos = p;
  });
  return pos;
}

describe('Divider Node', () => {
  it('renders Vuemail properly', async () => {
    const renderToVueEmail = Divider.config.renderToVueEmail;
    expect(renderToVueEmail).toBeDefined();
    const node = {
      type: 'horizontalRule',
      attrs: {
        class: 'divider',
        style: '',
      },
    };
    expect(
      await renderToHtml(() =>
        renderToVueEmail({
          node,
          style: { ...DEFAULT_STYLES.hr },
          extension: Divider,
        }),
      ),
    ).toMatchSnapshot();
  });
});

describe('Divider node selection protection', () => {
  it('does not replace the divider when typing while it is node-selected', () => {
    const editor = createDividerEditor();
    const hrPos = getHrPosition(editor);
    editor.commands.setNodeSelection(hrPos);

    const { state } = editor;
    const para = state.schema.nodes.paragraph.createAndFill(
      null,
      state.schema.text('a'),
    )!;
    editor.view.dispatch(state.tr.replaceSelectionWith(para));

    expect(
      editor.getJSON().content?.some((n) => n.type === 'horizontalRule'),
    ).toBe(true);

    editor.destroy();
  });

  it('still deletes the divider when Backspace is pressed while it is node-selected', () => {
    const editor = createDividerEditor();
    const hrPos = getHrPosition(editor);
    editor.commands.setNodeSelection(hrPos);

    const event = new KeyboardEvent('keydown', {
      key: 'Backspace',
      bubbles: true,
      cancelable: true,
    });
    editor.view.someProp('handleKeyDown', (f) => f(editor.view, event));

    expect(
      editor.getJSON().content?.some((n) => n.type === 'horizontalRule'),
    ).toBe(false);

    editor.destroy();
  });
});

describe('Divider node view', () => {
  it('renders the divider with its inline styles', async () => {
    const editor = new VueEditor({
      extensions: [
        StarterKit.configure({ Container: false, TrailingNode: false }),
      ],
      content: {
        type: 'doc',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Before' }] },
          {
            type: 'horizontalRule',
            attrs: { class: 'divider', style: 'margin-top: 12px' },
          },
        ],
      },
    });
    const wrapper = mount(EditorContent, {
      props: { editor },
      attachTo: document.body,
    });
    await nextTick();

    const nodeView = wrapper.find('[data-node-view-wrapper]');
    expect(nodeView.classes()).toContain('node-horizontalRule');
    const hr = nodeView.find('hr');
    expect(hr.classes()).toEqual(['node-hr']);
    expect(hr.attributes('style')).toContain('margin-top: 12px');

    wrapper.unmount();
    editor.destroy();
  });
});
