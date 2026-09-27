import type http from 'node:http';
import type { EmailRenderingResult } from '../shared/types';
import { handleToolbarApiRequest } from './api-toolbar';
import type { EmailLoader } from './email-loader';
import {
  getEmailPathFromSlug,
  getEmailsDirectoryMetadata,
} from './emails-directory';
import type { HotReload } from './hot-reload';
import { readJsonBody, sendJson } from './http';
import { renderEmailByPath } from './render-email';

export interface ApiContext {
  emailsDirectory: string;
  loader: EmailLoader;
  hotReload: HotReload;
  resendApiKey?: string;
}

interface RenderRequest {
  slug?: string;
  props?: Record<string, unknown>;
}

export async function renderEmailBySlug(
  context: Pick<ApiContext, 'emailsDirectory' | 'loader'>,
  slug: string,
  props?: Record<string, unknown>,
): Promise<EmailRenderingResult | undefined> {
  const emailPath = await getEmailPathFromSlug(context.emailsDirectory, slug);
  if (!emailPath) return undefined;
  return renderEmailByPath(context.loader, emailPath, props);
}

/**
 * Handles the requests of the preview app to its server. Resolves to false
 * for requests that aren't meant for the API.
 */
export async function handleApiRequest(
  context: ApiContext,
  request: http.IncomingMessage,
  response: http.ServerResponse,
): Promise<boolean> {
  const { pathname } = new URL(request.url ?? '/', 'http://localhost');
  if (!pathname.startsWith('/api/')) return false;

  try {
    if (request.method === 'GET' && pathname === '/api/events') {
      context.hotReload.connect(request, response);
      return true;
    }

    if (request.method === 'GET' && pathname === '/api/emails') {
      const directory = await getEmailsDirectoryMetadata(
        context.emailsDirectory,
      );
      sendJson(response, 200, { directory });
      return true;
    }

    if (request.method === 'POST' && pathname === '/api/render') {
      const { slug, props } = await readJsonBody<RenderRequest>(request);
      if (typeof slug !== 'string') {
        sendJson(response, 400, { error: 'A slug is required.' });
        return true;
      }
      const result = await renderEmailBySlug(context, slug, props);
      if (!result) {
        sendJson(response, 404, { error: `No email found for ${slug}.` });
        return true;
      }
      sendJson(response, 200, result);
      return true;
    }

    if (await handleToolbarApiRequest(context, request, response)) {
      return true;
    }

    sendJson(response, 404, { error: 'Not found.' });
    return true;
  } catch (exception) {
    sendJson(response, 500, {
      error: exception instanceof Error ? exception.message : String(exception),
    });
    return true;
  }
}
