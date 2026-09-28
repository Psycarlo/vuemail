// @vitest-environment node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createEmailLoader, type EmailLoader } from '../email-loader';
import { createTailwindSetup } from './tailwind-setup';

vi.setConfig({ testTimeout: 30_000, hookTimeout: 30_000 });

const projectDirectory = fileURLToPath(
  new URL('../fixtures/project', import.meta.url),
);

describe('createTailwindSetup()', () => {
  let loader: EmailLoader;
  let scratchDirectory: string;
  let emailPath: string;

  beforeAll(async () => {
    // Kept apart from the fixture's emails, which other specs use
    scratchDirectory = fs.mkdtempSync(
      path.join(projectDirectory, 'tmp-tailwind-'),
    );
    emailPath = path.join(scratchDirectory, 'email.vue');
    fs.writeFileSync(
      path.join(scratchDirectory, 'theme.ts'),
      `export const config = {\n  theme: { extend: { colors: { brand: '#42b883' } } },\n};\nexport const themeCss = '@theme { --color-accent: #123456; }';\n`,
    );
    loader = await createEmailLoader(projectDirectory);
  });

  afterAll(async () => {
    await loader.close();
    fs.rmSync(scratchDirectory, { recursive: true, force: true });
  });

  it('runs the config the email imports, next to it', async () => {
    const setupTailwind = createTailwindSetup(loader, emailPath);

    const inline = await setupTailwind(
      {
        imports: ["import { config } from './theme';"],
        config: 'config',
      },
      ['bg-brand', 'rounded-sm'],
    );

    expect(inline(['bg-brand'])).toEqual({
      backgroundColor: 'rgb(66,184,131)',
    });
    expect(inline(['rounded-sm'])).toEqual({ borderRadius: '0.25rem' });
  });

  it('runs the code of the theme prop, and takes strings as they are', async () => {
    const setupTailwind = createTailwindSetup(loader, emailPath);

    const inline = await setupTailwind(
      {
        imports: ["import { themeCss } from './theme';"],
        theme: { code: 'themeCss' },
        utility: { literal: '.tall { height: 100px; }' },
      },
      ['text-accent', 'tall'],
    );

    expect(inline(['text-accent'])).toEqual({ color: 'rgb(18,52,86)' });
    expect(inline(['tall'])).toEqual({ height: '100px' });
  });

  it("warns about a config that can't run on its own, and goes on without it", async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const setupTailwind = createTailwindSetup(loader, emailPath);

      const inline = await setupTailwind(
        { imports: [], config: 'notDefinedAnywhere' },
        ['rounded-sm'],
      );

      expect(inline(['rounded-sm'])).toEqual({ borderRadius: '0.25rem' });
      expect(warn).toHaveBeenLastCalledWith(
        "Tried reading the config defined directly in the Tailwind component but was unable to, probably because it can't run by itself.",
      );
    } finally {
      warn.mockRestore();
    }
  });
});
