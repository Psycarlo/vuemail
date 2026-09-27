import { twMerge } from 'tailwind-merge';
import { normalizeClass } from 'vue';

export type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, unknown>
  | ClassValue[];

/**
 * Joins classes like Vue's `class` bindings do, letting the last of
 * conflicting Tailwind classes win, as in `cn('mt-2', 'm-0')` giving `m-0`.
 */
export const cn = (...inputs: ClassValue[]) => twMerge(normalizeClass(inputs));
