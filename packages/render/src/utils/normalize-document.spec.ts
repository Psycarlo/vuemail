import { normalizeDocument } from './normalize-document';

// The expected layouts are the ones React 19 renders React Email's with.
describe('normalizeDocument()', () => {
  it('moves what is between the <head> and the <body> to the start of the <body>', () => {
    expect(
      normalizeDocument(
        '<html lang="en"><head><meta name="a"></head><div data-skip-in-text="true">Preview</div><body dir="ltr"><p>Hi</p></body></html>',
      ),
    ).toBe(
      '<html lang="en"><head><meta name="a"></head><body dir="ltr"><div data-skip-in-text="true">Preview</div><p>Hi</p></body></html>',
    );
  });

  it('keeps the order of what comes before the <head>, between it and the <body>, and after the <body>', () => {
    expect(
      normalizeDocument(
        '<html><p>before</p><head></head><p>between</p><body><p>body</p></body><p>after</p></html>',
      ),
    ).toBe(
      '<html><head></head><body><p>before</p><p>between</p><p>body</p><p>after</p></body></html>',
    );
  });

  it('gives an <html> without a <head> an empty one', () => {
    expect(normalizeDocument('<html dir="ltr" lang="en"></html>')).toBe(
      '<html dir="ltr" lang="en"><head></head></html>',
    );
    expect(normalizeDocument('<html><body><p>x</p></body></html>')).toBe(
      '<html><head></head><body><p>x</p></body></html>',
    );
  });

  it('puts what the <html> holds after the <head> when there is no <body>', () => {
    expect(
      normalizeDocument('<html><div>Preview</div><head></head><p>x</p></html>'),
    ).toBe('<html><head></head><div>Preview</div><p>x</p></html>');
  });

  it('lays out fragments that have a <body>', () => {
    expect(
      normalizeDocument(
        '<head><meta name="a"></head><div>Preview</div><body><p>x</p></body>',
      ),
    ).toBe(
      '<head><meta name="a"></head><body><div>Preview</div><p>x</p></body>',
    );
  });

  it('leaves documents that are laid out already untouched', () => {
    const html =
      '<html><head><style>a>b{color:red}</style></head><body><!--[if mso]><i>x</i><![endif]--><p>x</p></body></html>';
    expect(normalizeDocument(html)).toBe(html);
  });

  it('leaves documents nested inside of the <body> untouched', () => {
    const html =
      '<html><head></head><body><td><html><head><meta name="a"></head><body><p>x</p></body></html></td></body></html>';
    expect(normalizeDocument(html)).toBe(html);
  });

  it('leaves markup without an <html> or a <body> untouched', () => {
    const html = '<title>Hi</title><div>Preview</div><p>x</p>';
    expect(normalizeDocument(html)).toBe(html);
  });
});
