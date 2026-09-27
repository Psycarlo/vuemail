// @vitest-environment node
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import type { ApiContext } from './api';
import { handleToolbarApiRequest } from './api-toolbar';
import { getLintingRows } from './email-validation/linting';
import { createResendTemplates, uploadTemplateToResend } from './resend';

vi.mock('./email-validation/linting', () => ({
  getLintingRows: vi.fn(async () => []),
}));

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
  it('checks the markup against the given email clients', async () => {
    const { status, body } = await post('/api/toolbar/compatibility', {
      markup: '<div style="border-radius: 4px"></div>',
      clients: ['outlook'],
    });
    expect(status).toBe(200);
    const result = body.results.find(
      (result: { entry: { slug: string } }) =>
        result.entry.slug === 'css-border-radius',
    );
    expect(Object.keys(result.statsPerEmailClient)).toEqual(['outlook']);
    expect(result.location.start.line).toBe(1);
  });

  it('requires the markup', async () => {
    expect((await post('/api/toolbar/compatibility', {})).status).toBe(400);
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
