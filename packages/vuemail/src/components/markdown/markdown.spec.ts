import { h } from 'vue';
import { renderMarkup } from '../utils/render-markup';
import Interpolated from './fixtures/interpolated.vue';
import { Markdown } from './markdown';

const heading = (level: number, fontSize: string, text: string) =>
  `<h${level} style="font-weight:500;padding-top:20px;font-size:${fontSize}">${text}</h${level}>`;

describe('<Markdown> component', () => {
  it('renders the markdown in the correct format for browsers', async () => {
    const html = await renderMarkup(
      h(Markdown, {
        source: `# Markdown Test Document

This is a **test document** to check the capabilities of a Markdown parser.

## Text Formatting

This is some **bold text** and this is some *italic text*. You can also use ~~strikethrough~~ and \`inline code\`.

## Lists

1. Ordered List Item 1
2. Ordered List Item 2

- Unordered List Item 1
- Unordered List Item 2

## Images

![Markdown Logo](https://markdown-here.com/img/icon256.png)

## Blockquotes

> This is a blockquote.
> - Author

## Code Blocks

\`\`\`javascript
function greet(name) {
console.log(\`Hello, $\{name}!\`);
}
\`\`\``,
      }),
    );

    expect(html).toBe(
      `<div data-id="vuemail-markdown">${heading(1, '2.5rem', 'Markdown Test Document')}<p>This is a <strong style="font-weight:bold">test document</strong> to check the capabilities of a Markdown parser.</p>
${heading(2, '2rem', 'Text Formatting')}<p>This is some <strong style="font-weight:bold">bold text</strong> and this is some <em style="font-style:italic">italic text</em>. You can also use <del>strikethrough</del> and <code style="color:#212529;font-size:87.5%;display:inline;background: #f8f8f8;font-family:SFMono-Regular,Menlo,Monaco,Consolas,monospace;word-wrap:break-word">inline code</code>.</p>
${heading(2, '2rem', 'Lists')}<ol>
<li>Ordered List Item 1</li>
<li>Ordered List Item 2</li>
</ol>
<ul>
<li>Unordered List Item 1</li>
<li>Unordered List Item 2</li>
</ul>
${heading(2, '2rem', 'Images')}<p><img src="https://markdown-here.com/img/icon256.png" alt="Markdown Logo"></p>
${heading(2, '2rem', 'Blockquotes')}<blockquote style="background:#f9f9f9;border-left:10px solid #ccc;margin:1.5em 10px;padding:1em 10px">
<p>This is a blockquote.</p>
<ul>
<li>Author</li>
</ul>
</blockquote>
${heading(2, '2rem', 'Code Blocks')}<pre style="color:#212529;font-size:87.5%;display:block;background: #f8f8f8;font-family:SFMono-Regular,Menlo,Monaco,Consolas,monospace;padding-top:10px;padding-right:10px;padding-left:10px;padding-bottom:1px;margin-bottom:20px;word-wrap:break-word"><code>function greet(name) {
console.log(\`Hello, \${name}!\`);
}
</code></pre>
</div>`,
    );
  });

  it('reads markdown interpolated into its default slot, line breaks included', async () => {
    const html = await renderMarkup(
      h(Interpolated, { content: '# Hello\n\n- one\n- two' }),
    );

    expect(html).toBe(
      `<div data-id="vuemail-markdown">${heading(1, '2.5rem', 'Hello')}<ul>
<li>one</li>
<li>two</li>
</ul>
</div>`,
    );
  });

  it('applies custom styles, escaping the quotes in them', async () => {
    const html = await renderMarkup(
      h(Markdown, {
        source:
          '**This is sample bold text in markdown** and *this is italic text*',
        markdownCustomStyles: {
          bold: {
            font: '700 23px / 32px "Roobert PRO", system-ui, sans-serif',
            background: 'url("path/to/image")',
          },
        },
      }),
    );

    expect(html).toBe(
      `<div data-id="vuemail-markdown"><p><strong style="font:700 23px / 32px &quot;Roobert PRO&quot;, system-ui, sans-serif;background:url(&quot;path/to/image&quot;)">This is sample bold text in markdown</strong> and <em style="font-style:italic">this is italic text</em></p>
</div>`,
    );
  });

  it('applies container styles', async () => {
    const html = await renderMarkup(
      h(Markdown, {
        source: 'Hello',
        markdownContainerStyles: { padding: '12px', border: 'solid 1px black' },
      }),
    );

    expect(html).toBe(
      '<div data-id="vuemail-markdown" style="padding:12px;border:solid 1px black"><p>Hello</p>\n</div>',
    );
  });

  it('escapes double quotes in link/image href and title attributes', async () => {
    const html = await renderMarkup(
      h(Markdown, {
        source: `[guide](https://example.com/?q="a" 'The "Complete" Guide') and ![logo](https://cdn.example.com/a.png 'Acme "logo"')`,
      }),
    );

    expect(html).toBe(
      `<div data-id="vuemail-markdown"><p><a href="https://example.com/?q=&quot;a&quot;" target="_blank" title="The &quot;Complete&quot; Guide" style="color:#007bff;text-decoration:underline;background-color:transparent">guide</a> and <img src="https://cdn.example.com/a.png" alt="logo" title="Acme &quot;logo&quot;"></p>
</div>`,
    );
  });

  it('renders loose lists with paragraph continuations without crashing', async () => {
    const html = await renderMarkup(
      h(Markdown, {
        source: `- item1

  paragraph continuation

- item2`,
      }),
    );

    expect(html).toBe(`<div data-id="vuemail-markdown"><ul>
<li><p>item1</p>
<p>paragraph continuation</p>
</li>
<li><p>item2</p>
</li>
</ul>
</div>`);
  });

  it('renders nested lists', async () => {
    const html = await renderMarkup(
      h(Markdown, {
        source: `
- parent list item
    - nested list item 1
- another parent item
    1. nested ordered item 1
       `,
      }),
    );

    expect(html).toBe(`<div data-id="vuemail-markdown"><ul>
<li><p>parent list item</p>
<ul>
<li>nested list item 1</li>
</ul>
</li>
<li><p>another parent item</p>
<ol>
<li>nested ordered item 1</li>
</ol>
</li>
</ul>
</div>`);
  });

  it('renders tables with presentation role', async () => {
    const html = await renderMarkup(
      h(Markdown, {
        source: '| Name | Role |\n| :--- | ---: |\n| Ada | Engineer |',
      }),
    );

    expect(html).toContain('<table role="presentation">');
    expect(html).toContain('<th align="left">Name</th>');
    expect(html).toContain('<td align="right">Engineer</td>');
  });
});
