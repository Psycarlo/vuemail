// @vitest-environment node
import { getLintingRows } from './linting';

vi.mock('./quick-fetch', () => ({
  quickFetch: vi.fn((url: URL) => {
    const statusCodes: Record<string, number> = {
      'https://vuemail.dev/': 200,
      'https://vuemail.dev/moved': 301,
      'https://vuemail.dev/missing': 404,
      'http://localhost:3000/static/logo.png': 200,
    };

    const statusCode = statusCodes[url.href];
    if (statusCode === undefined) {
      return Promise.reject(new Error(`Unexpected URL: ${url.href}`));
    }

    return Promise.resolve({
      statusCode,
      destroy: () => {},
      async *[Symbol.asyncIterator]() {
        yield Buffer.alloc(100);
      },
    });
  }),
}));

test('getLintingRows() leaves out what has no issues, errors first', async () => {
  const markup = `<body>
  <img src="/static/logo.png" />
  <img src="/static/logo.png" alt="Logo" />
  <a href="https://vuemail.dev/moved">Moved</a>
  <a href="https://vuemail.dev">Home</a>
  <a href="https://vuemail.dev/missing">Missing</a>
</body>`;
  const rows = await getLintingRows(markup, 'http://localhost:3000');

  expect(
    rows.map((row) => [
      row.source,
      row.result.status,
      row.result.codeLocation.line,
    ]),
  ).toEqual([
    ['link', 'error', 6],
    ['image', 'warning', 2],
    ['link', 'warning', 4],
  ]);
});

test('getLintingRows() resolves with no rows for markup without issues', async () => {
  expect(
    await getLintingRows(
      '<a href="https://vuemail.dev">Home</a>',
      'http://localhost:3000',
    ),
  ).toEqual([]);
});
