import { h } from 'vue';
import { renderMarkup } from '../utils/render-markup';
import { CodeBlock } from './code-block';
import { dracula } from './themes';

describe('<CodeBlock> component', () => {
  it('highlights each token with the styles of the theme', async () => {
    const html = await renderMarkup(
      h(CodeBlock, {
        code: 'const answer = 42;',
        language: 'javascript',
        theme: dracula,
      }),
    );

    expect(html).toMatch(/^<pre style="[^"]*width:100%[^"]*"><code>/);
    expect(html).toContain(
      `<span style="${`color:${dracula.keyword?.color}`}">const</span>`,
    );
    expect(html).toContain(
      `<span style="${`color:${dracula.number?.color}`}">42</span>`,
    );
    expect(html).toContain('<br></code></pre>');
  });

  it('renders line numbers with the font family it is given', async () => {
    const html = await renderMarkup(
      h(CodeBlock, {
        code: 'a\nb',
        language: 'javascript',
        theme: dracula,
        lineNumbers: true,
        fontFamily: 'monospace',
      }),
    );

    expect(html).toContain(
      '<span style="width:2em;height:1em;display:inline-block;font-family:monospace">1</span>',
    );
    expect(html).toContain(
      '<span style="width:2em;height:1em;display:inline-block;font-family:monospace">2</span>',
    );
  });

  it('keeps the spacing of the code in email clients that collapse white space', async () => {
    const html = await renderMarkup(
      h(CodeBlock, { code: 'a  b', language: 'markup', theme: dracula }),
    );

    expect(html).toContain('a\xA0‍​\xA0‍​b');
  });

  it('serializes vendor-prefixed styles of the theme', async () => {
    const html = await renderMarkup(
      h(CodeBlock, {
        code: 'x',
        language: 'javascript',
        theme: { base: { MozTabSize: '2', WebkitHyphens: 'none' } },
      }),
    );

    expect(html).toContain(
      '<pre style="-moz-tab-size:2;-webkit-hyphens:none;width:100%">',
    );
  });

  it('throws when the language does not exist', async () => {
    await expect(
      renderMarkup(
        h(CodeBlock, {
          code: 'x',
          // @ts-expect-error - the language does not exist on purpose
          language: 'not-a-language',
          theme: dracula,
        }),
      ),
    ).rejects.toThrow(
      'CodeBlock: There is no language defined on Prism called not-a-language',
    );
  });
});
