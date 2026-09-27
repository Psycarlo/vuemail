// @vitest-environment node
import { getUsedHtmlFeatures } from './get-used-html-features';

describe('getUsedHtmlFeatures()', () => {
  it('handles styles defined inline in the style attribute', () => {
    const html = `
<a style="border-radius: 5px; color: #fff; padding: 10px">Click me</a>
`;
    expect(getUsedHtmlFeatures(html).styleProperties).toMatchInlineSnapshot(`
      [
        {
          "functions": [],
          "location": {
            "end": {
              "column": 28,
              "index": 29,
              "line": 2,
            },
            "start": {
              "column": 10,
              "index": 11,
              "line": 2,
            },
          },
          "name": "border-radius",
          "units": [
            "px",
          ],
          "value": "5px",
        },
        {
          "functions": [],
          "location": {
            "end": {
              "column": 41,
              "index": 42,
              "line": 2,
            },
            "start": {
              "column": 30,
              "index": 31,
              "line": 2,
            },
          },
          "name": "color",
          "units": [],
          "value": "#fff",
        },
        {
          "functions": [],
          "location": {
            "end": {
              "column": 56,
              "index": 57,
              "line": 2,
            },
            "start": {
              "column": 43,
              "index": 44,
              "line": 2,
            },
          },
          "name": "padding",
          "units": [
            "px",
          ],
          "value": "10px",
        },
      ]
    `);
  });

  it('handles styles defined in <style> elements, at-rules included', () => {
    const html = `<head>
  <style>
    .button { background: linear-gradient(red, hsl(0 0% 50%)); }
    @media (max-width: 600px) {
      .button { margin: 2vw !important; }
    }
  </style>
</head>`;
    const properties = getUsedHtmlFeatures(html).styleProperties.map(
      ({ name, value, functions, units, location }) => ({
        name,
        value,
        functions,
        units,
        line: location.start.line,
      }),
    );
    expect(properties).toEqual([
      {
        name: 'background',
        value: 'linear-gradient(red,hsl(0 0% 50%))',
        functions: ['linear-gradient', 'hsl'],
        units: ['%', '%'],
        line: 3,
      },
      {
        name: '@media',
        value: '(max-width:600px)',
        functions: [],
        units: [],
        line: 4,
      },
      {
        name: 'margin',
        value: '2vw',
        functions: [],
        units: ['vw'],
        line: 5,
      },
    ]);
  });

  it('decodes the character references of inline styles', () => {
    const html = `<p style="font-family: &quot;Inter&quot;, sans-serif; COLOR: RED"></p>`;
    expect(
      getUsedHtmlFeatures(html).styleProperties.map(({ name, value }) => ({
        name,
        value,
      })),
    ).toEqual([
      { name: 'font-family', value: '"Inter",sans-serif' },
      { name: 'color', value: 'RED' },
    ]);
  });

  it('finds the elements and attributes, where their names are', () => {
    const html = `<!DOCTYPE html>
<html lang="en">
  <body>
    <IMG SRC="https://vuemail.dev/logo.png" alt="Logo" />
  </body>
</html>`;
    const { elements, attributes } = getUsedHtmlFeatures(html);
    expect(
      elements.map(({ name, location }) => [name, location.start.line]),
    ).toEqual([
      ['html', 2],
      ['body', 3],
      ['img', 4],
    ]);
    expect(
      attributes.map(({ name, location }) => [
        name,
        location.start.line,
        location.start.column,
      ]),
    ).toEqual([
      ['lang', 2, 6],
      ['src', 4, 9],
      ['alt', 4, 44],
    ]);
  });

  it('tolerates invalid CSS', () => {
    const html = `<div style="color: ; : red; background: url(x.png), linear-gradient(red, blue); bad: {"></div>`;
    expect(
      getUsedHtmlFeatures(html).styleProperties.map(({ name }) => name),
    ).toContain('background');
  });
});
