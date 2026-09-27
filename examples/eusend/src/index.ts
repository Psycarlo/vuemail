import { Eusend } from '@eusend_dev/sdk';
import { render } from 'vuemail';
import Email from './email.vue';

const eusend = new Eusend(process.env.EUSEND_API_KEY);

await eusend.emails.send({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html: await render(Email, { url: 'https://example.com' }),
});
