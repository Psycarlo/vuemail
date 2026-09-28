import { render } from '@vuemaildev/vuemail';
import { h, type VNodeChild } from 'vue';
import { DEFAULT_STYLES } from '../utils/default-styles';
import { Body } from './body';

// Resolved style matching snapshot: reset only (no body-specific styles in snapshot)
const bodyStyle = { ...DEFAULT_STYLES.reset };

function renderToHtml(content: () => VNodeChild) {
  return render(h({ render: content }), { pretty: true });
}

describe('Body Node', () => {
  it('renders Vuemail properly', async () => {
    const renderToVueEmail = Body.config.renderToVueEmail;
    expect(renderToVueEmail).toBeDefined();
    expect(
      await renderToHtml(() =>
        renderToVueEmail({
          node: {
            type: 'body',
            attrs: {
              class: 'body-class',
            },
          },
          extension: Body,
          style: bodyStyle,
          children: 'Body content',
        }),
      ),
    ).toMatchSnapshot();
  });
});
