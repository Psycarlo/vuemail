import { h, type VNodeChild } from 'vue';
import { render } from 'vuemail';
import { DEFAULT_STYLES } from '../utils/default-styles';
import { Div } from './div';

const divStyle = { ...DEFAULT_STYLES.reset };

function renderToHtml(content: () => VNodeChild) {
  return render(h({ render: content }), { pretty: true });
}

describe('Div Node', () => {
  it('renders Vuemail properly', async () => {
    const renderToVueEmail = Div.config.renderToVueEmail;
    expect(renderToVueEmail).toBeDefined();
    expect(
      await renderToHtml(() =>
        renderToVueEmail({
          node: {
            type: 'div',
            attrs: {
              class: 'div-class',
            },
          },
          style: divStyle,
          extension: Div,
          children: 'Div content',
        }),
      ),
    ).toMatchSnapshot();
  });
});
