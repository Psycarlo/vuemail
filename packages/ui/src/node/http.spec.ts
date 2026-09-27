// @vitest-environment node
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serveFileFrom } from './http';

const staticDirectory = fileURLToPath(
  new URL('./fixtures/project/emails/static', import.meta.url),
);

describe('serveFileFrom()', () => {
  let server: http.Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = http.createServer(async (request, response) => {
      const { pathname } = new URL(request.url ?? '/', 'http://localhost');
      // Serves the same directory, given with a trailing separator
      const [directory, filePath] = pathname.startsWith('/with-separator/')
        ? [
            `${staticDirectory}${path.sep}`,
            pathname.slice('/with-separator'.length),
          ]
        : [staticDirectory, pathname];
      if (!(await serveFileFrom(directory, filePath, response))) {
        response.writeHead(404);
        response.end();
      }
    });
    await new Promise<void>((resolve) => server.listen(0, resolve));
    baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('serves the files of the directory with their content type', async () => {
    const response = await fetch(`${baseUrl}/logo.png`);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/png');
    expect(await response.text()).toBe('not an image\n');
  });

  it('serves from a directory given with a trailing separator', async () => {
    const response = await fetch(`${baseUrl}/with-separator/logo.png`);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('not an image\n');
  });

  it('refuses paths that escape the directory', async () => {
    for (const attempt of [
      '/..%2F..%2Fwelcome.vue',
      '/%2e%2e/%2e%2e/welcome.vue',
      '/..\\..\\welcome.vue',
    ]) {
      const response = await fetch(`${baseUrl}${attempt}`);
      expect(response.status, attempt).toBe(404);
    }
  });

  it("doesn't serve directories or missing files", async () => {
    expect((await fetch(`${baseUrl}/`)).status).toBe(404);
    expect((await fetch(`${baseUrl}/missing.png`)).status).toBe(404);
  });
});
