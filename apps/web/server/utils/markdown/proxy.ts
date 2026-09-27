const MARKDOWN_TYPE = 'text/markdown; charset=utf-8';

/** The route with the markdown twin of a page, if it has one. */
export const markdownPathFor = (pathname: string): string | null => {
  if (pathname === '/') {
    return '/llms.txt';
  }
  if (pathname === '/components') {
    return '/api/markdown/components';
  }
  if (pathname === '/templates') {
    return '/api/markdown/templates';
  }
  const category = pathname.match(/^\/components\/([\w-]+)$/);
  if (category) {
    return `/api/markdown/components/${category[1]}`;
  }
  return null;
};

// The paths React Email's proxy (its Next.js middleware) runs for
const proxiedPaths = new Set([
  '/',
  '/components',
  '/components.md',
  '/templates',
  '/templates.md',
]);
const isProxied = (pathname: string) =>
  proxiedPaths.has(pathname) || /^\/components\/[^/]+$/.test(pathname);

export interface MarkdownResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

/**
 * Serves the markdown twin of a page, at the URL of the page with `.md`
 * appended, or at the URL of the page itself when the request negotiates it
 * with `Accept: text/markdown`. Resolves with `undefined` when the request
 * should go on to the page.
 *
 * @param fetchTarget Fetches a route of the website, like `/llms.txt`
 */
export async function proxyMarkdown(
  { pathname, accept }: { pathname: string; accept: string },
  fetchTarget: (path: string) => Promise<Response>,
): Promise<MarkdownResponse | undefined> {
  if (!isProxied(pathname)) return undefined;

  const endsWithMd = pathname.endsWith('.md');
  if (!endsWithMd && !accept.toLowerCase().includes('text/markdown')) {
    return undefined;
  }

  const target = markdownPathFor(
    endsWithMd ? pathname.slice(0, -'.md'.length) : pathname,
  );
  if (!target) {
    if (endsWithMd) {
      return {
        status: 404,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        body: 'Not found. Markdown is available at https://vuemail.dev/components.md and https://vuemail.dev/templates.md',
      };
    }
    return undefined;
  }

  const upstream = await fetchTarget(target);

  // Like a rewrite, the markdown route's response as it is
  if (endsWithMd) {
    const headers: Record<string, string> = {};
    const contentType = upstream.headers.get('content-type');
    if (contentType) headers['Content-Type'] = contentType;
    const cacheControl = upstream.headers.get('cache-control');
    if (cacheControl) headers['Cache-Control'] = cacheControl;
    return { status: upstream.status, headers, body: await upstream.text() };
  }

  if (!upstream.ok) {
    return undefined;
  }
  const headers: Record<string, string> = {
    'Content-Type': MARKDOWN_TYPE,
    Vary: 'Accept',
  };
  const cacheControl = upstream.headers.get('cache-control');
  if (cacheControl) {
    headers['Cache-Control'] = cacheControl;
  }
  return { status: 200, headers, body: await upstream.text() };
}
