import { Placeholder } from '@tiptap/extension-placeholder';
import { Editor, EditorContent } from '@tiptap/vue-3';
import { mount } from '@vue/test-utils';
import { h, nextTick, type VNodeChild } from 'vue';
import { render } from 'vuemail';
import { DEFAULT_STYLES } from '../utils/default-styles';
import { Heading } from './heading';
import { StarterKit } from './index';

function renderToHtml(content: () => VNodeChild) {
  return render(h({ render: content }), { pretty: true });
}

describe('Heading Node', () => {
  it('renders Vuemail properly', async () => {
    const renderToVueEmail = Heading.config.renderToVueEmail;
    expect(renderToVueEmail).toBeDefined();
    const node = {
      type: 'heading',
      attrs: {
        class: '',
        level: 1,
        style: '',
        ychange: null,
        alignment: 'left',
      },
    };
    expect(
      await renderToHtml(() =>
        renderToVueEmail({
          node,
          style: { ...DEFAULT_STYLES.reset, ...DEFAULT_STYLES.h1 },
          extension: Heading,
        }),
      ),
    ).toMatchSnapshot();
  });
});

describe('Heading node view', () => {
  it('renders the heading level and shows the placeholder of the empty heading with the cursor', async () => {
    const editor = new Editor({
      extensions: [
        StarterKit.configure({ Container: false, TrailingNode: false }),
        Placeholder.configure({
          placeholder: ({ node }) =>
            node.type.name === 'heading' ? `Heading ${node.attrs.level}` : '',
          includeChildren: true,
        }),
      ],
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Title' }],
          },
          { type: 'heading', attrs: { level: 1 } },
        ],
      },
    });
    const wrapper = mount(EditorContent, {
      props: { editor },
      attachTo: document.body,
    });
    await nextTick();

    const [filled, empty] = wrapper.findAll('[data-node-view-wrapper]');
    expect(filled.classes()).toContain('node-heading');
    expect(filled.find('h2.node-h2').text()).toBe('Title');
    expect(empty.find('h1.node-h1').exists()).toBe(true);
    expect(empty.find('h1').attributes('data-placeholder')).toBeUndefined();

    // Only the decorations change here, the node stays the same
    editor.commands.setTextSelection(editor.state.doc.content.size - 1);
    await nextTick();

    expect(empty.classes()).toContain('is-empty');
    expect(empty.find('h1').attributes('data-placeholder')).toBe('Heading 1');

    editor.commands.insertContent('Subject');
    await nextTick();

    expect(empty.find('h1').text()).toBe('Subject');
    expect(empty.find('h1').attributes('data-placeholder')).toBeUndefined();
    expect(editor.getHTML()).toBe(
      '<h2 style="">Title</h2><h1 style="">Subject</h1>',
    );

    wrapper.unmount();
    editor.destroy();
  });
});
