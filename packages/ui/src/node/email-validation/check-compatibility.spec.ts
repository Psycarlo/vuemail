// @vitest-environment node
import type {
  CompatibilityCheckingResult,
  EmailClient,
} from '../../shared/types';
import { checkCompatibility } from './check-compatibility';
import { DEFAULT_RELEVANT_EMAIL_CLIENTS } from './email-clients';
import type { SetupTailwind } from './get-used-source-features';

const noTailwind: SetupTailwind = async () => {
  throw new Error('These emails have no <Tailwind>');
};

const check = (
  template: string,
  {
    script = '',
    clients = DEFAULT_RELEVANT_EMAIL_CLIENTS,
  }: { script?: string; clients?: readonly EmailClient[] } = {},
) =>
  checkCompatibility(
    `<script setup lang="ts">\n${script}\n</script>\n\n<template>\n${template}\n</template>\n`,
    'email.vue',
    clients,
    noTailwind,
  );

const findResult = (results: CompatibilityCheckingResult[], slug: string) =>
  results.find((result) => result.entry.slug === slug);

const findHslResult = (results: CompatibilityCheckingResult[]) =>
  findResult(results, 'css-hsl-hsla');

describe('checkCompatibility() — hsl()/hsla() detection', () => {
  it('flags background-color: hsl(...) as Outlook-incompatible', async () => {
    const results = await check(
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

  it('flags color: hsla(...) of a style object as Outlook-incompatible', async () => {
    const results = await check(
      `<div :style="{ color: 'hsla(120, 100%, 50%, 0.5)' }"></div>`,
    );
    expect(findHslResult(results)?.status).toBe('error');
  });

  it('tolerates whitespace variations in hsl() arguments', async () => {
    const results = await check(
      '<div style="background-color: hsl( 200 , 50% , 50% )"></div>',
    );
    expect(findHslResult(results)).toBeDefined();
  });

  it('does not flag hex or rgb() colors', async () => {
    const results = await check(
      '<div style="color: #ff0000; background-color: rgb(255, 0, 0)"></div>',
    );
    expect(findHslResult(results)).toBeUndefined();
  });
});

describe('checkCompatibility() on the source of emails', () => {
  it('flags unsupported elements of the template where they are first used', async () => {
    const results = await check(`  <Html>
    <link rel="stylesheet" href="https://vuemail.dev/styles.css" />
    <link rel="stylesheet" href="https://vuemail.dev/more.css" />
  </Html>`);

    const linkResult = findResult(results, 'html-link');
    // The name of the first <link>, in the source of the whole email
    expect(linkResult?.location.start).toEqual({
      line: 7,
      column: 5,
      index: 62,
    });
    // With the line before and the two after
    expect(linkResult?.source).toBe(`  <Html>
    <link rel="stylesheet" href="https://vuemail.dev/styles.css" />
    <link rel="stylesheet" href="https://vuemail.dev/more.css" />
  </Html>`);
  });

  it('flags unsupported attributes, of components too', async () => {
    const results = await check(
      '<p>\n  <Link href="https://vuemail.dev" target="_blank">Vuemail</Link>\n</p>',
    );
    expect(findResult(results, 'html-target')?.location.start.line).toBe(7);
  });

  it('flags attributes bound with v-bind', async () => {
    const results = await check(
      '<Link href="https://vuemail.dev" :target="target">Vuemail</Link>',
      { script: "const target = '_blank';" },
    );
    expect(findResult(results, 'html-target')).toBeDefined();
  });

  it("doesn't flag the elements of components, which the email doesn't write", async () => {
    const results = await check(
      '<Img src="https://vuemail.dev/logo.png" alt="Logo" />',
    );
    expect(findResult(results, 'html-loading-attribute')).toBeUndefined();
  });

  it('flags the properties of style attributes written as CSS', async () => {
    const results = await check(`<div
  style="
    font-family: 'Inter', sans-serif;
    border-radius: 4px;
  ">
</div>`);
    expect(findResult(results, 'css-border-radius')?.location.start).toEqual(
      expect.objectContaining({ line: 9, column: 4 }),
    );
  });

  it('flags properties with the values of entries', async () => {
    const results = await check('<div style="display: flex"></div>');
    expect(findResult(results, 'css-display-flex')).toBeDefined();
  });

  it('flags the properties of style objects written to variables', async () => {
    const results = await check(
      '<Button :style="styles.button">Click</Button>',
      {
        script: `const styles = {\n  button: { borderRadius: '5px' },\n};`,
      },
    );
    const result = findResult(results, 'css-border-radius');
    // In the script, where the property is written
    expect(result?.location.start).toEqual(
      expect.objectContaining({ line: 3, column: 12 }),
    );
  });

  it("never flags units, as upstream's matching of them never matches", async () => {
    const results = await check('<div style="width: 10rem"></div>');
    expect(findResult(results, 'css-unit-rem')).toBeUndefined();
  });

  it('flags every feature only once, where it is first used', async () => {
    const results = await check(`<div style="border-radius: 4px"></div>
<div style="border-radius: 8px"></div>`);
    expect(
      results.filter((result) => result.entry.slug === 'css-border-radius'),
    ).toHaveLength(1);
  });

  it('only checks against the given email clients', async () => {
    const template = '<div style="background-color: hsl(200, 50%, 50%)"></div>';
    expect(
      findHslResult(await check(template, { clients: ['gmail'] })),
    ).toBeUndefined();
    expect(
      Object.keys(
        findHslResult(await check(template, { clients: ['gmail', 'outlook'] }))
          ?.statsPerEmailClient ?? {},
      ),
    ).toEqual(['outlook']);
  });

  it('ignores comments', async () => {
    const results = await check(
      '<!-- <div style="border-radius: 4px"></div> -->',
    );
    expect(results).toEqual([]);
  });

  it('flags the properties Tailwind gives the classes of the email, where they are written', async () => {
    const setupTailwind = vi.fn<SetupTailwind>(
      async () =>
        (classes): Record<string, string> =>
          classes.includes('rounded') ? { borderRadius: '0.25rem' } : {},
    );
    const results = await checkCompatibility(
      `<script setup lang="ts">
import { Tailwind } from '@vuemaildev/vuemail';
import { config } from './theme';
</script>

<template>
  <Tailwind :config="config">
    <div class="p-4" :class="['rounded', { 'text-sm': true }]"></div>
  </Tailwind>
</template>
`,
      'email.vue',
      DEFAULT_RELEVANT_EMAIL_CLIENTS,
      setupTailwind,
    );

    expect(setupTailwind).toHaveBeenCalledWith(
      {
        imports: ["import { config } from './theme';"],
        config: 'config',
        theme: undefined,
        utility: undefined,
      },
      ['p-4', 'rounded', 'text-sm'],
    );
    expect(findResult(results, 'css-border-radius')?.location.start).toEqual(
      expect.objectContaining({ line: 8, column: 30 }),
    );
  });
});

describe('checkCompatibility() on JSX', () => {
  it('flags what JSX uses, the way upstream does', async () => {
    const results = await checkCompatibility(
      `export default function Email() {
  return (
    <div style={styles.card}>
      <link rel="stylesheet" href="https://vuemail.dev/styles.css" />
    </div>
  );
}

const styles = {
  card: { borderRadius: '4px' },
};
`,
      'email.tsx',
      DEFAULT_RELEVANT_EMAIL_CLIENTS,
      noTailwind,
    );

    expect(findResult(results, 'html-link')?.location.start.line).toBe(4);
    expect(findResult(results, 'css-border-radius')?.location.start.line).toBe(
      10,
    );
  });
});
