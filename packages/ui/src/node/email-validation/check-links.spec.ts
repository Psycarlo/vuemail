// @vitest-environment node
import { checkLinks } from './check-links';
import { quickFetch } from './quick-fetch';

vi.mock('./quick-fetch', () => ({
  quickFetch: vi.fn((url: URL) => {
    const mockResponses: Record<string, { statusCode: number }> = {
      'https://resend.com/': { statusCode: 200 },
      'https://notion.so/': { statusCode: 301 },
      'http://vuemail.dev/': { statusCode: 308 },
      'https://vuemail.dev/docs?a=1&b=2': { statusCode: 404 },
    };

    const response = mockResponses[url.href];
    if (!response) {
      return Promise.reject(new Error(`Unexpected URL: ${url.href}`));
    }

    return Promise.resolve({
      statusCode: response.statusCode,
      destroy: () => {},
    });
  }),
}));

afterEach(() => {
  vi.mocked(quickFetch).mockClear();
});

test('checkLinks()', async () => {
  const html = `<div>
  <a href="/">Root</a>
  <a href="https://resend.com">Resend</a>
  <a href="https://notion.so">Notion</a>
  <a href="http://vuemail.dev">Vuemail unsafe</a>
</div>`;
  expect(await checkLinks(html)).toMatchInlineSnapshot(`
    [
      {
        "checks": [
          {
            "passed": false,
            "type": "syntax",
          },
        ],
        "codeLocation": {
          "column": 3,
          "line": 2,
        },
        "link": "/",
        "status": "error",
      },
      {
        "checks": [
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
        ],
        "codeLocation": {
          "column": 3,
          "line": 3,
        },
        "link": "https://resend.com",
        "status": "success",
      },
      {
        "checks": [
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
              "fetchStatusCode": 301,
            },
            "passed": false,
            "type": "fetch_attempt",
          },
        ],
        "codeLocation": {
          "column": 3,
          "line": 4,
        },
        "link": "https://notion.so",
        "status": "warning",
      },
      {
        "checks": [
          {
            "passed": true,
            "type": "syntax",
          },
          {
            "passed": false,
            "type": "security",
          },
          {
            "metadata": {
              "fetchStatusCode": 308,
            },
            "passed": false,
            "type": "fetch_attempt",
          },
        ],
        "codeLocation": {
          "column": 3,
          "line": 5,
        },
        "link": "http://vuemail.dev",
        "status": "warning",
      },
    ]
  `);
});

test('checkLinks() skips mailto links and links in comments', async () => {
  const html = `<a href="mailto:hello@vuemail.dev">Mail us</a>
<!--[if mso]><a href="https://notion.so">Outlook only</a><![endif]-->
<a>No link</a>`;
  expect(await checkLinks(html)).toEqual([]);
  expect(quickFetch).not.toHaveBeenCalled();
});

test('checkLinks() decodes the links and fetches each of them once', async () => {
  const html = `<a href="https://vuemail.dev/docs?a=1&amp;b=2">Docs</a>
<a href="https://vuemail.dev/docs?a=1&b=2">Docs again</a>`;
  const results = await checkLinks(html);

  expect(results.map((result) => result.link)).toEqual([
    'https://vuemail.dev/docs?a=1&b=2',
    'https://vuemail.dev/docs?a=1&b=2',
  ]);
  expect(results.map((result) => result.status)).toEqual(['error', 'error']);
  expect(quickFetch).toHaveBeenCalledTimes(1);
});

test('checkLinks() reports the links that could not be reached', async () => {
  const [result] = await checkLinks(
    '<a href="https://unreachable.vuemail.dev">Nowhere</a>',
  );
  expect(result?.status).toBe('error');
  expect(result?.checks.at(-1)).toEqual({
    type: 'fetch_attempt',
    passed: false,
    metadata: { fetchStatusCode: undefined },
  });
});
