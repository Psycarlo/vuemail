import { test } from 'vitest';
import { render } from 'vuemail';
import EmailWithTailwind from './emails/with-tailwind.vue';
import EmailWithoutTailwind from './emails/without-tailwind.vue';

test('with vs without tailwind', async ({ bench }) => {
  await bench.compare(
    bench('without tailwind', async () => {
      await render(EmailWithoutTailwind);
    }),
    bench('with tailwind', async () => {
      await render(EmailWithTailwind);
    }),
    { time: 100 },
  );
});
