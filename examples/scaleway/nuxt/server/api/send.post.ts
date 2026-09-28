import { render } from '@vuemaildev/vuemail';
import WaitlistEmail from '~~/emails/waitlist.vue';

export default defineEventHandler(async () => {
  await scalewayTEM.createEmail({
    from: {
      email: 'you@example.com',
      name: 'You',
    },
    to: [
      {
        email: 'user@gmail.com',
        name: 'User',
      },
    ],
    subject: 'Waitlist',
    html: await render(WaitlistEmail, { name: 'User' }),
    text: '',
  });

  return { data: 'Email sent successfully' };
});
