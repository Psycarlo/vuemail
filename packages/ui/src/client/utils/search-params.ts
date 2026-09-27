import type { LocationQuery } from 'vue-router';

/**
 * The value of a query parameter like `URLSearchParams.get()` gives it: its
 * first value, `''` for a parameter without one and `null` when missing.
 */
export const getSearchParam = (
  query: LocationQuery,
  name: string,
): string | null => {
  const value = query[name];
  if (value === undefined) return null;
  const first = Array.isArray(value) ? value[0] : value;
  return first ?? '';
};
