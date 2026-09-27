import { h } from 'vue';
import { renderMarkup } from '../utils/render-markup';
import { Img } from './img';

describe('<Img> component', () => {
  it('passes style and other props correctly', async () => {
    const html = await renderMarkup(
      h(Img, {
        'data-testid': 'img-test',
        src: 'cat.jpg',
        alt: 'Cat',
        width: '300',
        height: '300',
        style: { backgroundColor: 'red', border: 'solid 1px black' },
      }),
    );
    expect(html).toContain(
      'style="display:block;outline:none;border:solid 1px black;text-decoration:none;background-color:red"',
    );
    expect(html).toContain('data-testid="img-test"');
  });

  it('renders correctly', async () => {
    expect(
      await renderMarkup(
        h(Img, { src: 'cat.jpg', alt: 'Cat', width: '300', height: '300' }),
      ),
    ).toBe(
      '<img src="cat.jpg" width="300" height="300" alt="Cat" style="display:block;outline:none;border:none;text-decoration:none">',
    );
  });

  it('always renders an alt text, so that screen readers skip decorative images', async () => {
    // Vue renders empty attributes without a value, which HTML reads as empty
    expect(await renderMarkup(h(Img, { src: 'cat.jpg' }))).toMatch(/ alt /);
  });
});
