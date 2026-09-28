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

  it('puts them after the metadata the head starts with, before its styles, like React Email', () => {
    expect(
      hoistTitles(
        '<html><head><meta name="a"><title>Own</title><style>.a{}</style><meta name="b"></head><body><title data-vuemail-hoist="">Hi</title></body></html>',
      ),
    ).toBe(
      '<html><head><meta name="a"><title>Own</title><title>Hi</title><style>.a{}</style><meta name="b"></head><body></body></html>',
    );
  });

  it("doesn't mistake a <header> for the head", () => {
    expect(
      hoistTitles(
        '<html><head></head><body><header><title data-vuemail-hoist>Hi</title></header></body></html>',
      ),
    ).toBe(
      '<html><head><title>Hi</title></head><body><header></header></body></html>',
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
