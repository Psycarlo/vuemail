// @vitest-environment node
import { fileURLToPath } from 'node:url';
import { type DevServer, startDevServer } from './dev-server';

vi.setConfig({ testTimeout: 30_000, hookTimeout: 30_000 });

const projectDirectory = fileURLToPath(
  new URL('./fixtures/project', import.meta.url),
);

describe('startDevServer()', () => {
  const cwd = process.cwd();
  let server: DevServer;
  let output: string[];

  const request = (pathname: string) =>
    fetch(`${server.url}${pathname}`, { redirect: 'manual' });

  beforeAll(async () => {
    process.chdir(projectDirectory);
    output = [];
    const collect = (...args: unknown[]) => {
      output.push(args.join(' '));
    };
    vi.spyOn(console, 'log').mockImplementation(collect);
    vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
      output.push(String(chunk));
      return true;
    });
    server = await startDevServer({
      emailsDir: 'emails',
      port: 0,
      version: '1.2.3',
    });
  });

  afterAll(async () => {
    await server.close();
    process.chdir(cwd);
    vi.restoreAllMocks();
  });

  it('tells where the preview runs, then that it is ready', () => {
    const text = output.join('\n');
    expect(text).toContain('Vuemail 1.2.3');
    expect(text).toContain(`Running preview at:          ${server.url}`);
    expect(text).toMatch(
      /Getting vuemail preview server ready\.\.\.[\s\S]*Ready in \d+\.\ds/,
    );
  });

  it('never lets anything be cached', async () => {
    for (const pathname of ['/', '/static/logo.png']) {
      const response = await request(pathname);
      expect(response.headers.get('cache-control')).toBe(
        'no-cache, max-age=0, must-revalidate, no-store',
      );
      expect(response.headers.get('pragma')).toBe('no-cache');
      expect(response.headers.get('expires')).toBe('-1');
    }
  });

  it('serves the preview app for the home page and the preview of emails', async () => {
    for (const pathname of [
      '/',
      '/preview/welcome',
      '/preview/auth/magic-link/code',
    ]) {
      const response = await request(pathname);
      expect(response.status, pathname).toBe(200);
      expect(await response.text()).toContain('window.__VUEMAIL_CONFIG__=');
    }
  });

  it('redirects home from the preview of an email that does not exist', async () => {
    const response = await request('/preview/nope');

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/');
  });

  it('drops trailing slashes', async () => {
    const response = await request('/preview/welcome/?view=source');

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe(
      '/preview/welcome?view=source',
    );
  });

  it('answers other paths with the preview app telling that there is nothing there', async () => {
    for (const pathname of [
      '/nope',
      '/preview',
      '/index.html',
      '/assets/nope.js',
    ]) {
      const response = await request(pathname);
      expect(response.status, pathname).toBe(404);
      expect(await response.text()).toContain('window.__VUEMAIL_CONFIG__=');
    }
  });

  it('serves the files of the static directory, and nothing outside of it', async () => {
    const file = await request('/static/logo.png');
    expect(file.status).toBe(200);
    expect(file.headers.get('content-type')).toBe('image/png');
    expect(file.headers.get('content-length')).toBe('13');

    expect((await request('/static/missing.png')).status).toBe(404);
    expect((await request('/static/..%2F..%2Fpackage.json')).status).toBe(403);
    expect((await request('/static/%E0%A4%A')).status).toBe(400);
  });
});
