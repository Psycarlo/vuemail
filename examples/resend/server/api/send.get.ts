import { render } from 'vuemail';
import WaitlistEmail from '~~/emails/waitlist.vue';

export default defineEventHandler(async () => {
  const data = await resend.emails.send({
    from: 'bu@resend.dev',
    to: 'delivered@resend.dev',
    subject: 'Waitlist',
    html: await render(WaitlistEmail, { name: 'Bu' }),
  });

  return data;
});
