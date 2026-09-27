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

describe('renderEmailByPath()', () => {
  let loader: EmailLoader;

  beforeAll(async () => {
    loader = await createEmailLoader(projectDirectory);
  });

  afterAll(async () => {
    await loader.close();
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

  it('returns the error of an email that fails to render', async () => {
    const result = await renderEmailByPath(
      loader,
      path.join(emailsDirectory, 'broken.vue'),
    );

    expect('error' in result && result.error.message).toBe(
      'This email is broken',
    );
  });

  it('picks up changes to an email without restarting', async () => {
    const emailPath = path.join(emailsDirectory, 'zz-changing.vue');
    const writeEmail = (text: string) =>
      fs.writeFileSync(
        emailPath,
        `<script setup lang="ts">\nimport { Html, Text } from 'vuemail';\n</script>\n\n<template>\n  <Html><Text>${text}</Text></Html>\n</template>\n`,
      );

    try {
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
    } finally {
      fs.rmSync(emailPath, { force: true });
    }
  });
});

describe('exportTemplates()', () => {
  const cwd = process.cwd();
  let outputDirectory: string;

  beforeEach(() => {
    outputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'vuemail-export-'));
    process.chdir(projectDirectory);
  });

  afterEach(() => {
    process.chdir(cwd);
    fs.rmSync(outputDirectory, { recursive: true, force: true });
  });

  it('renders every email into the output directory, keeping the folders', async () => {
    // The broken email would stop the export, so it's left out
    fs.renameSync(
      path.join(emailsDirectory, 'broken.vue'),
      path.join(emailsDirectory, '_broken.vue'),
    );
    try {
      await exportTemplates({
        outDir: outputDirectory,
        emailsDir: 'emails',
        silent: true,
      });
    } finally {
      fs.renameSync(
        path.join(emailsDirectory, '_broken.vue'),
        path.join(emailsDirectory, 'broken.vue'),
      );
    }

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

  it('can export plain text with a custom extension', async () => {
    fs.renameSync(
      path.join(emailsDirectory, 'broken.vue'),
      path.join(emailsDirectory, '_broken.vue'),
    );
    try {
      await exportTemplates({
        outDir: outputDirectory,
        emailsDir: 'emails',
        plainText: true,
        extension: 'txt',
        silent: true,
      });
    } finally {
      fs.renameSync(
        path.join(emailsDirectory, '_broken.vue'),
        path.join(emailsDirectory, 'broken.vue'),
      );
    }

    expect(
      fs.readFileSync(path.join(outputDirectory, 'welcome.txt'), 'utf8'),
    ).toBe('Welcome, there!');
  });

  it('fails on the first email that fails to render', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    try {
      await expect(
        exportTemplates({
          outDir: outputDirectory,
          emailsDir: 'emails',
          silent: true,
        }),
      ).rejects.toThrow('failed when rendering broken.vue');
    } finally {
      consoleError.mockRestore();
    }
  });
});
