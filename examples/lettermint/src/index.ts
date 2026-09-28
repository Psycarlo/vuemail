import { render } from '@vuemaildev/vuemail';
import { Lettermint } from 'lettermint';
import Email from './email.vue';

const email = Lettermint.email(process.env.LETTERMINT_SENDING_TOKEN || '');

const emailHtml = await render(Email, { url: 'https://example.com' });

await email
  .from('you@example.com')
  .to('user@gmail.com')
  .subject('hello world')
  .html(emailHtml)
  .send();
