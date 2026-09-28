import { render } from '@vuemaildev/vuemail';
import { h, type VNodeChild } from 'vue';
import { DEFAULT_STYLES } from '../utils/default-styles';
import { Button } from './button';

const buttonStyle = { ...DEFAULT_STYLES.reset, ...DEFAULT_STYLES.button };

function renderToHtml(content: () => VNodeChild) {
  return render(h({ render: content }), { pretty: true });
}

describe('EditorButton Node', () => {
  it('renders Vuemail properly', async () => {
    const renderToVueEmail = Button.config.renderToVueEmail;
    expect(renderToVueEmail).toBeDefined();
    expect(
      await renderToHtml(() =>
        renderToVueEmail({
          node: {
            type: 'button',
            attrs: {
              class: 'button',
              href: 'https://example.com',
              alignment: 'center',
            },
          },
          style: buttonStyle,
          extension: Button,
          children: 'Click me',
        }),
      ),
    ).toMatchSnapshot();
  });
});
