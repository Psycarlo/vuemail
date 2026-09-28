// @vitest-environment node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createEmailLoader, type EmailLoader } from './email-loader';
import { exportTemplates } from './export-templates';
import { renderEmailByPath } from './render-email';

// Each render goes through a Vite server, which is slow to start when other
// test runs share the machine
vi.setConfig({ testTimeout: 30_000, hookTimeout: 30_000 });

const projectDirectory = fileURLToPath(
  new URL('./fixtures/project', import.meta.url),
);
const emailsDirectory = path.join(projectDirectory, 'emails');

/**
 * A directory of the fixture project for the files a test writes, so that
 * the specs sharing the fixture's emails, which run side by side, never see
 * them.
 */
const makeScratchDirectory = (prefix: string) =>
  fs.mkdtempSync(path.join(projectDirectory, prefix));

const uncompilableEmail = `<script setup lang="ts">\nimport { Html } from 'vuemail';\nconst broken = ;\n</script>\n\n<template>\n  <Html />\n</template>\n`;

describe('renderEmailByPath()', () => {
  let loader: EmailLoader;
  let scratchDirectory: string;

  beforeAll(async () => {
    loader = await createEmailLoader(projectDirectory);
    scratchDirectory = makeScratchDirectory('tmp-render-');
  });

  afterAll(async () => {
    await loader.close();
    fs.rmSync(scratchDirectory, { recursive: true, force: true });
  });

  it('renders an email with its PreviewProps', async () => {
    const result = await renderEmailByPath(
      loader,
      path.join(emailsDirectory, 'welcome.vue'),
    );

    if ('error' in result) throw result.error;
    expect(result.previewProps).toEqual({ name: 'Ana' });
    expect(result.markup).toMatch(/^<!DOCTYPE html/);
    expect(result.markup).toContain('Welcome, Ana!');
    expect(result.prettyMarkup).toContain('\n');
    expect(result.plainText).toBe('Welcome, Ana!');
    expect(result.source).toContain("PreviewProps: { name: 'Ana' }");
    expect(result.basename).toBe('welcome');
    expect(result.extname).toBe('vue');
  });

  it('renders an email with the props it is given instead', async () => {
    const result = await renderEmailByPath(
      loader,
      path.join(emailsDirectory, 'welcome.vue'),
      { name: 'Bo' },
    );

    if ('error' in result) throw result.error;
    expect(result.previewProps).toEqual({ name: 'Bo' });
    expect(result.markup).toContain('Welcome, Bo!');
  });

  it('leaves the comments of templates out of the markup', async () => {
    const emailPath = path.join(scratchDirectory, 'commented.vue');
    fs.writeFileSync(
      emailPath,
      `<script setup lang="ts">\nimport { Html, Text } from 'vuemail';\n</script>\n\n<template>\n  <Html>\n    <!-- Footer -->\n    <Text>Bye</Text>\n  </Html>\n</template>\n`,
    );

    const result = await renderEmailByPath(loader, emailPath);

    if ('error' in result) throw result.error;
    expect(result.markup).toContain('Bye');
    expect(result.markup).not.toContain('Footer');
  });

  it('shows HTML emails as they are', async () => {
    const result = await renderEmailByPath(
      loader,
      path.join(emailsDirectory, 'raw.html'),
    );

    if ('error' in result) throw result.error;
    expect(result.markup).toBe(
      '<html><body><p>Raw HTML email</p></body></html>\n',
    );
    expect(result.plainText).toBe('Raw HTML email');
    expect(result.extname).toBe('html');
  });

  it('still shows HTML emails that Prettier cannot format', async () => {
    const emailPath = path.join(scratchDirectory, 'invalid.html');
    const markup = '<html><body><p><div>unclosed</p></span></body></html>\n';
    fs.writeFileSync(emailPath, markup);

    const result = await renderEmailByPath(loader, emailPath);

    if ('error' in result) throw result.error;
    expect(result.markup).toBe(markup);
    expect(result.prettyMarkup).toBe(markup);
    // The same as upstream's `toPlainText()` gives
    expect(result.plainText).toBe('unclosed\n\n');
  });

  it('returns the error of an email that fails to render, with its file', async () => {
    const result = await renderEmailByPath(
      loader,
      path.join(emailsDirectory, 'broken.vue'),
    );

    expect('error' in result && result.error.message).toBe(
      'This email is broken',
    );
    expect(result).toMatchObject({ basename: 'broken', extname: 'vue' });
  });

  it('only keeps the frames of the stack of an error thrown while rendering', async () => {
    const result = await renderEmailByPath(
      loader,
      path.join(emailsDirectory, 'broken.vue'),
    );

    if (!('error' in result)) throw new Error('The email should fail');
    const lines = result.error.stack?.split('\n') ?? [];
    expect(lines.length).toBeGreaterThan(0);
    for (const line of lines) {
      expect(line).toMatch(/^ at /);
    }
    expect(lines[0]).toContain('broken.vue');
  });

  it('shows what fails to compile as it is, with where it failed', async () => {
    const emailPath = path.join(scratchDirectory, 'uncompilable.vue');
    fs.writeFileSync(emailPath, uncompilableEmail);

    const result = await renderEmailByPath(loader, emailPath);

    if (!('error' in result)) throw new Error('The email should fail');
    expect(result.error.message).toContain('Unexpected token');
    expect(result.error.message).toContain('const broken = ;');
    expect(result).toMatchObject({ basename: 'uncompilable', extname: 'vue' });
  });

  it('can tell in the terminal how each render goes', async () => {
    const output: string[] = [];
    const write = vi
      .spyOn(process.stderr, 'write')
      .mockImplementation((chunk) => {
        output.push(String(chunk));
        return true;
      });
    try {
      await renderEmailByPath(
        loader,
        path.join(emailsDirectory, 'welcome.vue'),
        undefined,
        { logging: true },
      );
      await renderEmailByPath(
        loader,
        path.join(emailsDirectory, 'broken.vue'),
        undefined,
        { logging: true },
      );
    } finally {
      write.mockRestore();
    }

    expect(output[0]).toBe(' Rendering email template welcome.vue\n');
    // The duration is colored in terminals that support it
    expect(output[1]).toMatch(
      /^ .+ Successfully rendered welcome\.vue in \S*\d+ms\S* \(bundled in \d+ms\)\n$/,
    );
    expect(output[2]).toBe(' Rendering email template broken.vue\n');
    expect(output[3]).toMatch(/^ .+ Failed while rendering broken\.vue\n$/);
  });

  it('holds back what emails log until it tells how their render went', async () => {
    const emailPath = path.join(scratchDirectory, 'logging.vue');
    fs.writeFileSync(
      emailPath,
      `<script setup lang="ts">\nimport { Html } from 'vuemail';\nconsole.log('logged by the email');\n</script>\n\n<template>\n  <Html />\n</template>\n`,
    );
    const output: string[] = [];
    const write = vi
      .spyOn(process.stderr, 'write')
      .mockImplementation((chunk) => {
        output.push(String(chunk));
        return true;
      });
    const log = vi.spyOn(console, 'log').mockImplementation((...args) => {
      output.push(args.join(' '));
    });
    try {
      await renderEmailByPath(loader, emailPath, undefined, { logging: true });
    } finally {
      write.mockRestore();
      log.mockRestore();
    }

    expect(output).toHaveLength(3);
    expect(output[1]).toContain('Successfully rendered logging.vue');
    expect(output[2]).toBe('logged by the email');
  });

  it('picks up changes to an email without restarting', async () => {
    const emailPath = path.join(scratchDirectory, 'changing.vue');
    const writeEmail = (text: string) =>
      fs.writeFileSync(
        emailPath,
        `<script setup lang="ts">\nimport { Html, Text } from 'vuemail';\n</script>\n\n<template>\n  <Html><Text>${text}</Text></Html>\n</template>\n`,
      );

    writeEmail('First version');
    const first = await renderEmailByPath(loader, emailPath);

    writeEmail('Second version');
    // Vite learns about the change from its watcher
    await vi.waitFor(
      async () => {
        const second = await renderEmailByPath(loader, emailPath);
        if ('error' in second) throw second.error;
        expect(second.markup).toContain('Second version');
      },
      { timeout: 5000, interval: 100 },
    );

    expect('markup' in first && first.markup).toContain('First version');
  });
});

describe('exportTemplates()', () => {
  const cwd = process.cwd();
  let outputDirectory: string;
  let scratchDirectory: string;
  // A copy of the fixture's emails, which each test changes as it needs
  let emailsDir: string;

  beforeEach(() => {
    outputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'vuemail-export-'));
    scratchDirectory = makeScratchDirectory('tmp-export-');
    fs.cpSync(emailsDirectory, path.join(scratchDirectory, 'emails'), {
      recursive: true,
    });
    emailsDir = path.relative(
      projectDirectory,
      path.join(scratchDirectory, 'emails'),
    );
    process.chdir(projectDirectory);
  });

  afterEach(() => {
    process.chdir(cwd);
    fs.rmSync(outputDirectory, { recursive: true, force: true });
    fs.rmSync(scratchDirectory, { recursive: true, force: true });
  });

  // The broken email would stop the export
  const leaveOutBrokenEmail = () =>
    fs.rmSync(path.join(projectDirectory, emailsDir, 'broken.vue'));

  it('renders every email into the output directory, keeping the folders', async () => {
    leaveOutBrokenEmail();

    await exportTemplates({ outDir: outputDirectory, emailsDir, silent: true });

    const read = (file: string) =>
      fs.readFileSync(path.join(outputDirectory, file), 'utf8');
    expect(read('welcome.html')).toContain('Welcome, there!');
    expect(read('raw.html')).toContain('Raw HTML email');
    expect(read(path.join('auth', 'magic-link', 'code.html'))).toMatch(
      /^<!DOCTYPE html/,
    );
    expect(read(path.join('static', 'logo.png'))).toBe('not an image\n');
    expect(fs.existsSync(path.join(outputDirectory, 'components'))).toBe(false);
  });

  it("doesn't warn about the props emails are exported without", async () => {
    leaveOutBrokenEmail();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      await exportTemplates({
        outDir: outputDirectory,
        emailsDir,
        silent: true,
      });

      // auth/magic-link/code.vue requires a `code` prop
      expect(
        fs.existsSync(
          path.join(outputDirectory, 'auth', 'magic-link', 'code.html'),
        ),
      ).toBe(true);
      expect(warn).not.toHaveBeenCalled();
    } finally {
      warn.mockRestore();
    }
  });

  it('can export plain text with a custom extension', async () => {
    leaveOutBrokenEmail();

    await exportTemplates({
      outDir: outputDirectory,
      emailsDir,
      plainText: true,
      extension: 'txt',
      silent: true,
    });

    expect(
      fs.readFileSync(path.join(outputDirectory, 'welcome.txt'), 'utf8'),
    ).toBe('Welcome, there!');
  });

  it('tells how the export goes, step by step', async () => {
    leaveOutBrokenEmail();
    const output: string[] = [];
    const write = vi
      .spyOn(process.stdout, 'write')
      .mockImplementation((chunk) => {
        output.push(String(chunk).trimEnd());
        return true;
      });
    const log = vi.spyOn(console, 'log').mockImplementation((...args) => {
      output.push(args.join(' '));
    });
    try {
      await exportTemplates({ outDir: outputDirectory, emailsDir });
    } finally {
      write.mockRestore();
      log.mockRestore();
    }

    expect(output.slice(0, 5)).toEqual([
      'Preparing files...',
      '✔ Preparing files...',
      'rendering raw.html',
      'rendering welcome.vue',
      'rendering code.vue',
    ]);
    expect(output.slice(5, 8)).toEqual([
      '✔ Rendered all files',
      'Copying static files',
      '✔ Copying static files',
    ]);
    expect(output[8]).toMatch(/^vuemail-export-\w+\r?\n├── auth/);
    expect(output[9]).toMatch(/Successfully exported emails$/);
  });

  it("doesn't render anything when an email doesn't compile", async () => {
    fs.writeFileSync(
      path.join(projectDirectory, emailsDir, 'uncompilable.vue'),
      uncompilableEmail,
    );
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    try {
      await expect(
        exportTemplates({ outDir: outputDirectory, emailsDir, silent: true }),
      ).rejects.toThrow('Failed to build emails');

      expect(consoleError).toHaveBeenCalledOnce();
      expect(consoleError.mock.calls[0]?.[0]).toMatch(
        /^\n.*Unexpected token[\s\S]*const broken = ;/,
      );
      expect(fs.existsSync(outputDirectory)).toBe(false);
    } finally {
      consoleError.mockRestore();
    }
  });

  it('fails on the first email that fails to render', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    try {
      await expect(
        exportTemplates({ outDir: outputDirectory, emailsDir, silent: true }),
      ).rejects.toThrow('failed when rendering broken.vue');
      expect(consoleError).toHaveBeenCalledOnce();
      expect(String(consoleError.mock.calls[0]?.[0])).toContain(
        'This email is broken',
      );
    } finally {
      consoleError.mockRestore();
    }
  });

  it('tells when there is no emails directory', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    try {
      await expect(
        exportTemplates({
          outDir: outputDirectory,
          emailsDir: 'missing',
          silent: true,
        }),
      ).rejects.toThrow('Could not find the directory at missing');
      expect(consoleError).toHaveBeenCalledWith(
        'Could not find the directory at missing',
      );
    } finally {
      consoleError.mockRestore();
    }
  });
});
