import { normalizePath } from 'vite';
import type { EmailRenderingResult } from '../shared/types';
import type { EmailLoader } from './email-loader';
import { renderEmailByPath } from './render-email';

export interface RenderingCache {
  render(
    emailPath: string,
    props?: Record<string, unknown>,
  ): Promise<EmailRenderingResult>;
  close(): void;
}

const getCacheKey = (
  emailPath: string,
  props: Record<string, unknown> | undefined,
) =>
  props === undefined ? emailPath : `${emailPath}\0${JSON.stringify(props)}`;

/**
 * Renders emails for the preview server, which logs every render it makes,
 * and keeps each successful render, for its props, until one of the files
 * it's made of changes or goes away: the email itself or anything it
 * imports.
 */
export function createRenderingCache(loader: EmailLoader): RenderingCache {
  const cache = new Map<
    string,
    { emailPath: string; result: EmailRenderingResult }
  >();
  // Renders going on, which may have used a file from before it changed
  const pendingRenders = new Set<{ emailPath: string; stale: boolean }>();

  const onFileEvent = (event: string, filePath: string) => {
    // Files that come can't be imported by a render that succeeded, and
    // the files of directories that go away are told about one by one
    if (event !== 'change' && event !== 'unlink') return;

    const dependents = loader.getDependents(filePath);
    for (const [key, { emailPath }] of cache) {
      if (dependents.has(normalizePath(emailPath))) cache.delete(key);
    }
    for (const render of pendingRenders) {
      if (dependents.has(normalizePath(render.emailPath))) render.stale = true;
    }
  };
  loader.watcher.on('all', onFileEvent);

  return {
    async render(emailPath, props) {
      const key = getCacheKey(emailPath, props);
      const cached = cache.get(key);
      if (cached) return cached.result;

      const pendingRender = { emailPath, stale: false };
      pendingRenders.add(pendingRender);
      try {
        const result = await renderEmailByPath(loader, emailPath, props, {
          logging: true,
        });
        if (!('error' in result) && !pendingRender.stale) {
          cache.set(key, { emailPath, result });
        }
        return result;
      } finally {
        pendingRenders.delete(pendingRender);
      }
    },
    close() {
      loader.watcher.off('all', onFileEvent);
      cache.clear();
    },
  };
}
