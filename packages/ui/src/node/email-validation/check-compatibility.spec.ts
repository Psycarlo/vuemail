// @vitest-environment node
import type { CompatibilityCheckingResult } from '../../shared/types';
import { checkCompatibility } from './check-compatibility';
import { DEFAULT_RELEVANT_EMAIL_CLIENTS } from './email-clients';

const check = (markup: string) =>
  checkCompatibility(markup, DEFAULT_RELEVANT_EMAIL_CLIENTS);

const findResult = (results: CompatibilityCheckingResult[], slug: string) =>
  results.find((result) => result.entry.slug === slug);

const findHslResult = (results: CompatibilityCheckingResult[]) =>
  findResult(results, 'css-hsl-hsla');

describe('checkCompatibility() — hsl()/hsla() detection', () => {
  it('flags background-color: hsl(...) as Outlook-incompatible', () => {
    const results = check(
      '<div style="background-color: hsl(200, 50%, 50%)"></div>',
    );
    const hslResult = findHslResult(results);
    expect(hslResult).toBeDefined();
    expect(hslResult?.status).toBe('error');
    expect(hslResult?.statsPerEmailClient.outlook?.status).toBe('error');
    expect(hslResult?.entry.source).toBe('react-email');
    expect(hslResult?.entry.url).toBe(
      'https://github.com/resend/react-email/issues/2947',
    );
  });

  it('flags color: hsla(...) as Outlook-incompatible', () => {
    const results = check(
      '<div style="color: hsla(120, 100%, 50%, 0.5)"></div>',
    );
    const hslResult = findHslResult(results);
    expect(hslResult).toBeDefined();
    expect(hslResult?.status).toBe('error');
  });

  it('tolerates whitespace variations in hsl() arguments', () => {
    const results = check(
      '<div style="background-color: hsl( 200 , 50% , 50% )"></div>',
    );
    expect(findHslResult(results)).toBeDefined();
  });

  it('does not flag hex or rgb() colors', () => {
    const results = check(
      '<div style="color: #ff0000; background-color: rgb(255, 0, 0)"></div>',
    );
    expect(findHslResult(results)).toBeUndefined();
  });

  it('flags hsl() used in a <style> element', () => {
    const results = check(
      '<style>.button { color: hsl(200, 50%, 50%) }</style>',
    );
    expect(findHslResult(results)).toBeDefined();
  });
});

describe('checkCompatibility() on the rendered HTML', () => {
  it('flags unsupported elements where they are first used', () => {
    const results = check(`<html>
  <head>
    <link rel="stylesheet" href="https://vuemail.dev/styles.css" />
  </head>
  <body>
    <link rel="stylesheet" href="https://vuemail.dev/more.css" />
  </body>
</html>`);
    const linkResult = findResult(results, 'html-link');
    expect(linkResult?.location.start).toEqual({
      line: 3,
      column: 5,
      index: 21,
    });
    expect(linkResult?.source).toBe(`  <head>
    <link rel="stylesheet" href="https://vuemail.dev/styles.css" />
  </head>
  <body>`);
  });

  it('flags unsupported attributes', () => {
    const results = check(
      '<p>\n  <a href="https://vuemail.dev" target="_blank">Vuemail</a>\n</p>',
    );
    expect(findResult(results, 'html-target')?.location.start.line).toBe(2);
  });

  it('flags attribute features by the attribute, not the elements they apply to', () => {
    expect(
      findResult(
        check('<img src="https://vuemail.dev/logo.png" alt="Logo" />'),
        'html-loading-attribute',
      ),
    ).toBeUndefined();
    expect(
      findResult(
        check(
          '<img src="https://vuemail.dev/logo.png" alt="Logo" loading="lazy" />',
        ),
        'html-loading-attribute',
      ),
    ).toBeDefined();
  });

  it('flags properties, values, functions, units and at-rules of <style> elements', () => {
    const results = check(`<html>
  <head>
    <style>
      .row { display: flex !important; }
      @media (max-width: 600px) {
        .column { width: 10rem; }
      }
    </style>
  </head>
</html>`);
    expect(findResult(results, 'css-display-flex')?.location.start.line).toBe(
      4,
    );
    expect(findResult(results, 'css-at-media')?.location.start.line).toBe(5);
    expect(findResult(results, 'css-unit-rem')?.location.start.line).toBe(6);
  });

  it('locates declarations of inline styles that span several lines', () => {
    const results = check(`<div
  style="
    font-family: &quot;Inter&quot;, sans-serif;
    border-radius: 4px;
  ">
</div>`);
    expect(findResult(results, 'css-border-radius')?.location.start).toEqual(
      expect.objectContaining({ line: 4, column: 4 }),
    );
  });

  it('flags every feature only once, where it is first used', () => {
    const results = check(`<div style="border-radius: 4px"></div>
<div style="border-radius: 8px"></div>`);
    expect(
      results.filter((result) => result.entry.slug === 'css-border-radius'),
    ).toHaveLength(1);
  });

  it('only checks against the given email clients', () => {
    const markup = '<div style="background-color: hsl(200, 50%, 50%)"></div>';
    expect(
      findHslResult(checkCompatibility(markup, ['gmail'])),
    ).toBeUndefined();
    expect(
      Object.keys(
        findHslResult(checkCompatibility(markup, ['gmail', 'outlook']))
          ?.statsPerEmailClient ?? {},
      ),
    ).toEqual(['outlook']);
  });

  it('ignores the markup of comments', () => {
    const results = check(
      '<!--[if mso]><div style="border-radius: 4px"></div><![endif]-->',
    );
    expect(results).toEqual([]);
  });
});
