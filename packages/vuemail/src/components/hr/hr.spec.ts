import { h } from 'vue';
import { renderMarkup } from '../utils/render-markup';
import { Hr } from './hr';

describe('<Hr> component', () => {
  it('passes style and other props correctly', async () => {
    const html = await renderMarkup(
      h(Hr, {
        'data-testid': 'hr-test',
        style: { borderTop: '2px solid red' },
      }),
    );
    expect(html).toContain('border-top:2px solid red');
    expect(html).toContain('data-testid="hr-test"');
  });

  it('renders correctly', async () => {
    expect(await renderMarkup(h(Hr))).toBe(
      '<hr style="width:100%;border:none;border-color:transparent;border-top:1px solid #eaeaea">',
    );
  });
});
