import { hoistTitles } from './hoist-titles';

describe('hoistTitles()', () => {
  it('moves marked titles to the end of the head', () => {
    expect(
      hoistTitles(
        '<html><head><meta name="a"></head><body><title data-vuemail-hoist>Hi</title><p>Text</p></body></html>',
      ),
    ).toBe(
      '<html><head><meta name="a"><title>Hi</title></head><body><p>Text</p></body></html>',
    );
  });

  it('leaves titles in place when there is no head', () => {
    expect(
      hoistTitles('<title data-vuemail-hoist="">Hi</title><p>Text</p>'),
    ).toBe('<title>Hi</title><p>Text</p>');
  });

  it("doesn't touch titles that aren't marked, like the ones of SVG icons", () => {
    const html =
      '<html><head></head><body><svg><title>Icon</title></svg></body></html>';
    expect(hoistTitles(html)).toBe(html);
  });
});
