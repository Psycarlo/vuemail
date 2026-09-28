import { createApp } from 'vue';
import { router } from '../router';
import NotFoundPage from './not-found-page.vue';

test('shows the page of paths with nothing to show', () => {
  for (const path of ['/nope', '/preview', '/static', '/a/b/c']) {
    expect(router.resolve(path).matched[0]?.components?.default, path).toBe(
      NotFoundPage,
    );
  }
});

test('tells that there is nothing there, as Next.js does', () => {
  const container = document.createElement('div');
  const app = createApp(NotFoundPage);
  app.mount(container);

  expect(container.querySelector('h1.next-error-h1')?.textContent?.trim()).toBe(
    '404',
  );
  expect(container.querySelector('h2')?.textContent?.trim()).toBe(
    'This page could not be found.',
  );
  expect(container.querySelector('style')?.textContent).toContain(
    '.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}',
  );
  expect(document.title).toBe('Vuemail');
  app.unmount();
});
