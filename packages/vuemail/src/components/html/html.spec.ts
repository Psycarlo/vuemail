import { h } from 'vue';
import { renderMarkup } from '../utils/render-markup';
import { Html } from './html';

describe('<Html> component', () => {
  it('renders children correctly', async () => {
    const html = await renderMarkup(h(Html, null, () => 'Test message'));
    expect(html).toContain('Test message');
  });

  it('renders correctly', async () => {
    expect(await renderMarkup(h(Html))).toBe(
      '<html dir="ltr" lang="en"></html>',
    );
  });

  it('passes the language, direction and other props through', async () => {
    expect(
      await renderMarkup(
        h(Html, { lang: 'ar', dir: 'rtl', 'data-testid': 'html' }),
      ),
    ).toBe('<html data-testid="html" dir="rtl" lang="ar"></html>');
  });
});
