// @vitest-environment node
import fs from 'node:fs';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ApiContext } from './api';
import { handleToolbarApiRequest } from './api-toolbar';
import { checkCompatibility } from './email-validation/check-compatibility';
import { getLintingRows } from './email-validation/linting';
import { createResendTemplates, uploadTemplateToResend } from './resend';

vi.mock('./email-validation/linting', () => ({
  getLintingRows: vi.fn(async () => []),
}));

vi.mock('./email-validation/check-compatibility', () => ({
  checkCompatibility: vi.fn(async () => [{ status: 'error' }]),
}));

const emailsDirectory = fileURLToPath(
  new URL('./fixtures/project/emails', import.meta.url),
);

vi.mock('./resend', () => ({
  createResendTemplates: vi.fn(() => ({})),
  uploadTemplateToResend: vi.fn(
    async (_templates: unknown, template: { name: string }) => ({
      name: template.name,
      status: 'succeeded',
      id: 'tmpl_123',
    }),
  ),
}));

let context: Partial<ApiContext> = {};
let server: http.Server;
let origin: string;

beforeAll(async () => {
  server = http.createServer(async (request, response) => {
    const handled = await handleToolbarApiRequest(
      context as ApiContext,
      request,
      response,
    );
    if (!handled) {
      response.writeHead(404);
      response.end();
    }
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(async () => {
  server.closeAllConnections();
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

afterEach(() => {
  context = {};
  vi.clearAllMocks();
});

const post = async (path: string, body: unknown) => {
  const response = await fetch(`${origin}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
};

describe('POST /api/toolbar/linter', () => {
  it('lints the markup, relative to the preview server by default', async () => {
    expect(await post('/api/toolbar/linter', { markup: '<p></p>' })).toEqual({
      status: 200,
      body: { rows: [] },
    });
    expect(getLintingRows).toHaveBeenCalledWith('<p></p>', origin);
  });

  it('lints relative to the given base', async () => {
    await post('/api/toolbar/linter', {
      markup: '<p></p>',
      base: 'http://localhost:3000',
    });
    expect(getLintingRows).toHaveBeenCalledWith(
      '<p></p>',
      'http://localhost:3000',
    );
  });

  it('requires the markup', async () => {
    expect((await post('/api/toolbar/linter', {})).status).toBe(400);
  });
});

describe('POST /api/toolbar/compatibility', () => {
  it('checks the source of the email against the given email clients', async () => {
    context = { emailsDirectory };

    expect(
      await post('/api/toolbar/compatibility', {
        slug: 'welcome',
        clients: ['outlook'],
      }),
    ).toEqual({ status: 200, body: { results: [{ status: 'error' }] } });

    const emailPath = path.join(emailsDirectory, 'welcome.vue');
    expect(checkCompatibility).toHaveBeenCalledWith(
      fs.readFileSync(emailPath, 'utf8'),
      emailPath,
      ['outlook'],
      expect.any(Function),
    );
  });

  it('has nothing to say about HTML emails', async () => {
    context = { emailsDirectory };

    expect(await post('/api/toolbar/compatibility', { slug: 'raw' })).toEqual({
      status: 200,
      body: { results: [] },
    });
    expect(checkCompatibility).not.toHaveBeenCalled();
  });

  it('requires an email that exists', async () => {
    context = { emailsDirectory };

    expect((await post('/api/toolbar/compatibility', {})).status).toBe(400);
    expect(
      (await post('/api/toolbar/compatibility', { slug: 'missing' })).status,
    ).toBe(404);
  });
});

describe('POST /api/toolbar/resend/upload', () => {
  it('uploads the template with the API key', async () => {
    context = { resendApiKey: 're_123' };
    expect(
      await post('/api/toolbar/resend/upload', {
        name: 'welcome',
        html: '<p>Welcome</p>',
      }),
    ).toEqual({
      status: 200,
      body: { name: 'welcome', status: 'succeeded', id: 'tmpl_123' },
    });
    expect(createResendTemplates).toHaveBeenCalledWith('re_123');
    expect(uploadTemplateToResend).toHaveBeenCalledWith(
      {},
      { name: 'welcome', html: '<p>Welcome</p>' },
    );
  });

  it('requires an API key', async () => {
    const { status, body } = await post('/api/toolbar/resend/upload', {
      name: 'welcome',
      html: '<p>Welcome</p>',
    });
    expect(status).toBe(400);
    expect(body.error).toContain('npx vuemail resend setup');
    expect(uploadTemplateToResend).not.toHaveBeenCalled();
  });

  it('requires the name and the HTML of the template', async () => {
    context = { resendApiKey: 're_123' };
    expect(
      (await post('/api/toolbar/resend/upload', { name: 'welcome' })).status,
    ).toBe(400);
  });
});

test('leaves other requests to the rest of the API', async () => {
  expect((await fetch(`${origin}/api/toolbar/linter`)).status).toBe(404);
  expect(
    (await fetch(`${origin}/api/render`, { method: 'POST', body: '{}' }))
      .status,
  ).toBe(404);
});
