import { effectScope } from 'vue';
import { useDebouncedCallback } from './use-debounced-callback';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test('calls back once the calls stop coming', () => {
  const callback = vi.fn();
  const scope = effectScope();
  const debounced = scope.run(() => useDebouncedCallback(callback, 300))!;

  debounced('a');
  debounced('b');
  vi.advanceTimersByTime(299);
  expect(callback).not.toHaveBeenCalled();

  vi.advanceTimersByTime(1);
  expect(callback).toHaveBeenCalledExactlyOnceWith('b');
  scope.stop();
});

test('drops the pending call, and the ones after, once its scope is gone', () => {
  const callback = vi.fn();
  const scope = effectScope();
  const debounced = scope.run(() => useDebouncedCallback(callback, 300))!;

  debounced();
  scope.stop();
  // As children do when they go away after the component using it
  debounced();
  vi.advanceTimersByTime(1000);

  expect(callback).not.toHaveBeenCalled();
});
