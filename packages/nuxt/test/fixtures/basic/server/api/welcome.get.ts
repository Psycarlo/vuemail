import { render } from 'vuemail';
import WelcomeEmail from '~~/emails/welcome.vue';

export default defineEventHandler(async (event) => {
  const { name = 'Ana', format } = getQuery(event);

  return render(
    WelcomeEmail,
    { name: String(name) },
    { plainText: format === 'text' },
  );
});
