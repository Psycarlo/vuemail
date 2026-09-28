import { type App, createApp, defineComponent, h, nextTick } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import type { LintingRow, RenderedEmailMetadata } from '../../../shared/types';
import { provideWorkspaceId } from '../../composables/use-workspace';
import { VUEMAIL_DATA_STORAGE_KEY } from '../../utils/workspace-storage';
import EmailToolbar from './email-toolbar.vue';

const rendering: RenderedEmailMetadata = {
  previewProps: {},
  markup:
    '<html><body><a href="https://vuemail.dev/missing">Missing</a></body></html>',
  prettyMarkup: `<html>
  <body>
    <a href="https://vuemail.dev/missing">Missing</a>
  </body>
</html>`,
  plainText: 'Missing',
  source: '<template><Html /></template>',
  basename: 'welcome',
  extname: 'vue',
};

const lintingRows: LintingRow[] = [
  {
    source: 'link',
    result: {
      status: 'error',
      link: 'https://vuemail.dev/missing',
      codeLocation: { line: 3, column: 5 },
      checks: [
        { type: 'syntax', passed: true },
        { type: 'security', passed: true },
        {
          type: 'fetch_attempt',
          passed: false,
          metadata: { fetchStatusCode: 404 },
        },
      ],
    },
  },
];

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
  });

const fetchMock = vi.fn(async (input: string, _init?: RequestInit) => {
  switch (input) {
    case '/api/toolbar/linter':
      return jsonResponse({ rows: lintingRows });
    case '/api/toolbar/compatibility':
      return jsonResponse({ results: [] });
    case 'https://vuemail.dev/api/check-spam':
      return jsonResponse({ isSpam: false, points: 0, checks: [] });
    default:
      throw new Error(`Unexpected request to ${input}`);
  }
});

let app: App | undefined;

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  localStorage.clear();
});

afterEach(() => {
  app?.unmount();
  app = undefined;
  document.body.innerHTML = '';
  fetchMock.mockClear();
  vi.unstubAllGlobals();
});

const settle = async () => {
  for (let i = 0; i < 10; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await nextTick();
  }
};

const mountToolbar = async (url: string, emailRendering = rendering) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/preview/:slug(.*)', component: { render: () => null } }],
  });
  await router.push(url);

  const container = document.createElement('div');
  document.body.append(container);
  app = createApp(
    defineComponent({
      setup() {
        provideWorkspaceId('workspace');
        return () =>
          h(EmailToolbar, { slug: 'welcome', rendering: emailRendering });
      },
    }),
  );
  app.use(router);
  app.mount(container);
  await settle();

  const getTab = (label: string) =>
    [...container.querySelectorAll<HTMLElement>('[role="tab"]')].find(
      (tab) => tab.textContent?.trim() === label,
    );

  return { container, router, getTab };
};

test('runs the checks and shows the results of the open panel', async () => {
  const { container } = await mountToolbar(
    '/preview/Community/welcome?toolbar-panel=linter',
  );

  expect(fetchMock.mock.calls.map(([input]) => input).sort()).toEqual([
    '/api/toolbar/compatibility',
    '/api/toolbar/linter',
    'https://vuemail.dev/api/check-spam',
  ]);
  expect(container.textContent).toContain('fetch attempt');
  expect(container.textContent).toContain('The link is broken');
  expect(container.textContent).toContain('HTTP 404');

  const lineLink = container.querySelector('a[href*="view=source"]');
  expect(lineLink?.textContent).toBe('L03');
  expect(lineLink?.getAttribute('href')).toBe(
    '/preview/Community/welcome?toolbar-panel=linter&view=source&lang=html#L3',
  );
});

test('runs the checks one after the other', async () => {
  await mountToolbar('/preview/Community/welcome');

  expect(fetchMock.mock.calls.map(([input]) => input)).toEqual([
    '/api/toolbar/linter',
    'https://vuemail.dev/api/check-spam',
    '/api/toolbar/compatibility',
  ]);
});

test('caches the results of the checks for the email', async () => {
  await mountToolbar('/preview/Community/welcome');

  const cached = JSON.parse(
    localStorage.getItem(VUEMAIL_DATA_STORAGE_KEY) ?? '{}',
  );
  expect(cached.workspace['linter:welcome']).toEqual(lintingRows);
  expect(cached.workspace['compatibility:welcome']).toEqual([]);
  expect(cached.workspace['spam-assassin:welcome']).toEqual({
    isSpam: false,
    points: 0,
    checks: [],
  });
});

test('switches panels with the tabs', async () => {
  const { container, router, getTab } = await mountToolbar(
    '/preview/Community/welcome?toolbar-panel=linter',
  );
  expect(getTab('Linter')?.dataset.state).toBe('active');

  getTab('Compatibility')?.dispatchEvent(
    new MouseEvent('mousedown', { bubbles: true, button: 0 }),
  );
  await settle();

  // The slashes of the slug stay as they are
  expect(router.currentRoute.value.fullPath).toBe(
    '/preview/Community/welcome?toolbar-panel=compatibility',
  );
  expect(getTab('Compatibility')?.dataset.state).toBe('active');
  expect(getTab('Linter')?.dataset.state).toBe('inactive');
  expect(container.textContent).toContain('Great compatibility');
  expect(container.textContent).toContain(
    'Template should render properly in Gmail, Apple Mail, Outlook, Yahoo! Mail.',
  );
});

test('collapses and opens with the toggle button', async () => {
  const { container, router } = await mountToolbar(
    '/preview/Community/welcome?toolbar-panel=spam-assassin',
  );
  const toolbar = container.firstElementChild as HTMLElement;
  expect(toolbar.dataset.toggled).toBe('true');
  expect(container.textContent).toContain('10/10');

  const buttons = [...container.querySelectorAll('button')];
  buttons.at(-1)?.click();
  await settle();

  expect(router.currentRoute.value.query['toolbar-panel']).toBeUndefined();
  expect(toolbar.dataset.toggled).toBe('false');

  buttons.at(-1)?.click();
  await settle();
  expect(router.currentRoute.value.query['toolbar-panel']).toBe('linter');
});

test('asks to connect to Resend without an API key', async () => {
  const { container } = await mountToolbar(
    '/preview/Community/welcome?toolbar-panel=resend',
  );
  expect(container.textContent).toContain('Connect to Resend');
  expect(container.querySelector('code')?.textContent).toBe(
    'npx @vuemaildev/vuemail@latest resend setup',
  );
});

test("doesn't check the compatibility of raw HTML emails", async () => {
  const { container, getTab } = await mountToolbar(
    '/preview/Community/welcome?toolbar-panel=compatibility',
    { ...rendering, source: rendering.markup, extname: 'html' },
  );

  expect(fetchMock.mock.calls.map(([input]) => input)).toEqual([
    '/api/toolbar/linter',
    'https://vuemail.dev/api/check-spam',
  ]);
  expect(getTab('Compatibility')).toBeUndefined();
  expect(container.textContent).toContain('Compatibility unavailable');
  expect(container.textContent).toContain(
    'Compatibility checks rely on the Vuemail source and are skipped for raw HTML templates.',
  );
});

test('checks the compatibility of the email by its slug', async () => {
  await mountToolbar('/preview/Community/welcome');

  const [, init] =
    fetchMock.mock.calls.find(
      ([input]) => input === '/api/toolbar/compatibility',
    ) ?? [];
  expect(JSON.parse(String(init?.body))).toEqual({
    slug: 'welcome',
    clients: [],
  });
});
