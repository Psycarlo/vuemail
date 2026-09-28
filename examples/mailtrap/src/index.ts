import { render } from '@vuemaildev/vuemail';
import { MailtrapClient } from 'mailtrap';
import Email from './email.vue';

const mailtrap = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN || '',
});

const emailHtml = await render(Email, { url: 'https://example.com' });

await mailtrap.send({
  from: { name: 'Acme', email: 'hello@example.com' },
  to: [{ email: 'hello@example.com' }],
  subject: 'Hello world',
  html: emailHtml,
});
