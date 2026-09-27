import { version } from '../../package.json';
import type { UploadTemplateResult } from '../shared/types';

export type { UploadTemplateResult } from '../shared/types';

export interface ResendError {
  name: string;
  message: string;
  statusCode: number | null;
}

/** What Resend's SDK resolves with: the data, or what went wrong. */
export type ResendResponse<Data> =
  | { data: Data; error: null }
  | { data: null; error: ResendError };

export interface ResendTemplate {
  id: string;
  name: string;
}

/** The part of Resend's Templates API the preview uses. */
export interface ResendTemplates {
  /** Every template of the account, from all of the pages. */
  list(): Promise<ResendResponse<ResendTemplate[]>>;
  create(template: {
    name: string;
    html: string;
  }): Promise<ResendResponse<{ id: string }>>;
  update(
    id: string,
    template: { html: string },
  ): Promise<ResendResponse<{ id: string }>>;
}

const RESEND_API_URL = 'https://api.resend.com';

/** Resend's REST API allows at most 100 items per page. */
const PAGE_SIZE = 100;

const REQUEST_TIMEOUT = 30_000;

/** Resend's Templates API, called through its REST API. */
export function createResendTemplates(
  apiKey: string,
  fetchImplementation: typeof fetch = fetch,
): ResendTemplates {
  const request = async <Data>(
    method: 'GET' | 'POST' | 'PATCH',
    path: string,
    body?: unknown,
  ): Promise<ResendResponse<Data>> => {
    try {
      const response = await fetchImplementation(`${RESEND_API_URL}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': `vuemail:${version}`,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      const text = await response.text();
      const responseBody = (text ? JSON.parse(text) : null) as
        | (Data & Partial<ResendError>)
        | null;
      if (!response.ok) {
        return {
          data: null,
          error: {
            name: responseBody?.name ?? 'application_error',
            message: responseBody?.message ?? response.statusText,
            statusCode: response.status,
          },
        };
      }
      return { data: responseBody as Data, error: null };
    } catch (exception) {
      return {
        data: null,
        error: {
          name: 'application_error',
          message:
            exception instanceof Error ? exception.message : String(exception),
          statusCode: null,
        },
      };
    }
  };

  return {
    async list() {
      const templates: ResendTemplate[] = [];
      let after: string | undefined;
      while (true) {
        const query = new URLSearchParams({ limit: String(PAGE_SIZE) });
        if (after) query.set('after', after);
        const page = await request<{
          data: ResendTemplate[];
          has_more: boolean;
        }>('GET', `/templates?${query.toString()}`);
        if (page.error) return page;

        templates.push(...page.data.data);
        const last = page.data.data[page.data.data.length - 1];
        if (!page.data.has_more || !last) {
          return { data: templates, error: null };
        }
        after = last.id;
      }
    },
    create(template) {
      return request('POST', '/templates', template);
    },
    update(id, template) {
      return request('PATCH', `/templates/${encodeURIComponent(id)}`, template);
    },
  };
}

/**
 * Uploads a single email template to Resend.
 *
 * Looks the template up by name first so that re-uploading the same template
 * updates it in place instead of creating a duplicate (`welcome`, `welcome (1)`,
 * `welcome (2)`, ...). Resend template names are not unique, so the update only
 * happens when exactly one template matches the name. On zero or several matches
 * it falls back to creating a new template.
 */
export const uploadTemplateToResend = async (
  templates: ResendTemplates,
  template: { name: string; html: string },
): Promise<UploadTemplateResult> => {
  const existing = await templates.list();
  if (existing.error) {
    console.error('Error listing templates', existing.error);
    return { name: template.name, status: 'failed' };
  }

  const matches = existing.data.filter((item) => item.name === template.name);
  const match = matches.length === 1 ? matches[0] : undefined;

  if (match) {
    const updated = await templates.update(match.id, {
      html: template.html,
    });
    if (updated.error) {
      console.error('Error updating single template', updated.error);
      return { name: template.name, status: 'failed' };
    }
    return { name: template.name, status: 'succeeded', id: updated.data.id };
  }

  const created = await templates.create({
    name: template.name,
    html: template.html,
  });
  if (created.error) {
    console.error('Error creating single template', created.error);
    return { name: template.name, status: 'failed' };
  }
  return { name: template.name, status: 'succeeded', id: created.data.id };
};
