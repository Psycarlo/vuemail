/**
 * The path of the preview of an email. Characters with a meaning in URLs
 * are escaped, so that `promo#1` isn't taken for a hash.
 */
export const getPreviewPath = (emailSlug: string) =>
  `/preview/${emailSlug
    .split('/')
    .map((segment) => segment.replace(/[%?#]/g, encodeURIComponent))
    .join('/')}`;
