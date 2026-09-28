/**
 * The variants of a component of the gallery, in the order React Email's
 * website reads them from its folder (alphabetical): the first one is the one
 * the preview shows, `inline-styles` rather than `tailwind`.
 */
export const sortVariants = (names: readonly string[]): string[] =>
  [...names].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
