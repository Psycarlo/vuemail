import mailchimpTransactional from '@mailchimp/mailchimp_transactional';
import { render } from 'vuemail';
import Email from './email.vue';

const mailchimp = mailchimpTransactional(process.env.MAILCHIMP_API_KEY || '');

const emailHtml = await render(Email, { url: 'https://example.com' });

await mailchimp.messages.send({
  message: {
    subject: 'Hello world',
    from_email: 'hello@example.com',
    to: [{ email: 'hello@example.com', type: 'to' }],
    html: emailHtml,
  },
});
