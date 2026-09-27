import {
  type CSSProperties,
  getCurrentScope,
  type MaybeRefOrGetter,
  onScopeDispose,
  toValue,
} from 'vue';

interface UseDragToChangeOptions {
  value: MaybeRefOrGetter<string | number | undefined | null>;
  onCommit: (value: number | '') => void;
  min?: MaybeRefOrGetter<number | undefined>;
  step?: MaybeRefOrGetter<number | undefined>;
}

function resetBodyStyles() {
  document.body.style.removeProperty('cursor');
  document.body.style.removeProperty('user-select');
}

/**
 * Pointer handlers that change a number by dragging horizontally, to bind
 * with `v-bind` on a handle like the unit next to a number input.
 */
export function useDragToChange({
  value,
  onCommit,
  min,
  step = 1,
}: UseDragToChangeOptions) {
  let startX = 0;
  let startValue = 0;
  let isDragging = false;

  if (getCurrentScope()) {
    onScopeDispose(() => {
      if (typeof document !== 'undefined') {
        resetBodyStyles();
      }
    });
  }

  const onPointerdown = (e: PointerEvent) => {
    e.preventDefault();
    isDragging = true;
    startX = e.clientX;
    startValue = Number(toValue(value)) || 0;

    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';

    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
  };

  const onPointermove = (e: PointerEvent) => {
    if (!isDragging) {
      return;
    }

    const baseStep = toValue(step) ?? 1;
    const dx = e.clientX - startX;
    const effectiveStep = e.shiftKey ? baseStep * 10 : baseStep;
    const delta = Math.round(dx / 2) * effectiveStep;
    const next = Math.max(
      toValue(min) ?? Number.NEGATIVE_INFINITY,
      startValue + delta,
    );
    onCommit(next);
  };

  const onPointerup = () => {
    isDragging = false;
    resetBodyStyles();
  };

  return {
    dragProps: {
      onPointerdown,
      onPointermove,
      onPointerup,
      onPointercancel: onPointerup,
      style: { cursor: 'ew-resize' } as CSSProperties,
    },
  };
}
