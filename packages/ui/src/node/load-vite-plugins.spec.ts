// @vitest-environment node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportTemplates } from './export-templates';
import { loadVitePlugins } from './load-vite-plugins';

vi.setConfig({ testTimeout: 30_000, hookTimeout: 30_000 });

const projectDirectory = fileURLToPath(
  new URL('./fixtures/project', import.meta.url),
);

// A plugin that gives emails a module that doesn't exist anywhere
const greetingPlugin = `{
  name: 'greeting',
  resolveId: (id: string) => (id === 'virtual:greeting' ? '\\0greeting' : undefined),
  load: (id: string) =>
    id === '\\0greeting' ? "export default 'Hello from a plugin'" : undefined,
}`;

describe('loadVitePlugins()', () => {
  let scratchDirectory: string;

  beforeEach(() => {
    scratchDirectory = fs.mkdtempSync(
      path.join(projectDirectory, 'tmp-plugins-'),
    );
  });

  afterEach(() => {
    fs.rmSync(scratchDirectory, { recursive: true, force: true });
  });

  const writeModule = (name: string, code: string) => {
    const modulePath = path.join(scratchDirectory, name);
    fs.writeFileSync(modulePath, code);
    return modulePath;
  };

  it('loads the plugins a TypeScript module exports', async () => {
    const plugins = await loadVitePlugins(
      writeModule('plugins.ts', `export default [${greetingPlugin}];`),
    );

    expect(plugins).toHaveLength(1);
    expect(plugins[0]).toMatchObject({ name: 'greeting' });
  });

  it('loads the plugins a function exported by the module resolves to', async () => {
    const plugins = await loadVitePlugins(
      writeModule(
        'plugins.mjs',
        'export default async () => [{ name: "first" }, { name: "second" }];',
      ),
    );

    expect(plugins).toEqual([{ name: 'first' }, { name: 'second' }]);
  });

  it("refuses modules that don't export plugins", async () => {
    const modulePath = writeModule('plugins.mjs', 'export default 42;');

    await expect(loadVitePlugins(modulePath)).rejects.toThrow(
      `Expected the default export of ${modulePath} to be an array of Vite plugins or a function returning one`,
    );
  });

  it('compiles emails with the plugins when exporting them', async () => {
    const cwd = process.cwd();
    const outputDirectory = fs.mkdtempSync(
      path.join(os.tmpdir(), 'vuemail-export-'),
    );
    const emailsDirectory = path.join(scratchDirectory, 'emails');
    fs.mkdirSync(emailsDirectory);
    fs.writeFileSync(
      path.join(emailsDirectory, 'greeting.vue'),
      `<script setup lang="ts">\nimport { Html, Text } from 'vuemail';\nimport greeting from 'virtual:greeting';\n</script>\n\n<template>\n  <Html><Text>{{ greeting }}</Text></Html>\n</template>\n`,
    );
    writeModule('plugins.ts', `export default [${greetingPlugin}];`);
    process.chdir(projectDirectory);
    try {
      await exportTemplates({
        outDir: outputDirectory,
        emailsDir: path.relative(projectDirectory, emailsDirectory),
        vitePlugins: path.relative(
          projectDirectory,
          path.join(scratchDirectory, 'plugins.ts'),
        ),
        silent: true,
      });

      expect(
        fs.readFileSync(path.join(outputDirectory, 'greeting.html'), 'utf8'),
      ).toContain('Hello from a plugin');
    } finally {
      process.chdir(cwd);
      fs.rmSync(outputDirectory, { recursive: true, force: true });
    }
  });

  it('reports a plugins module that fails to load when exporting', async () => {
    const cwd = process.cwd();
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    process.chdir(projectDirectory);
    try {
      await expect(
        exportTemplates({
          outDir: path.join(scratchDirectory, 'out'),
          emailsDir: 'emails',
          vitePlugins: './does-not-exist.mjs',
          silent: true,
        }),
      ).rejects.toThrow('Failed to build emails');
      expect(String(consoleError.mock.calls[0]?.[0])).toContain(
        'does-not-exist.mjs',
      );
    } finally {
      process.chdir(cwd);
      consoleError.mockRestore();
    }
  });
});
