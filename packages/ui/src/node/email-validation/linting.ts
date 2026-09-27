import type { LintingRow } from '../../shared/types';
import { checkImages } from './check-images';
import { checkLinks } from './check-links';

const byStatus = (a: LintingRow, b: LintingRow) => {
  if (a.result.status === 'error' && b.result.status === 'warning') {
    return -1;
  }

  if (a.result.status === 'warning' && b.result.status === 'error') {
    return 1;
  }

  return 0;
};

/**
 * Lints the images and links of an email's markup, resolving with the ones
 * that have issues, errors first.
 *
 * @param urlBase What image sources starting with `/` are relative to, the
 * preview server that serves the `static` directory.
 */
export async function getLintingRows(
  markup: string,
  urlBase: string,
): Promise<LintingRow[]> {
  const [imageResults, linkResults] = await Promise.all([
    checkImages(markup, urlBase),
    checkLinks(markup),
  ]);

  const rows: LintingRow[] = [];
  for (const result of imageResults) {
    if (result.status !== 'success') rows.push({ source: 'image', result });
  }
  for (const result of linkResults) {
    if (result.status !== 'success') rows.push({ source: 'link', result });
  }

  // The sort is stable, so rows with the same status keep their order
  return rows.sort(byStatus);
}
