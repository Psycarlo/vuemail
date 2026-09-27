import type http from 'node:http';
import path from 'node:path';
import type { HotReloadChange } from '../shared/types';
import type { EmailLoader } from './email-loader';
import { isPathWithinDirectory } from './emails-directory';

export interface HotReload {
  /** Keeps a request open as a stream of server-sent events. */
  connect(request: http.IncomingMessage, response: http.ServerResponse): void;
  close(): void;
}

const debounce = (callback: () => void, wait: number) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, wait);
  };
};

/**
 * Tells the preview app about files that changed, with server-sent events.
 *
 * Changes are batched for a moment so that saving several files at once, as
 * formatters do, reloads the preview a single time. Files outside of the
 * emails directory are only sent when emails import them, like shared
 * components, and are sent relative to it.
 */
export function setupHotReload(
  loader: EmailLoader,
  emailsDirectory: string,
): HotReload {
  const clients = new Set<http.ServerResponse>();
  let changes: HotReloadChange[] = [];

  const flush = debounce(() => {
    const payload = `event: reload\ndata: ${JSON.stringify(changes)}\n\n`;
    for (const client of clients) {
      client.write(payload);
    }
    changes = [];
  }, 150);

  const onChange = (event: HotReloadChange['event'], filePath: string) => {
    const isRelevant =
      isPathWithinDirectory(emailsDirectory, filePath) ||
      loader.isImported(filePath);
    if (!isRelevant) return;

    changes.push({
      event,
      filename: path.relative(emailsDirectory, filePath).replaceAll('\\', '/'),
    });
    flush();
  };

  loader.watcher.on('all', onChange);

  // Keeps connections alive through proxies that drop idle ones
  const heartbeat = setInterval(() => {
    for (const client of clients) {
      client.write(': ping\n\n');
    }
  }, 30_000);
  heartbeat.unref();

  return {
    connect(request, response) {
      response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      });
      response.write(': connected\n\n');
      clients.add(response);
      request.on('close', () => clients.delete(response));
    },
    close() {
      clearInterval(heartbeat);
      loader.watcher.off('all', onChange);
      for (const client of clients) {
        client.end();
      }
      clients.clear();
    },
  };
}
