import type { LinkCheckingResult } from '../../shared/types';
import { mapConcurrently, memoizeAsync } from './concurrency';
import { getCodeLocationFromAstElement } from './get-code-location-from-ast-element';
import { getAttribute, getAttributeValue, getElements } from './html';
import { quickFetch } from './quick-fetch';

export type { LinkCheck, LinkCheckingResult } from '../../shared/types';

/** How many links are checked at once. */
const CONCURRENCY = 8;

/**
 * Checks every link of some HTML for a valid URL that uses HTTPS and can be
 * reached, in the order they appear in.
 */
export const checkLinks = async (
  code: string,
): Promise<LinkCheckingResult[]> => {
  const anchors = getElements(code).flatMap((element) => {
    if (element.name !== 'a') return [];
    const href = getAttribute(element, 'href');
    const link = href ? getAttributeValue(href) : '';
    if (!link || link.startsWith('mailto:')) return [];
    return [{ element, link }];
  });

  const fetchStatusCode = memoizeAsync(async (href) => {
    const res = await quickFetch(new URL(href));
    // Only the status matters, there's no need to download the page
    res.destroy();
    return res.statusCode;
  });

  return mapConcurrently(anchors, CONCURRENCY, async ({ element, link }) => {
    const result: LinkCheckingResult = {
      link,
      codeLocation: getCodeLocationFromAstElement(element, code),
      status: 'success',
      checks: [],
    };

    try {
      const url = new URL(link);
      result.checks.push({
        passed: true,
        type: 'syntax',
      });

      if (link.startsWith('http://')) {
        result.checks.push({
          passed: false,
          type: 'security',
        });
        result.status = 'warning';
      } else {
        result.checks.push({
          passed: true,
          type: 'security',
        });
      }

      try {
        const statusCode = await fetchStatusCode(url.href);
        const hasSucceeded = statusCode?.toString().startsWith('2') ?? false;
        result.checks.push({
          type: 'fetch_attempt',
          passed: hasSucceeded,
          metadata: {
            fetchStatusCode: statusCode,
          },
        });
        if (!hasSucceeded) {
          result.status = statusCode?.toString().startsWith('3')
            ? 'warning'
            : 'error';
        }
      } catch {
        result.checks.push({
          type: 'fetch_attempt',
          passed: false,
          metadata: {
            fetchStatusCode: undefined,
          },
        });
        result.status = 'error';
      }
    } catch {
      result.checks.push({
        passed: false,
        type: 'syntax',
      });
      result.status = 'error';
    }

    return result;
  });
};
