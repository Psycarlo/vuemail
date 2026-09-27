import type { IncomingMessage } from 'node:http';
import type { ImageCheckingResult } from '../../shared/types';
import { mapConcurrently, memoizeAsync } from './concurrency';
import { getCodeLocationFromAstElement } from './get-code-location-from-ast-element';
import { getAttribute, getAttributeValue, getElements } from './html';
import { quickFetch } from './quick-fetch';

export type { ImageCheck, ImageCheckingResult } from '../../shared/types';

/** How many images are checked at once. */
const CONCURRENCY = 8;

const getResponseSizeInBytes = async (res: IncomingMessage) => {
  let totalBytes = 0;
  for await (const chunk of res) {
    totalBytes += (chunk as Buffer).byteLength;
  }
  return totalBytes;
};

/**
 * Checks every image of some HTML for alt text and a valid URL that uses
 * HTTPS, can be reached and serves less than 1MB, in the order they appear
 * in. Sources starting with `/` are relative to `base`.
 */
export const checkImages = async (
  code: string,
  base: string,
): Promise<ImageCheckingResult[]> => {
  const images = getElements(code).flatMap((element) => {
    if (element.name !== 'img') return [];
    const src = getAttribute(element, 'src');
    const rawSource = src ? getAttributeValue(src) : '';
    if (!rawSource) return [];
    return [{ element, rawSource }];
  });

  const fetchImage = memoizeAsync(async (href) => {
    const res = await quickFetch(new URL(href));
    return {
      statusCode: res.statusCode,
      byteCount: await getResponseSizeInBytes(res),
    };
  });

  return mapConcurrently(
    images,
    CONCURRENCY,
    async ({ element, rawSource }) => {
      const source = rawSource.startsWith('/')
        ? `${base}${rawSource}`
        : rawSource;

      const result: ImageCheckingResult = {
        source: rawSource,
        codeLocation: getCodeLocationFromAstElement(element, code),
        status: 'success',
        checks: [],
      };

      const altAttribute = getAttribute(element, 'alt');
      const alt = altAttribute ? getAttributeValue(altAttribute) : undefined;
      result.checks.push({
        passed: alt !== undefined,
        type: 'accessibility',
        metadata: {
          alt,
        },
      });
      if (alt === undefined) {
        result.status = 'warning';
      }

      try {
        const url = new URL(source);
        result.checks.push({
          passed: true,
          type: 'syntax',
        });

        if (rawSource.startsWith('http://')) {
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
          const { statusCode, byteCount } = await fetchImage(url.href);
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

          result.checks.push({
            type: 'image_size',
            passed: byteCount < 1_048_576, // 1024 x 1024 bytes
            metadata: {
              byteCount,
            },
          });
          if (byteCount > 1_048_576 && result.status !== 'error') {
            result.status = 'warning';
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
    },
  );
};
