import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { useClampedState } from './use-clamped-state';

describe('useClampedState()', () => {
  it('keeps the initial value when it is within bounds', () => {
    const [value] = useClampedState(500, 220, 1000);

    expect(value.value).toBe(500);
  });

  it('clamps the initial value', () => {
    expect(useClampedState(100, 220, 1000)[0].value).toBe(220);
    expect(useClampedState(2000, 220, 1000)[0].value).toBe(1000);
  });

  it('clamps the values it is set to', () => {
    const [value, setValue] = useClampedState(500, 220, 1000);

    setValue(10);
    expect(value.value).toBe(220);

    setValue(5000);
    expect(value.value).toBe(1000);

    setValue(640);
    expect(value.value).toBe(640);
  });

  it('gives updater functions the clamped current value', () => {
    const [value, setValue] = useClampedState(2000, 220, 1000);

    let received: number | undefined;
    setValue((current) => {
      received = current;
      return current - 100;
    });

    expect(received).toBe(1000);
    expect(value.value).toBe(900);
  });

  it('follows bounds that change, like the size of the preview', () => {
    const maxWidth = ref(Number.POSITIVE_INFINITY);
    const [width, setWidth] = useClampedState(1024, 220, maxWidth);

    expect(width.value).toBe(1024);

    maxWidth.value = 800;
    expect(width.value).toBe(800);

    maxWidth.value = 1200;
    expect(width.value).toBe(1024);

    setWidth(1500);
    expect(width.value).toBe(1200);
  });
});
