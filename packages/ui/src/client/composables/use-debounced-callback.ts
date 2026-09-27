import { getCurrentScope, onScopeDispose } from 'vue';
import { debounce } from '../utils/debounce';

/**
 * Debounces a callback, dropping the pending call when the component using
 * it goes away.
 */
export const useDebouncedCallback = <Args extends unknown[]>(
  callback: (...args: Args) => void,
  wait: number,
) => {
  const debounced = debounce(callback, wait);
  if (getCurrentScope()) {
    onScopeDispose(() => debounced.cancel());
  }
  return debounced;
};
