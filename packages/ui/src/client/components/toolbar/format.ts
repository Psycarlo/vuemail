/**
 * Sanitizes text by replacing underscores and hyphens with spaces
 */
export const sanitize = (text: string): string => {
  return text.replace(/[_-]/g, ' ');
};

const BYTE_UNITS = ['B', 'kB', 'MB', 'GB', 'TB'];

/** Formats a number of bytes like `pretty-bytes`, as in `24.5 kB`. */
export const prettyBytes = (byteCount: number): string => {
  if (byteCount < 1) return `${byteCount} B`;
  const exponent = Math.min(
    Math.floor(Math.log10(byteCount) / 3),
    BYTE_UNITS.length - 1,
  );
  const value = Number((byteCount / 1000 ** exponent).toPrecision(3));
  return `${value} ${BYTE_UNITS[exponent]}`;
};
