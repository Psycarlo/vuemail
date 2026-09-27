// @vitest-environment node
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { quickFetch } from './quick-fetch';

let server: http.Server;
let origin: string;

beforeAll(async () => {
  server = http.createServer((request, response) => {
    if (request.url === '/redirect') {
      response.writeHead(301, { Location: '/' });
      response.end();
    } else if (request.url === '/') {
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end('hello');
    }
    // Every other request is left hanging
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(async () => {
  server.closeAllConnections();
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

test('quickFetch() resolves with the response', async () => {
  const response = await quickFetch(new URL(`${origin}/`));
  expect(response.statusCode).toBe(200);
  let body = '';
  for await (const chunk of response) body += chunk;
  expect(body).toBe('hello');
});

test('quickFetch() does not follow redirects', async () => {
  const response = await quickFetch(new URL(`${origin}/redirect`));
  expect(response.statusCode).toBe(301);
  response.destroy();
});

test('quickFetch() gives up on requests that take too long', async () => {
  await expect(quickFetch(new URL(`${origin}/hanging`), 100)).rejects.toThrow();
});

test('quickFetch() rejects URLs it cannot request', async () => {
  await expect(quickFetch(new URL('tel:+1234567890'))).rejects.toThrow();
});
