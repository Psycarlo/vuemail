import { describe, expect, it, vi } from 'vitest';
import { effectScope, nextTick, ref } from 'vue';
import { useNumericInput } from './use-numeric-input';

function createKeyboardEvent(
  key: string,
  overrides: Partial<KeyboardEvent> = {},
) {
  return {
    key,
    preventDefault: vi.fn(),
    shiftKey: false,
    target: {
      blur: vi.fn(),
      select: vi.fn(),
    } as unknown as HTMLInputElement,
    ...overrides,
  } as unknown as KeyboardEvent;
}

function createFocusEvent() {
  return { target: { select: vi.fn() } } as unknown as FocusEvent;
}

function createInputEvent(value: string) {
  return { target: { value } } as unknown as Event;
}

function useInScope<T>(fn: () => T): T {
  return effectScope().run(fn) as T;
}

describe('useNumericInput', () => {
  it('initializes displayValue from value prop', () => {
    const result = useInScope(() =>
      useNumericInput({ value: 42, onCommit: vi.fn() }),
    );

    expect(result.displayValue.value).toBe('42');
  });

  it('arrow up increments value by 1', () => {
    const onCommit = vi.fn();
    const result = useInScope(() => useNumericInput({ value: 10, onCommit }));

    result.onKeydown(createKeyboardEvent('ArrowUp'));

    expect(onCommit).toHaveBeenCalledWith(11);
    expect(result.displayValue.value).toBe('11');
  });

  it('arrow down decrements value by 1', () => {
    const onCommit = vi.fn();
    const result = useInScope(() => useNumericInput({ value: 10, onCommit }));

    result.onKeydown(createKeyboardEvent('ArrowDown'));

    expect(onCommit).toHaveBeenCalledWith(9);
    expect(result.displayValue.value).toBe('9');
  });

  it('shift+arrow up increments by 10', () => {
    const onCommit = vi.fn();
    const result = useInScope(() => useNumericInput({ value: 10, onCommit }));

    result.onKeydown(createKeyboardEvent('ArrowUp', { shiftKey: true }));

    expect(onCommit).toHaveBeenCalledWith(20);
    expect(result.displayValue.value).toBe('20');
  });

  it('shift+arrow down decrements by 10', () => {
    const onCommit = vi.fn();
    const result = useInScope(() => useNumericInput({ value: 30, onCommit }));

    result.onKeydown(createKeyboardEvent('ArrowDown', { shiftKey: true }));

    expect(onCommit).toHaveBeenCalledWith(20);
    expect(result.displayValue.value).toBe('20');
  });

  it('clamps to min on arrow down', () => {
    const onCommit = vi.fn();
    const result = useInScope(() =>
      useNumericInput({ value: 2, onCommit, min: 0 }),
    );

    result.onKeydown(createKeyboardEvent('ArrowDown', { shiftKey: true }));

    expect(onCommit).toHaveBeenCalledWith(0);
    expect(result.displayValue.value).toBe('0');
  });

  it('clamps to min on arrow up does not go below min', () => {
    const onCommit = vi.fn();
    const result = useInScope(() =>
      useNumericInput({ value: -5, onCommit, min: 0 }),
    );

    result.onKeydown(createKeyboardEvent('ArrowUp'));

    expect(onCommit).toHaveBeenCalledWith(0);
  });

  it('commits on blur', () => {
    const onCommit = vi.fn();
    const result = useInScope(() => useNumericInput({ value: 10, onCommit }));

    result.onFocus(createFocusEvent());
    result.onInput(createInputEvent('25'));
    result.onBlur();

    expect(onCommit).toHaveBeenCalledWith(25);
  });

  it('commits empty string when allowEmpty is true and input is cleared', () => {
    const onCommit = vi.fn();
    const result = useInScope(() =>
      useNumericInput({ value: 10, onCommit, allowEmpty: true }),
    );

    result.onFocus(createFocusEvent());
    result.onInput(createInputEvent(''));
    result.onBlur();

    expect(onCommit).toHaveBeenCalledWith('');
  });

  it('commits 0 when allowEmpty is false and input is cleared', () => {
    const onCommit = vi.fn();
    const result = useInScope(() =>
      useNumericInput({ value: 10, onCommit, allowEmpty: false }),
    );

    result.onFocus(createFocusEvent());
    result.onInput(createInputEvent(''));
    result.onBlur();

    expect(onCommit).toHaveBeenCalledWith(0);
  });

  it('does not commit on blur after Escape', () => {
    const onCommit = vi.fn();
    const result = useInScope(() => useNumericInput({ value: 10, onCommit }));

    result.onFocus(createFocusEvent());
    result.onInput(createInputEvent('25'));
    result.onKeydown(createKeyboardEvent('Escape'));
    result.onBlur();

    expect(onCommit).not.toHaveBeenCalled();
    expect(result.displayValue.value).toBe('10');
  });

  it('uses fallbackValue when incrementing from empty', () => {
    const onCommit = vi.fn();
    const result = useInScope(() =>
      useNumericInput({ value: '', onCommit, fallbackValue: 16 }),
    );

    result.onKeydown(createKeyboardEvent('ArrowUp'));

    expect(onCommit).toHaveBeenCalledWith(17);
  });

  it('syncs displayValue from external value changes when not focused', async () => {
    const onCommit = vi.fn();
    const value = ref<string | number>(10);
    const result = useInScope(() => useNumericInput({ value, onCommit }));

    expect(result.displayValue.value).toBe('10');

    value.value = 20;
    await nextTick();

    expect(result.displayValue.value).toBe('20');
  });

  it('keeps the typed value while focused, even when the value changes', async () => {
    const onCommit = vi.fn();
    const value = ref<string | number>(10);
    const result = useInScope(() => useNumericInput({ value, onCommit }));

    result.onFocus(createFocusEvent());
    result.onInput(createInputEvent('15'));
    value.value = 20;
    await nextTick();

    expect(result.displayValue.value).toBe('15');
  });
});
