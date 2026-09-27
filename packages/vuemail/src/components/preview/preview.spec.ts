import { h } from 'vue';
import { renderMarkup } from '../utils/render-markup';
import Interpolated from './fixtures/interpolated.vue';
import { Preview, renderWhiteSpace } from './preview';

const whiteSpaceCharacters = '\xa0‌​‍‎‏﻿';
const hiddenStyle =
  'display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0';

describe('<Preview> component', () => {
  it('renders correctly', async () => {
    const text = 'Email preview text';
    expect(await renderMarkup(h(Preview, null, () => text))).toBe(
      `<title>${text}</title><div data-skip-in-text="true" style="${hiddenStyle}">${text}<div>${whiteSpaceCharacters.repeat(200 - text.length)}</div></div>`,
    );
  });

  it('joins the text of all of its children', async () => {
    const html = await renderMarkup(
      h(Preview, null, () => ['Email ', 'preview ', 'text']),
    );
    expect(html).toContain('<title>Email preview text</title>');
  });

  it('reads text interpolated in a template', async () => {
    const html = await renderMarkup(h(Interpolated, { name: 'Ana' }));
    expect(html).toContain('<title>Welcome, Ana!</title>');
    expect(html).toContain('>Welcome, Ana!<div>');
  });

  it('truncates text longer than 200 characters', async () => {
    const longText = 'really long'.repeat(50);
    const html = await renderMarkup(h(Preview, null, () => longText));

    expect(html).toBe(
      `<title>${longText.slice(0, 200)}</title><div data-skip-in-text="true" style="${hiddenStyle}">${longText.slice(0, 200)}</div>`,
    );
  });

  it('can leave the title tag out', async () => {
    const html = await renderMarkup(
      h(Preview, { useTitleTag: false }, () => 'Email preview text'),
    );
    expect(html).not.toContain('<title>');
  });

  describe('renderWhiteSpace', () => {
    it('renders nothing when the text is at least 200 characters long', () => {
      expect(renderWhiteSpace('a'.repeat(200))).toBeNull();
    });

    it('fills the rest of the 200 characters with white space', () => {
      const text = 'Short text';
      const node = renderWhiteSpace(text);

      expect(node?.children).toBe(
        whiteSpaceCharacters.repeat(200 - text.length),
      );
    });
  });
});
