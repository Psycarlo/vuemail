import { sanitizeUrlAttributes } from './sanitize-url-attributes';

const blocked =
  'javascript:throw new Error(&#39;Vuemail has blocked a javascript: URL as a security precaution.&#39;)';

describe('sanitizeUrlAttributes()', () => {
  it('blocks javascript: URLs in the attributes that take URLs, like React DOM', () => {
    expect(
      sanitizeUrlAttributes(
        '<a href="javascript:alert(1)" style="color:red">x</a><img src="JavaScript:alert(2)" alt="i"><form action="javascript:void(0)"><button formaction="javascript:x()">b</button></form><svg><use xlink:href="javascript:y()"></use></svg>',
      ),
    ).toBe(
      `<a href="${blocked}" style="color:red">x</a><img src="${blocked}" alt="i"><form action="${blocked}"><button formaction="${blocked}">b</button></form><svg><use xlink:href="${blocked}"></use></svg>`,
    );
  });

  it('sees through the obfuscations browsers ignore', () => {
    for (const url of [
      ' \tjava\nscript:alert(1)',
      '\u0001javascript:alert(1)',
      'JAVA\tSCRIPT:alert(1)',
    ]) {
      expect(sanitizeUrlAttributes(`<a href="${url}">x</a>`)).toBe(
        `<a href="${blocked}">x</a>`,
      );
    }
  });

  it('leaves other URLs as they are', () => {
    const html =
      '<a href="https://example.com/?a=1&amp;b=javascript:x">x</a><a href="mailto:a@b.c">m</a><img src="data:image/png;base64,iVBOR" alt=""><a href="#top">t</a>';

    expect(sanitizeUrlAttributes(html)).toBe(html);
  });

  it('leaves out an empty src, and an empty href anywhere but on <a>', () => {
    expect(
      sanitizeUrlAttributes(
        '<img src="" alt="x"><a href="">a</a><link href="" rel="icon"><iframe src=""></iframe>',
      ),
    ).toBe('<img alt="x"><a href="">a</a><link rel="icon"><iframe></iframe>');
    // Vue renders empty values as bare attributes
    expect(sanitizeUrlAttributes('<img src alt><a href>a</a><link href>')).toBe(
      '<img alt><a href>a</a><link>',
    );
  });

  it('leaves comments, text and other attributes alone', () => {
    const html =
      '<!--[if mso]><a href="javascript:x()">o</a><![endif]--><p data-href="javascript:x()" title="src=&quot;&quot;">href=&quot;javascript:x()&quot;</p><style>a > b { color: red }</style>';

    expect(sanitizeUrlAttributes(html)).toBe(html);
  });
});
