// @vitest-environment node
import type { IncomingMessage } from 'node:http';
import { checkImages } from './check-images';

vi.mock('./quick-fetch', () => ({
  quickFetch: vi.fn((url: URL) => {
    const withBody = (statusCode: number, byteCount: number) => ({
      statusCode,
      async *[Symbol.asyncIterator]() {
        yield Buffer.alloc(byteCount);
      },
    });
    const mockResponses: Record<string, Partial<IncomingMessage>> = {
      'https://cdn.resend.com/brand/resend-icon-black.png': withBody(
        200,
        24534,
      ),
      'https://demo.vuemail.dev/static/codepen-challengers.png': withBody(
        200,
        111922,
      ),
      'http://vuemail.dev/static/logo.png': withBody(200, 2000),
      'https://vuemail.dev/static/huge.png': withBody(200, 2_000_000),
      'https://vuemail.dev/static/missing.png': withBody(404, 10),
    };

    const response = mockResponses[url.href];
    if (!response) {
      return Promise.reject(new Error(`Unexpected URL: ${url.href}`));
    }

    return Promise.resolve(response);
  }),
}));

test('checkImages()', async () => {
  const html = `<div>
  <img src="https://cdn.resend.com/brand/resend-icon-black.png" />,
  <img src="/static/codepen-challengers.png" alt="codepen challenges" />,
</div>`;
  expect(
    await checkImages(html, 'https://demo.vuemail.dev'),
  ).toMatchInlineSnapshot(`
      [
        {
          "checks": [
            {
              "metadata": {
                "alt": undefined,
              },
              "passed": false,
              "type": "accessibility",
            },
            {
              "passed": true,
              "type": "syntax",
            },
            {
              "passed": true,
              "type": "security",
            },
            {
              "metadata": {
                "fetchStatusCode": 200,
              },
              "passed": true,
              "type": "fetch_attempt",
            },
            {
              "metadata": {
                "byteCount": 24534,
              },
              "passed": true,
              "type": "image_size",
            },
          ],
          "codeLocation": {
            "column": 3,
            "line": 2,
          },
          "source": "https://cdn.resend.com/brand/resend-icon-black.png",
          "status": "warning",
        },
        {
          "checks": [
            {
              "metadata": {
                "alt": "codepen challenges",
              },
              "passed": true,
              "type": "accessibility",
            },
            {
              "passed": true,
              "type": "syntax",
            },
            {
              "passed": true,
              "type": "security",
            },
            {
              "metadata": {
                "fetchStatusCode": 200,
              },
              "passed": true,
              "type": "fetch_attempt",
            },
            {
              "metadata": {
                "byteCount": 111922,
              },
              "passed": true,
              "type": "image_size",
            },
          ],
          "codeLocation": {
            "column": 3,
            "line": 3,
          },
          "source": "/static/codepen-challengers.png",
          "status": "success",
        },
      ]
    `);
});

test('checkImages() warns about insecure and large images', async () => {
  const [insecure, huge] = await checkImages(
    `<img src="http://vuemail.dev/static/logo.png" alt="Logo" />
<img src="https://vuemail.dev/static/huge.png" alt="" />`,
    '',
  );

  expect(insecure?.status).toBe('warning');
  expect(insecure?.checks).toContainEqual({ passed: false, type: 'security' });

  expect(huge?.status).toBe('warning');
  expect(huge?.checks).toContainEqual({
    type: 'image_size',
    passed: false,
    metadata: { byteCount: 2_000_000 },
  });
  // An empty alt text is fine, for images that are only decorative
  expect(huge?.checks).toContainEqual({
    type: 'accessibility',
    passed: true,
    metadata: { alt: '' },
  });
});

test('checkImages() reports broken and unreachable images', async () => {
  const [missing, unreachable, invalid] = await checkImages(
    `<img src="https://vuemail.dev/static/missing.png" alt="Missing" />
<img src="https://unreachable.vuemail.dev/logo.png" alt="Unreachable" />
<img src="/static/logo.png" alt="Relative, without a base" />`,
    '',
  );

  expect(missing?.status).toBe('error');
  expect(missing?.checks).toContainEqual({
    type: 'fetch_attempt',
    passed: false,
    metadata: { fetchStatusCode: 404 },
  });

  expect(unreachable?.status).toBe('error');
  expect(unreachable?.checks).toContainEqual({
    type: 'fetch_attempt',
    passed: false,
    metadata: { fetchStatusCode: undefined },
  });

  expect(invalid?.status).toBe('error');
  expect(invalid?.checks).toContainEqual({ passed: false, type: 'syntax' });
});
