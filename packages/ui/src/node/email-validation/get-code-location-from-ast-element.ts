import type { ITag } from 'html5parser';
import type { CodeLocation } from '../../shared/types';
import { getLineAndColumnFromOffset } from './get-line-and-column-from-offset';

export type { CodeLocation } from '../../shared/types';

export const getCodeLocationFromAstElement = (
  element: ITag,
  html: string,
): CodeLocation => {
  const [line, column] = getLineAndColumnFromOffset(element.start, html);
  return {
    line,
    column,
  };
};
