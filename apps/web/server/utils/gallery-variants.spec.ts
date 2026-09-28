import { describe, expect, it } from 'vitest';
import { sortVariants } from './gallery-variants';

describe('sortVariants()', () => {
  it('puts the inline styles variant first, which the preview renders', () => {
    expect(sortVariants(['tailwind', 'inline-styles'])).toEqual([
      'inline-styles',
      'tailwind',
    ]);
  });

  it('keeps a single variant', () => {
    expect(sortVariants(['index'])).toEqual(['index']);
  });
});
