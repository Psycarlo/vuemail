# Sending Guide

General guidelines for sending emails with Vuemail.

Important: Use verified domains in `from` addresses. Ask the user for the verified domain and use it in the `from` address. If the user does not have a verified domain, ask them to verify one with their email service provider.

Every provider takes the email as HTML: render it with `render` from `vuemail`, and render the plain text version with `{ plainText: true }`.

## Send with Resend (Recommended)

When you have access to the Resend MCP tool:

```ts
import { render } from 'vuemail';
import WelcomeEmail from './emails/welcome.vue';

const props = { name: 'John', verificationUrl: 'https://example.com/verify' };

// Render to HTML
const html = await render(WelcomeEmail, props);

// Create plain text version
const text = await render(WelcomeEmail, props, { plainText: true });

// Use Resend MCP send-email tool with:
// - to: recipient@example.com
// - subject: Welcome to Acme
// - html: html
// - text: text
```

If no MCP tool is available, you can use the Resend SDK for Node.js to send the email:

```ts
import { Resend } from 'resend';
import { render } from 'vuemail';
import WelcomeEmail from './emails/welcome.vue';

const resend = new Resend(process.env.RESEND_API_KEY);

const props = { name: 'John', verificationUrl: 'https://example.com/verify' };

const { data, error } = await resend.emails.send({
  from: 'Acme <onboarding@resend.dev>',
  to: ['user@example.com'],
  subject: 'Welcome to Acme',
  html: await render(WelcomeEmail, props),
  text: await render(WelcomeEmail, props, { plainText: true }),
});

if (error) {
  console.error('Failed to send:', error);
}
```

The `react` option of the SDK only takes React elements, so Vuemail emails are always sent through `html` and `text`.

## Send from Nuxt Server Routes

Nitro, the server of Nuxt, needs the `@vuemail/nuxt` module to import emails written as Vue single file components:

```sh
npm i vuemail @vuemail/nuxt resend
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vuemail/nuxt'],
});
```

Keep the emails in an `emails` directory at the root of the project, so that both the preview (`email dev`) and the server routes use them. `~~` is the root of the project in Nuxt imports:

```ts
// server/api/send.post.ts
import { Resend } from 'resend';
import { render } from 'vuemail';
import WelcomeEmail from '~~/emails/welcome.vue';

const resend = new Resend(process.env.RESEND_API_KEY);

export default defineEventHandler(async (event) => {
  const { name, email } = await readBody<{ name: string; email: string }>(event);
  const props = { name, verificationUrl: 'https://example.com/verify' };

  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: [email],
    subject: 'Welcome to Acme',
    html: await render(WelcomeEmail, props),
    text: await render(WelcomeEmail, props, { plainText: true }),
  });

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return data;
});
```

## Compile the Emails Outside of Nuxt

Plain Node can't import `.vue` files, so the code that renders emails needs a build step that compiles them: Vite (an SSR build, or vite-node), or a bundler with a Vue plugin. For example, with tsdown and `unplugin-vue`:

```ts
// tsdown.config.ts
import { defineConfig } from 'tsdown';
import vue from 'unplugin-vue/rolldown';

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm'],
  platform: 'node',
  // Compiles the emails, which are Vue single file components
  plugins: [vue({ isProduction: true })],
});
```

For TypeScript to type the imports of `.vue` files outside of `vue-tsc`, declare them:

```ts
// src/env.d.ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent;
  export default component;
}
```

## Send as a Template to Resend

If preferred, you can upload the email as a template to Resend, which can be used to send emails with the Resend SDK for Node.js:

```bash
npx vuemail@latest resend setup
```

This will require the user to provide a Resend API key in the terminal.

Once configured, the user can select a template to send using the UI in the "Resend" tab using the "Upload" button or the "Bulk Upload" button to upload multiple emails at once.

If using a template when sending with the Resend SDK for Node.js, the user can pass the template ID to the `send` method:

```ts
await resend.emails.send({
  from: 'Acme <onboarding@resend.dev>',
  to: ['user@example.com'],
  subject: 'Welcome to Acme',
  template: {
    id: '1245-1256-1234-1234',
  },
});
```

## Send with Other Providers

**Nodemailer:**

```ts
import nodemailer from 'nodemailer';
import { render } from 'vuemail';
import WelcomeEmail from './emails/welcome.vue';

const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const html = await render(WelcomeEmail, {
  name: 'John',
  verificationUrl: 'https://example.com/verify',
});

await transporter.sendMail({
  from: 'noreply@example.com',
  to: 'user@example.com',
  subject: 'Welcome',
  html,
});
```

**Mailgun:**

```ts
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { render } from 'vuemail';
import WelcomeEmail from './emails/welcome.vue';

const mailgun = new Mailgun(FormData);
const client = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
});

const html = await render(WelcomeEmail, {
  name: 'John',
  verificationUrl: 'https://example.com/verify',
});

await client.messages.create(process.env.MAILGUN_DOMAIN || '', {
  from: 'noreply@example.com',
  to: ['user@example.com'],
  subject: 'Welcome',
  html,
});
```

**SendGrid:**

```ts
import sgMail from '@sendgrid/mail';
import { render } from 'vuemail';
import WelcomeEmail from './emails/welcome.vue';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

const html = await render(WelcomeEmail, {
  name: 'John',
  verificationUrl: 'https://example.com/verify',
});

await sgMail.send({
  to: 'user@example.com',
  from: 'noreply@example.com',
  subject: 'Welcome',
  html,
});
```

The Vuemail repository has complete examples for these and other providers, like Postmark, AWS SES, and MailerSend, in [`examples`](https://github.com/psycarlo/vuemail/tree/main/examples).
