// @vitest-environment node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createEmailLoader, type EmailLoader } from './email-loader';
import { createRenderingCache, type RenderingCache } from './rendering-cache';

vi.setConfig({ testTimeout: 30_000, hookTimeout: 30_000 });

const projectDirectory = fileURLToPath(
  new URL('./fixtures/project', import.meta.url),
);
const emailsDirectory = path.join(projectDirectory, 'emails');
// The files the tests change are kept apart from the fixture's emails, which
// other specs use side by side
let emailPath: string;
let partPath: string;
let unrelatedPath: string;

const writePart = (text: string) =>
  fs.writeFileSync(
    partPath,
    `<script setup lang="ts">\nimport { Text } from 'vuemail';\n</script>\n\n<template>\n  <Text>${text}</Text>\n</template>\n`,
  );

describe('createRenderingCache()', () => {
  let loader: EmailLoader;
  let cache: RenderingCache;
  let renders: string[];
  let scratchDirectory: string;

  beforeAll(async () => {
    scratchDirectory = fs.mkdtempSync(
      path.join(projectDirectory, 'tmp-cache-'),
    );
    emailPath = path.join(scratchDirectory, 'cached.vue');
    partPath = path.join(scratchDirectory, 'part.vue');
    unrelatedPath = path.join(scratchDirectory, 'other.vue');
    fs.writeFileSync(
      emailPath,
      `<script setup lang="ts">\nimport { Html } from 'vuemail';\nimport Part from './part.vue';\n\ndefineOptions({ PreviewProps: {} });\n</script>\n\n<template>\n  <Html><Part /></Html>\n</template>\n`,
    );
    writePart('First part');
    fs.writeFileSync(unrelatedPath, '<template><p>Other</p></template>\n');
    loader = await createEmailLoader(projectDirectory);
    cache = createRenderingCache(loader);
  });

  beforeEach(() => {
    renders = [];
    vi.spyOn(process.stderr, 'write').mockImplementation((chunk) => {
      const text = String(chunk);
      if (text.includes('Rendering email template')) renders.push(text);
      return true;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    cache.close();
    await loader.close();
    fs.rmSync(scratchDirectory, { recursive: true, force: true });
  });

  it('renders an email once for the same props', async () => {
    const first = await cache.render(emailPath);
    const second = await cache.render(emailPath);
    const withProps = await cache.render(emailPath, { name: 'Bo' });

    expect(second).toBe(first);
    expect(withProps).not.toBe(first);
    expect(renders).toHaveLength(2);
  });

  it('keeps the render when files it is not made of change', async () => {
    const first = await cache.render(emailPath);
    fs.writeFileSync(unrelatedPath, '<template><p>Changed</p></template>\n');
    // Gives the watcher the time to tell about it
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(await cache.render(emailPath)).toBe(first);
  });

  it('renders the email again once a component it imports changes', async () => {
    const first = await cache.render(emailPath);
    writePart('Second part');

    await vi.waitFor(
      async () => {
        const result = await cache.render(emailPath);
        if ('error' in result) throw result.error;
        expect(result.markup).toContain('Second part');
      },
      { timeout: 5000, interval: 100 },
    );
    expect('markup' in first && first.markup).toContain('First part');
  });

  it("doesn't keep failed renders", async () => {
    const brokenPath = path.join(emailsDirectory, 'broken.vue');
    await cache.render(brokenPath);
    await cache.render(brokenPath);

    expect(renders).toHaveLength(2);
  });
});
