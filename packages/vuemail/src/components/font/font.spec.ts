import { h } from 'vue';
import { renderMarkup } from '../utils/render-markup';
import { Font } from './font';

describe('<Font> component', () => {
  it('renders with default props', async () => {
    const html = await renderMarkup(
      h(Font, { fallbackFontFamily: 'Helvetica', fontFamily: 'Arial' }),
    );

    expect(html).toContain('font-style: normal;');
    expect(html).toContain('font-weight: 400;');
    expect(html).toContain("font-family: 'Arial';");
  });

  it('renders with webFont prop', async () => {
    const html = await renderMarkup(
      h(Font, {
        fallbackFontFamily: 'Helvetica',
        fontFamily: 'Example',
        webFont: { url: 'example.com/font.woff', format: 'woff' },
      }),
    );

    expect(html).toContain("font-family: 'Example';");
    expect(html).toContain("src: url(example.com/font.woff) format('woff');");
  });

  it('renders with multiple fallback fonts', async () => {
    const html = await renderMarkup(
      h(Font, {
        fallbackFontFamily: ['Helvetica', 'Verdana'],
        fontFamily: 'Arial',
      }),
    );

    expect(html).toContain("font-family: 'Arial', Helvetica, Verdana;");
    expect(html).toContain("mso-font-alt: 'Helvetica';");
  });

  it('renders its CSS into a single, unescaped style tag', async () => {
    const html = await renderMarkup(
      h(Font, {
        fallbackFontFamily: 'Verdana',
        fontFamily: 'Roboto',
        fontWeight: 700,
      }),
    );

    expect(html.startsWith('<style>')).toBe(true);
    expect(html.endsWith('</style>')).toBe(true);
    expect(html).toContain("font-family: 'Roboto', Verdana;");
    expect(html).toContain('font-weight: 700;');
  });
});
