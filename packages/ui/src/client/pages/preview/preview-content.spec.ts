import { type App, createApp, defineComponent, h, nextTick, ref } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import type { EmailRenderingResult } from '../../../shared/types';
import { providePropsPanel } from '../../composables/use-props-panel';
import { provideShell } from '../../composables/use-shell';
import { provideWorkspaceId } from '../../composables/use-workspace';
import PreviewContent from './preview-content.vue';

class FakeEventSource {
  addEventListener() {}
  close() {}
}

let app: App | undefined;

beforeEach(() => {
  vi.stubGlobal('EventSource', FakeEventSource);
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      throw new Error('No requests expected');
    }),
  );
});

afterEach(() => {
  app?.unmount();
  app = undefined;
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
});

const mountPreview = async (
  emailSlug: string,
  serverRenderingResult: EmailRenderingResult,
) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/preview/:slug(.*)', component: { render: () => null } }],
  });
  await router.push(`/preview/${emailSlug}`);

  const container = document.createElement('div');
  document.body.append(container);
  // As the preview page does, under the app
  const PreviewPage = defineComponent({
    setup() {
      providePropsPanel();
      return () => h(PreviewContent, { emailSlug, serverRenderingResult });
    },
  });
  app = createApp(
    defineComponent({
      setup() {
        provideWorkspaceId('workspace');
        provideShell({ sidebarToggled: ref(true), toggleSidebar: () => {} });
        return () => h(PreviewPage);
      },
    }),
  );
  app.use(router);
  app.mount(container);
  await nextTick();
  return container;
};

test('titles an email that fails to render with its file name', async () => {
  const container = await mountPreview('auth/broken', {
    error: {
      name: 'Error',
      message: 'This email is broken',
      stack: ' at setup (broken.vue:4:7)',
    },
    basename: 'broken',
    extname: 'vue',
  });

  expect(container.querySelector('header h2')?.textContent?.trim()).toBe(
    'broken.vue',
  );
  expect(container.textContent).toContain('Error: This email is broken');
  expect(container.querySelector('pre')?.textContent).toBe(
    ' at setup (broken.vue:4:7)',
  );
});

test('titles an email with the last part of its slug when its file is unknown', async () => {
  const container = await mountPreview('auth/broken', {
    error: { name: 'Error', message: 'Request failed', stack: undefined },
  });

  expect(container.querySelector('header h2')?.textContent?.trim()).toBe(
    'broken',
  );
});
