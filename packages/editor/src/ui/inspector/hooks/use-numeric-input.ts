import { type MaybeRefOrGetter, type Ref, ref, toValue, watch } from 'vue';

interface UseNumericInputOptions {
  value: MaybeRefOrGetter<string | number | undefined | null>;
  onCommit: (value: number | '') => void;
  allowEmpty?: MaybeRefOrGetter<boolean | undefined>;
  min?: MaybeRefOrGetter<number | undefined>;
  fallbackValue?: MaybeRefOrGetter<number | undefined>;
}

interface UseNumericInputReturn {
  displayValue: Ref<string>;
  onInput: (e: Event) => void;
  onBlur: () => void;
  onFocus: (e: FocusEvent) => void;
  onKeydown: (e: KeyboardEvent) => void;
}

function toDisplayString(v: string | number | undefined | null): string {
  if (v === '' || v === undefined || v === null || Number.isNaN(v)) {
    return '';
  }
  return String(v);
}

/**
 * State and event handlers of a text input editing a number, committing it
 * on blur, Enter and arrow keys. Bind the handlers to the input with
 * `v-bind`/`v-on`, and `displayValue` as its value.
 */
export function useNumericInput({
  value,
  onCommit,
  allowEmpty = true,
  min,
  fallbackValue,
}: UseNumericInputOptions): UseNumericInputReturn {
  const displayValue = ref(toDisplayString(toValue(value)));
  let isFocused = false;
  let cancelled = false;

  watch(
    () => toValue(value),
    (currentValue) => {
      if (!isFocused) {
        displayValue.value = toDisplayString(currentValue);
      }
    },
  );

  const getMin = () => toValue(min) ?? Number.NEGATIVE_INFINITY;

  const commit = (raw: string) => {
    const trimmed = raw.trim();

    if (trimmed === '') {
      if (toValue(allowEmpty) ?? true) {
        onCommit('');
      } else {
        displayValue.value = '0';
        onCommit(0);
      }
      return;
    }

    const num = Number(trimmed);

    if (Number.isNaN(num)) {
      displayValue.value = toDisplayString(toValue(value));
      return;
    }

    const clamped = Math.max(num, getMin());
    displayValue.value = String(clamped);
    onCommit(clamped);
  };

  const onInput = (e: Event) => {
    displayValue.value = (e.target as HTMLInputElement).value;
  };

  const onBlur = () => {
    isFocused = false;
    if (cancelled) {
      cancelled = false;
      return;
    }
    commit(displayValue.value);
  };

  const onFocus = (e: FocusEvent) => {
    isFocused = true;
    (e.target as HTMLInputElement).select();
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      commit(displayValue.value);
      (e.target as HTMLInputElement).blur();
    }

    if (e.key === 'Escape') {
      cancelled = true;
      displayValue.value = toDisplayString(toValue(value));
      (e.target as HTMLInputElement).blur();
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      const trimmed = displayValue.value.trim();
      const parsed = Number(trimmed);
      const current =
        trimmed === '' || Number.isNaN(parsed)
          ? (toValue(fallbackValue) ?? 0)
          : parsed;
      const next = Math.max(
        getMin(),
        e.key === 'ArrowUp' ? current + step : current - step,
      );
      displayValue.value = String(next);
      onCommit(next);
    }
  };

  return { displayValue, onInput, onBlur, onFocus, onKeydown };
}
