import { describe, expect, it, vi } from 'vitest';
import { markdownPathFor, proxyMarkdown } from './proxy';

const browserAccept =
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8';

const upstream = (body: string, status = 200) =>
  new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });

describe('proxyMarkdown()', () => {
  it('passes browser requests through untouched', async () => {
    const fetchMock = vi.fn();

    const response = await proxyMarkdown(
      { pathname: '/components/headers', accept: browserAccept },
      fetchMock,
    );

    expect(response).toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('serves llms.txt as markdown for the homepage when Accept negotiates markdown', async () => {
    const fetchMock = vi.fn().mockResolvedValue(upstream('# Vuemail'));

    const response = await proxyMarkdown(
      { pathname: '/', accept: 'text/markdown' },
      fetchMock,
    );

    expect(fetchMock).toHaveBeenCalledWith('/llms.txt');
    expect(response).toEqual({
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        Vary: 'Accept',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
      body: '# Vuemail',
    });
  });

  it('serves negotiated component pages as markdown with Vary: Accept', async () => {
    const fetchMock = vi.fn().mockResolvedValue(upstream('# Headers'));

    const response = await proxyMarkdown(
      {
        pathname: '/components/headers',
        accept: 'text/markdown, text/plain;q=0.9',
      },
      fetchMock,
    );

    expect(fetchMock).toHaveBeenCalledWith('/api/markdown/components/headers');
    expect(response?.headers['Content-Type']).toBe(
      'text/markdown; charset=utf-8',
    );
    expect(response?.headers.Vary).toBe('Accept');
    expect(response?.body).toBe('# Headers');
  });

  it('serves the negotiated templates page as markdown', async () => {
    const fetchMock = vi.fn().mockResolvedValue(upstream('# Templates'));

    const response = await proxyMarkdown(
      { pathname: '/templates', accept: 'TEXT/MARKDOWN' },
      fetchMock,
    );

    expect(fetchMock).toHaveBeenCalledWith('/api/markdown/templates');
    expect(response?.headers.Vary).toBe('Accept');
  });

  it('falls back to the page when the markdown twin is not ok', async () => {
    const fetchMock = vi.fn().mockResolvedValue(upstream('missing', 404));

    const response = await proxyMarkdown(
      { pathname: '/components/nope', accept: 'text/markdown' },
      fetchMock,
    );

    expect(response).toBeUndefined();
  });

  it('serves explicit .md paths with the response of their twin, without forcing Vary', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('# Headers', {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      }),
    );

    const response = await proxyMarkdown(
      { pathname: '/components/headers.md', accept: browserAccept },
      fetchMock,
    );

    expect(fetchMock).toHaveBeenCalledWith('/api/markdown/components/headers');
    expect(response).toEqual({
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
      body: '# Headers',
    });
  });

  it('keeps the status of the twin of an explicit .md path', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(upstream('No component category "nope".', 404));

    const response = await proxyMarkdown(
      { pathname: '/components/nope.md', accept: '*/*' },
      fetchMock,
    );

    expect(response?.status).toBe(404);
    expect(response?.body).toBe('No component category "nope".');
  });

  it('serves the components and templates indexes', async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(async () => upstream('# Index'));

    await proxyMarkdown({ pathname: '/components.md', accept: '' }, fetchMock);
    await proxyMarkdown({ pathname: '/templates.md', accept: '' }, fetchMock);

    expect(fetchMock.mock.calls).toEqual([
      ['/api/markdown/components'],
      ['/api/markdown/templates'],
    ]);
  });

  it('passes through negotiated paths that have no markdown twin', async () => {
    const fetchMock = vi.fn();

    const response = await proxyMarkdown(
      { pathname: '/editor', accept: 'text/markdown' },
      fetchMock,
    );

    expect(response).toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('leaves the .md paths it does not handle to the website', async () => {
    const fetchMock = vi.fn();

    const response = await proxyMarkdown(
      { pathname: '/editor/basic-editor.md', accept: '' },
      fetchMock,
    );

    expect(response).toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('answers an explicit .md path with no twin with a plain 404', async () => {
    const fetchMock = vi.fn();

    const response = await proxyMarkdown(
      { pathname: '/components/foo.bar.md', accept: '' },
      fetchMock,
    );

    expect(response?.status).toBe(404);
    expect(response?.headers['Content-Type']).toBe('text/plain; charset=utf-8');
    expect(response?.body).toContain('https://vuemail.dev/components.md');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('markdownPathFor()', () => {
  it('maps the pages with a markdown twin to it', () => {
    expect(markdownPathFor('/')).toBe('/llms.txt');
    expect(markdownPathFor('/components')).toBe('/api/markdown/components');
    expect(markdownPathFor('/templates')).toBe('/api/markdown/templates');
    expect(markdownPathFor('/components/code-block')).toBe(
      '/api/markdown/components/code-block',
    );
    expect(markdownPathFor('/components/code-block/extra')).toBeNull();
    expect(markdownPathFor('/editor')).toBeNull();
  });
});
