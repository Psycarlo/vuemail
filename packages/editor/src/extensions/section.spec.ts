import { h, type VNodeChild } from 'vue';
import { render } from 'vuemail';
import { DEFAULT_STYLES } from '../utils/default-styles';
import { Section } from './section';

// Resolved style matching snapshot: section only (text-align from getTextAlignment in component)
const sectionStyle = { ...DEFAULT_STYLES.section };

function renderToHtml(content: () => VNodeChild) {
  return render(h({ render: content }), { pretty: true });
}

describe('Section Node', () => {
  it('renders Vuemail properly', async () => {
    const renderToVueEmail = Section.config.renderToVueEmail;
    expect(renderToVueEmail).toBeDefined();
    expect(
      await renderToHtml(() =>
        renderToVueEmail({
          node: {
            type: 'section',
            attrs: {
              class: 'node-section',
              alignment: 'center',
            },
          },
          style: sectionStyle,
          extension: Section,
          children: 'Section content',
        }),
      ),
    ).toMatchSnapshot();
  });
});
