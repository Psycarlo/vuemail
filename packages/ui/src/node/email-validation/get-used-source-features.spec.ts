// @vitest-environment node
import {
  getUsedSourceFeatures,
  type SetupTailwind,
} from './get-used-source-features';

const noTailwind: SetupTailwind = async () => {
  throw new Error('These emails have no <Tailwind>');
};

const getStyleProperties = async (source: string, emailPath: string) =>
  (await getUsedSourceFeatures(source, emailPath, noTailwind)).styleProperties;

// The same cases, with the same locations, as upstream's specs of reading
// the style properties of React emails
describe('getUsedSourceFeatures() on JSX', () => {
  it('handles styles defined as an object in another variable', async () => {
    const code = `
<Button style={buttonStyle}>Click me</Button>

const buttonStyle = {
  borderRadius: '5px',
};
`;
    expect(await getStyleProperties(code, 'email.tsx')).toEqual([
      {
        name: 'borderRadius',
        value: '5px',
        location: {
          start: { line: 5, column: 2, index: 72 },
          end: { line: 5, column: 21, index: 91 },
        },
      },
    ]);
  });

  it('handles styles defined inline in the attribute', async () => {
    const code = `
<Button style={{ borderRadius: '5px', "color": "#fff", padding: 10 }}>Click me</Button>
`;
    expect(await getStyleProperties(code, 'email.tsx')).toEqual([
      {
        name: 'borderRadius',
        value: '5px',
        location: {
          start: { line: 2, column: 17, index: 18 },
          end: { line: 2, column: 36, index: 37 },
        },
      },
      {
        name: 'color',
        value: '#fff',
        location: {
          start: { line: 2, column: 38, index: 39 },
          end: { line: 2, column: 53, index: 54 },
        },
      },
      {
        name: 'padding',
        value: '10',
        location: {
          start: { line: 2, column: 55, index: 56 },
          end: { line: 2, column: 66, index: 67 },
        },
      },
    ]);
  });

  it('handles styles objects that are a property of another object', async () => {
    const code = `
<Button style={styles.button}>Click me</Button>

const styles = {
  button: { borderRadius: '5px', "color": "#fff", padding: 10 }
}
`;
    const properties = await getStyleProperties(code, 'email.tsx');

    expect(properties.map(({ name, value }) => [name, value])).toEqual([
      ['borderRadius', '5px'],
      ['color', '#fff'],
      ['padding', '10'],
    ]);
    expect(properties[0]?.location).toEqual({
      start: { line: 5, column: 12, index: 79 },
      end: { line: 5, column: 31, index: 98 },
    });
  });
});

describe('getUsedSourceFeatures() on single file components', () => {
  const vueEmail = (script: string, template: string) =>
    `<script setup lang="ts">\n${script}\n</script>\n\n<template>\n${template}\n</template>\n`;

  it('reads style objects bound in the template, and the variables they are in', async () => {
    const properties = await getStyleProperties(
      vueEmail(
        "const main = { fontSize: '14px' };\nconst styles = { button: { borderRadius: 5 } };",
        `  <Section :style="main">\n    <Button :style="[styles.button, { color: '#fff' }]">Click</Button>\n  </Section>`,
      ),
      'email.vue',
    );

    expect(properties.map(({ name, value }) => [name, value])).toEqual([
      ['fontSize', '14px'],
      ['borderRadius', '5'],
      ['color', '#fff'],
    ]);
    // Where they're written, in the script or in the template
    expect(properties.map(({ location }) => location.start.line)).toEqual([
      2, 3, 8,
    ]);
  });

  it('reads style attributes written as CSS, in camelCase', async () => {
    const properties = await getStyleProperties(
      vueEmail(
        '',
        '  <td style="border-radius: 4px; background-color:#fff"></td>',
      ),
      'email.vue',
    );

    expect(properties).toEqual([
      {
        name: 'borderRadius',
        value: '4px',
        location: {
          start: { line: 6, column: 13, index: 61 },
          end: { line: 6, column: 31, index: 79 },
        },
      },
      {
        name: 'backgroundColor',
        value: '#fff',
        location: {
          start: { line: 6, column: 33, index: 81 },
          end: { line: 6, column: 54, index: 102 },
        },
      },
    ]);
  });

  it('reads the elements and attributes of the template, bound ones included', async () => {
    const { elements, attributes } = await getUsedSourceFeatures(
      vueEmail(
        '',
        '  <Html lang="en">\n    <template v-if="true"><video :width="100" /></template>\n  </Html>',
      ),
      'email.vue',
      noTailwind,
    );

    // `<template>` tags don't render
    expect(elements.map(({ name }) => name)).toEqual(['Html', 'video']);
    expect(attributes.map(({ name }) => name)).toEqual(['lang', 'width']);
    expect(elements[1]?.location.start).toEqual({
      line: 7,
      column: 27,
      index: 94,
    });
  });
});
