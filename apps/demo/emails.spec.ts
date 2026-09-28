/// <reference types="vite/client" />
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { render } from '@vuemaildev/vuemail';
import { describe, expect, it } from 'vitest';
import type { Component } from 'vue';

type EmailComponent = Component & { PreviewProps?: Record<string, unknown> };

const modules = import.meta.glob<{ default: EmailComponent }>(
  './emails/**/*.vue',
);

// Components used by the emails, like fonts, have no <Html> of their own
const emails = Object.entries(modules).filter(([path]) => {
  const source = readFileSync(
    fileURLToPath(new URL(path, import.meta.url)),
    'utf8',
  );
  return /<Html[\s>]/.test(source);
});

describe('demo emails', () => {
  it('has emails to render', () => {
    expect(emails.length).toBeGreaterThan(0);
  });

  it.each(emails)('renders %s', async (_path, load) => {
    const { default: email } = await load();
    const props = email.PreviewProps;

    const html = await render(email, props);

    expect(html).toContain('<html');
    expect(html).not.toContain('{{');
    expect(html).not.toContain('[object Object]');
    expect(html).not.toContain('undefined');
    await expect(render(email, props, { plainText: true })).resolves.toBeTypeOf(
      'string',
    );
  });
});
