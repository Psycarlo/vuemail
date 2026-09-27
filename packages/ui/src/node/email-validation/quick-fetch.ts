import type { IncomingMessage } from 'node:http';
import http from 'node:http';
import https from 'node:https';

/** How long a request, body included, can take before it's given up on. */
export const QUICK_FETCH_TIMEOUT = 10_000;

/**
 * Requests a URL without following redirects, resolving with the response
 * as soon as its headers arrive.
 */
export const quickFetch = (url: URL, timeout = QUICK_FETCH_TIMEOUT) => {
  return new Promise<IncomingMessage>((resolve, reject) => {
    const caller = url.protocol === 'https:' ? https : http;
    caller
      .get(url, { signal: AbortSignal.timeout(timeout) }, (res) => {
        resolve(res);
      })
      .on('error', (error) => reject(error));
  });
};
