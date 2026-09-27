import type http from 'node:http';
import type { ApiContext } from './api';
import { checkCompatibility } from './email-validation/check-compatibility';
import { getRelevantEmailClients } from './email-validation/email-clients';
import { getLintingRows } from './email-validation/linting';
import { readJsonBody, sendJson } from './http';
import { createResendTemplates, uploadTemplateToResend } from './resend';

interface LinterRequest {
  markup?: unknown;
  /** What image sources starting with `/` are relative to. */
  base?: unknown;
}

interface CompatibilityRequest {
  markup?: unknown;
  /** The email clients to check against, the most used ones by default. */
  clients?: unknown;
}

interface ResendUploadRequest {
  name?: unknown;
  html?: unknown;
}

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

/**
 * Handles the requests of the toolbar (linting, compatibility checks and
 * the Resend integration). Resolves to false for requests it doesn't handle.
 *
 * - `POST /api/toolbar/linter` with `{ markup, base? }` responds with
 *   `{ rows: LintingRow[] }`, the images and links with issues.
 * - `POST /api/toolbar/compatibility` with `{ markup, clients? }` responds
 *   with `{ results: CompatibilityCheckingResult[] }`.
 * - `POST /api/toolbar/resend/upload` with `{ name, html }` responds with an
 *   `UploadTemplateResult`.
 */
export async function handleToolbarApiRequest(
  context: ApiContext,
  request: http.IncomingMessage,
  response: http.ServerResponse,
): Promise<boolean> {
  if (request.method !== 'POST') return false;
  const { pathname } = new URL(request.url ?? '/', 'http://localhost');

  if (pathname === '/api/toolbar/linter') {
    const { markup, base } = await readJsonBody<LinterRequest>(request);
    if (typeof markup !== 'string') {
      sendJson(response, 400, { error: 'The markup to lint is required.' });
      return true;
    }
    const rows = await getLintingRows(
      markup,
      typeof base === 'string' ? base : `http://${request.headers.host}`,
    );
    sendJson(response, 200, { rows });
    return true;
  }

  if (pathname === '/api/toolbar/compatibility') {
    const { markup, clients } =
      await readJsonBody<CompatibilityRequest>(request);
    if (typeof markup !== 'string') {
      sendJson(response, 400, { error: 'The markup to check is required.' });
      return true;
    }
    const results = checkCompatibility(
      markup,
      getRelevantEmailClients(isStringArray(clients) ? clients : []),
    );
    sendJson(response, 200, { results });
    return true;
  }

  if (pathname === '/api/toolbar/resend/upload') {
    const apiKey = context.resendApiKey?.trim();
    if (!apiKey) {
      sendJson(response, 400, {
        error:
          'There is no Resend API key, run `npx vuemail resend setup` to set it up.',
      });
      return true;
    }
    const { name, html } = await readJsonBody<ResendUploadRequest>(request);
    if (typeof name !== 'string' || typeof html !== 'string') {
      sendJson(response, 400, {
        error: 'The name and the HTML of the template are required.',
      });
      return true;
    }
    const result = await uploadTemplateToResend(createResendTemplates(apiKey), {
      name,
      html,
    });
    sendJson(response, 200, result);
    return true;
  }

  return false;
}
