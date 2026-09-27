import { computed, type MaybeRefOrGetter, ref, toValue } from 'vue';

const clamp = (v: number, min: number, max: number) => {
  return Math.min(Math.max(v, min), max);
};

/** A number that always stays within `min` and `max`, even as they change. */
export const useClampedState = (
  initial: number,
  min: MaybeRefOrGetter<number>,
  max: MaybeRefOrGetter<number>,
) => {
  const v = ref(initial);

  return [
    computed(() => clamp(v.value, toValue(min), toValue(max))),
    (valueOrFunction: number | ((v: number) => number)) => {
      const minValue = toValue(min);
      const maxValue = toValue(max);
      if (typeof valueOrFunction === 'function') {
        const currentValue = clamp(v.value, minValue, maxValue);
        v.value = clamp(valueOrFunction(currentValue), minValue, maxValue);
      } else {
        v.value = clamp(valueOrFunction, minValue, maxValue);
      }
    },
  ] as const;
};
