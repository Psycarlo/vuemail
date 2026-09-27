import type {
  EmailRenderingResult,
  EmailsDirectory,
  HotReloadChange,
} from '../shared/types';
import { isStatic } from './config';

/** A request the server answered with an error status. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const fetchJson = async <Response>(
  input: string,
  init?: RequestInit,
): Promise<Response> => {
  const response = await fetch(input, init);
  if (!response.ok) {
    // Error bodies aren't always JSON, as with a built preview's 404 page
    const body = (await response.json().catch(() => undefined)) as unknown;
    throw new ApiError(
      typeof body === 'object' && body !== null && 'error' in body
        ? String(body.error)
        : `Request to ${input} failed with ${response.status}`,
      response.status,
    );
  }
  return (await response.json()) as Response;
};

const encodeSlug = (slug: string) =>
  slug.split('/').map(encodeURIComponent).join('/');

export async function fetchEmailsDirectory(): Promise<EmailsDirectory> {
  const { directory } = await fetchJson<{ directory: EmailsDirectory }>(
    isStatic ? '/data/emails.json' : '/api/emails',
  );
  return directory;
}

/**
 * Renders an email with the props given, or its `PreviewProps`. Built
 * previews only have the renders made at build time, with `PreviewProps`.
 *
 * Rejects with an `ApiError` with a 404 status when there is no such email.
 */
export async function renderEmail(
  slug: string,
  props?: Record<string, unknown>,
): Promise<EmailRenderingResult> {
  if (isStatic) {
    return fetchJson(`/data/render/${encodeSlug(slug)}.json`);
  }
  return fetchJson('/api/render', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, props }),
  });
}

type HotReloadListener = (changes: HotReloadChange[]) => void;

const hotReloadListeners = new Set<HotReloadListener>();
let hotReloadSource: EventSource | undefined;

/**
 * Calls back with the files that change, until the returned function is
 * called.
 *
 * Every subscriber shares a single connection: browsers only keep a handful
 * of connections open to the same server, and each event stream holds one.
 */
export function subscribeToHotReload(onReload: HotReloadListener): () => void {
  if (isStatic) return () => {};

  if (!hotReloadSource) {
    hotReloadSource = new EventSource('/api/events');
    hotReloadSource.addEventListener('reload', (event) => {
      const changes = JSON.parse(
        (event as MessageEvent<string>).data,
      ) as HotReloadChange[];
      for (const listener of [...hotReloadListeners]) {
        listener(changes);
      }
    });
  }
  const listener: HotReloadListener = (changes) => onReload(changes);
  hotReloadListeners.add(listener);

  return () => {
    hotReloadListeners.delete(listener);
    if (hotReloadListeners.size === 0) {
      hotReloadSource?.close();
      hotReloadSource = undefined;
    }
  };
}
