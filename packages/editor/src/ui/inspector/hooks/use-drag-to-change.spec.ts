import { describe, expect, it, vi } from 'vitest';
import { effectScope } from 'vue';
import { useDragToChange } from './use-drag-to-change';

function createPointerEvent(overrides: Partial<PointerEvent> = {}) {
  return {
    preventDefault: vi.fn(),
    clientX: 0,
    pointerId: 1,
    shiftKey: false,
    currentTarget: {
      setPointerCapture: vi.fn(),
    } as unknown as HTMLElement,
    ...overrides,
  } as unknown as PointerEvent;
}

function useInScope<T>(fn: () => T) {
  const scope = effectScope();
  const result = scope.run(fn) as T;
  return { result, scope };
}

describe('useDragToChange', () => {
  it('calls onCommit with delta value on pointer move after pointer down', () => {
    const onCommit = vi.fn();
    const { result } = useInScope(() =>
      useDragToChange({ value: 10, onCommit }),
    );

    result.dragProps.onPointerdown(createPointerEvent({ clientX: 100 }));
    result.dragProps.onPointermove(createPointerEvent({ clientX: 110 }));

    expect(onCommit).toHaveBeenCalledWith(15);
  });

  it('does not call onCommit on pointer move without pointer down', () => {
    const onCommit = vi.fn();
    const { result } = useInScope(() =>
      useDragToChange({ value: 10, onCommit }),
    );

    result.dragProps.onPointermove(createPointerEvent({ clientX: 110 }));

    expect(onCommit).not.toHaveBeenCalled();
  });

  it('stops tracking after pointer up', () => {
    const onCommit = vi.fn();
    const { result } = useInScope(() =>
      useDragToChange({ value: 10, onCommit }),
    );

    result.dragProps.onPointerdown(createPointerEvent({ clientX: 100 }));
    result.dragProps.onPointerup();
    result.dragProps.onPointermove(createPointerEvent({ clientX: 120 }));

    expect(onCommit).not.toHaveBeenCalled();
  });

  it('respects step parameter', () => {
    const onCommit = vi.fn();
    const { result } = useInScope(() =>
      useDragToChange({ value: 0, onCommit, step: 5 }),
    );

    result.dragProps.onPointerdown(createPointerEvent({ clientX: 0 }));
    result.dragProps.onPointermove(createPointerEvent({ clientX: 4 }));

    expect(onCommit).toHaveBeenCalledWith(10);
  });

  it('sets cursor to ew-resize during drag', () => {
    const onCommit = vi.fn();
    const { result } = useInScope(() =>
      useDragToChange({ value: 0, onCommit }),
    );

    result.dragProps.onPointerdown(createPointerEvent({ clientX: 0 }));

    expect(document.body.style.cursor).toBe('ew-resize');

    result.dragProps.onPointerup();

    expect(document.body.style.cursor).toBe('');
  });

  it('resets the body cursor when disposed mid-drag', () => {
    const onCommit = vi.fn();
    const { result, scope } = useInScope(() =>
      useDragToChange({ value: 0, onCommit }),
    );

    result.dragProps.onPointerdown(createPointerEvent({ clientX: 0 }));
    expect(document.body.style.cursor).toBe('ew-resize');

    scope.stop();

    expect(document.body.style.cursor).toBe('');
  });

  it('clamps to min value', () => {
    const onCommit = vi.fn();
    const { result } = useInScope(() =>
      useDragToChange({ value: 5, onCommit, min: 0 }),
    );

    result.dragProps.onPointerdown(createPointerEvent({ clientX: 100 }));
    result.dragProps.onPointermove(createPointerEvent({ clientX: 80 }));

    expect(onCommit).toHaveBeenCalledWith(0);
  });

  it('returns ew-resize cursor style in dragProps', () => {
    const onCommit = vi.fn();
    const { result } = useInScope(() =>
      useDragToChange({ value: 0, onCommit }),
    );

    expect(result.dragProps.style.cursor).toBe('ew-resize');
  });
});
