import { getCurrentScope, onScopeDispose } from 'vue';
import { type DebouncedFunction, debounce } from '../utils/debounce';

/**
 * Debounces a callback, dropping the pending call when the component using
 * it goes away, and the calls that come after, like the ones of its
 * children as they go away too.
 */
export const useDebouncedCallback = <Args extends unknown[]>(
  callback: (...args: Args) => void,
  wait: number,
): DebouncedFunction<Args> => {
  const debounced = debounce(callback, wait);
  if (!getCurrentScope()) return debounced;

  let disposed = false;
  onScopeDispose(() => {
    disposed = true;
    debounced.cancel();
  });
  return Object.assign(
    (...args: Args) => {
      if (!disposed) debounced(...args);
    },
    {
      cancel: debounced.cancel,
      flush: debounced.flush,
      isPending: debounced.isPending,
    },
  );
};
