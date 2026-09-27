import type {
  CompatibilityCheckingResult,
  LintingRow,
  SpamCheckingResult,
  ToolbarData,
  UploadTemplateResult,
} from '../../../shared/types';
import { config, isStatic } from '../../config';

const fetchJson = async <Response>(
  input: string,
  init?: RequestInit,
): Promise<Response> => {
  const response = await fetch(input, init);
  if (!response.ok) {
    // Error bodies aren't always JSON, as with a built preview's 404 page
    const body = (await response.json().catch(() => undefined)) as unknown;
    throw new Error(
      typeof body === 'object' && body !== null && 'error' in body
        ? String(body.error)
        : `Request to ${input} failed with ${response.status}`,
    );
  }
  return (await response.json()) as Response;
};

const postJson = <Response>(input: string, body: unknown) =>
  fetchJson<Response>(input, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

const encodeSlug = (slug: string) =>
  slug.split('/').map(encodeURIComponent).join('/');

const toolbarData = new Map<string, Promise<ToolbarData>>();

/** The results `email build` precomputed for an email, fetched only once. */
const fetchToolbarData = (slug: string) => {
  let data = toolbarData.get(slug);
  if (!data) {
    data = fetchJson<ToolbarData>(`/data/toolbar/${encodeSlug(slug)}.json`);
    // A failed request can be retried with the reload button
    data.catch(() => toolbarData.delete(slug));
    toolbarData.set(slug, data);
  }
  return data;
};

/**
 * Lints the images and links of an email's markup. Built previews come with
 * the results of their build, for the markup of `PreviewProps`.
 */
export async function lintEmail(
  slug: string,
  markup: string,
): Promise<LintingRow[]> {
  if (isStatic) return (await fetchToolbarData(slug)).lintingRows;

  const { rows } = await postJson<{ rows: LintingRow[] }>(
    '/api/toolbar/linter',
    { markup, base: `${location.protocol}//${location.host}` },
  );
  return rows;
}

/**
 * Checks how well the configured email clients support an email's markup.
 * Built previews come with the results of their build.
 */
export async function checkEmailCompatibility(
  slug: string,
  markup: string,
): Promise<CompatibilityCheckingResult[]> {
  if (isStatic) return (await fetchToolbarData(slug)).compatibilityResults;

  const { results } = await postJson<{
    results: CompatibilityCheckingResult[];
  }>('/api/toolbar/compatibility', {
    markup,
    clients: config.compatibilityClients,
  });
  return results;
}

/**
 * Scores an email with SpamAssassin, through Vuemail's website. Built
 * previews come with the result of their build, unless it failed then.
 */
export async function checkSpam(
  slug: string,
  markup: string,
  plainText: string,
): Promise<SpamCheckingResult | { error: string } | undefined> {
  if (isStatic) return (await fetchToolbarData(slug)).spamCheckingResult;

  const response = await fetch('https://vuemail.dev/api/check-spam', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      html: markup,
      plainText,
    }),
  });
  return (await response.json()) as SpamCheckingResult | { error: string };
}

/** Uploads a template to Resend, updating the one with its name if any. */
export function uploadTemplateToResend(template: {
  name: string;
  html: string;
}): Promise<UploadTemplateResult> {
  return postJson('/api/toolbar/resend/upload', template);
}
