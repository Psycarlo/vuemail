/** The slug of the email these benchmarks render, from `apps/demo/emails`. */
export const EMAIL_SLUG = 'Community/magic-links/notion-magic-link';

/**
 * Fetches the rendered preview of `EMAIL_SLUG` from a running `vuemail dev`
 * server. Vuemail's preview server is a Vite-based SPA: the page HTML itself
 * is static, so the real work happens behind `POST /api/render`.
 */
export async function fetchPreviewPage(serverUrl: string) {
  const response = await fetch(`${serverUrl}/api/render`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug: EMAIL_SLUG }),
  });
  if (!response.ok) {
    throw new Error(
      `Failed to render ${EMAIL_SLUG}: ${response.status} ${response.statusText}`,
    );
  }
  return response.json();
}
