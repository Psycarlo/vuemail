export interface DebouncedFunction<Args extends unknown[]> {
  (...args: Args): void;
  /** Drops the pending call, if any. */
  cancel(): void;
  /** Makes the pending call right away, if any. */
  flush(): void;
  isPending(): boolean;
}

/** Calls back once calls stop coming for `wait` milliseconds. */
export function debounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  wait: number,
): DebouncedFunction<Args> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let pendingArgs: Args | undefined;

  const invoke = () => {
    const args = pendingArgs as Args;
    timeout = undefined;
    pendingArgs = undefined;
    callback(...args);
  };

  const debounced = (...args: Args) => {
    pendingArgs = args;
    clearTimeout(timeout);
    timeout = setTimeout(invoke, wait);
  };
  debounced.cancel = () => {
    clearTimeout(timeout);
    timeout = undefined;
    pendingArgs = undefined;
  };
  debounced.flush = () => {
    if (timeout === undefined) return;
    clearTimeout(timeout);
    invoke();
  };
  debounced.isPending = () => timeout !== undefined;

  return debounced;
}
