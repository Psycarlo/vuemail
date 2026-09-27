import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Component } from 'vue';
import { render } from 'vuemail';
import NotionMagicLinkEmail from './template/emails/notion-magic-link.vue';
import PlaidVerifyIdentityEmail from './template/emails/plaid-verify-identity.vue';
import StripeWelcomeEmail from './template/emails/stripe-welcome.vue';
import VercelInviteUserEmail from './template/emails/vercel-invite-user.vue';

const emails: [name: string, email: Component][] = [
  ['notion-magic-link', NotionMagicLinkEmail],
  ['plaid-verify-identity', PlaidVerifyIdentityEmail],
  ['stripe-welcome', StripeWelcomeEmail],
  ['vercel-invite-user', VercelInviteUserEmail],
];

describe('template emails', () => {
  it.each(emails)('renders %s with its PreviewProps', async (_name, email) => {
    const props = (email as { PreviewProps?: Record<string, unknown> })
      .PreviewProps;

    const html = await render(email, props);

    expect(html).toContain('<html');
    expect(html).not.toContain('{{');
    expect(html).not.toContain('[object Object]');
    expect(html).not.toContain('undefined');
    for (const value of Object.values(props ?? {})) {
      expect(html).toContain(String(value));
    }
    for (const [, image] of html.matchAll(/src="\/static\/([^"]+)"/g)) {
      expect(
        existsSync(
          new URL(`./template/emails/static/${image}`, import.meta.url),
        ),
        `${image} is missing from template/emails/static`,
      ).toBe(true);
    }
    await expect(render(email, props, { plainText: true })).resolves.toBeTypeOf(
      'string',
    );
  });
});
