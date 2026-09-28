import type { SourceLocation, SourcePosition } from '../../shared/types';

export type PositionResolver = (index: number) => SourcePosition;

/** Maps the offsets of a text to their positions in it. */
export const createPositionResolver = (text: string): PositionResolver => {
  const lineStarts = [0];
  for (const lineBreak of text.matchAll(/\r\n|\n|\r/g)) {
    lineStarts.push(lineBreak.index + lineBreak[0].length);
  }

  return (index) => {
    let low = 0;
    let high = lineStarts.length - 1;
    while (low < high) {
      const middle = (low + high + 1) >> 1;
      if (lineStarts[middle]! <= index) low = middle;
      else high = middle - 1;
    }
    return { line: low + 1, column: index - lineStarts[low]!, index };
  };
};

export const toLocation = (
  resolve: PositionResolver,
  start: number,
  end: number,
): SourceLocation => ({ start: resolve(start), end: resolve(end) });
