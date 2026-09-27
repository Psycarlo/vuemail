import Color from 'colorjs.io';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  applyColorInversion,
  invertColor,
  undoColorInversion,
} from './color-inversion';

const lightnessOf = (color: string) => new Color(color).to('lch').lch.l!;

describe('invertColor()', () => {
  it('darkens bright backgrounds, down to 12.5% lightness for white', () => {
    expect(lightnessOf(invertColor('#ffffff', 'background'))).toBeCloseTo(12.5);
    expect(
      lightnessOf(invertColor('rgb(240, 240, 240)', 'background')),
    ).toBeLessThan(50);
  });

  it('keeps the lightness of dark backgrounds', () => {
    const inverted = invertColor('#111111', 'background');

    expect(lightnessOf(inverted)).toBeCloseTo(lightnessOf('#111111'));
  });

  it('lightens dark foregrounds and keeps bright ones', () => {
    expect(lightnessOf(invertColor('#000000', 'foreground'))).toBeCloseTo(87.5);
    expect(lightnessOf(invertColor('#eeeeee', 'foreground'))).toBeCloseTo(
      lightnessOf('#eeeeee'),
    );
  });

  it('reduces the chroma by 20%', () => {
    const chroma = new Color('#ff0000').to('lch').lch.c!;
    const inverted = new Color(invertColor('#ff0000', 'foreground')).to('lch');

    expect(inverted.lch.c).toBeCloseTo(chroma * 0.8);
  });

  it('gives back colors it cannot parse', () => {
    const originalError = console.error;
    console.error = () => {};
    try {
      expect(invertColor('not-a-color', 'background')).toBe('not-a-color');
    } finally {
      console.error = originalError;
    }
  });
});

describe('applyColorInversion() and undoColorInversion()', () => {
  // The document of the page stands in for the one of the preview's iframe
  const iframe = {
    contentDocument: document,
    contentWindow: window,
  } as unknown as HTMLIFrameElement;

  // happy-dom can't parse the lch() colors inverted colors come as, which
  // browsers can, so they come as hex colors here
  const colorToString = Color.prototype.toString;
  beforeEach(() => {
    vi.spyOn(Color.prototype, 'toString').mockImplementation(function (
      this: Color,
    ) {
      return colorToString.call(this.to('srgb'), { format: 'hex' });
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    document.body.removeAttribute('data-applied-color-inversion');
    document.body.removeAttribute('style');
    // Colors as browsers serialize the inline styles of elements
    document.body.innerHTML = `
      <div id="card" style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0)">
        <a id="link" style="color: blue">Link</a>
        <p id="plain">Plain</p>
      </div>
    `;
  });

  it('inverts the colors of inline styles, and undoes it', () => {
    const card = document.getElementById('card')!;
    const link = document.getElementById('link')!;

    applyColorInversion(iframe);

    expect(document.body.hasAttribute('data-applied-color-inversion')).toBe(
      true,
    );
    expect(card.getAttribute('data-original-backgroundColor')).toBeTruthy();
    expect(lightnessOf(card.style.backgroundColor)).toBeLessThan(50);
    expect(lightnessOf(card.style.color)).toBeGreaterThan(50);
    expect(link.getAttribute('data-original-color')).toBe('blue');
    expect(link.style.color).not.toBe('blue');

    undoColorInversion(iframe);

    expect(document.body.hasAttribute('data-applied-color-inversion')).toBe(
      false,
    );
    expect(card.hasAttribute('data-original-backgroundColor')).toBe(false);
    expect(lightnessOf(card.style.backgroundColor)).toBeCloseTo(100);
    expect(link.style.color).toBe('blue');
  });

  it('inverts the default white background and black text of the body', () => {
    applyColorInversion(iframe);

    expect(document.body.getAttribute('data-original-color')).toBe(
      'rgb(0, 0, 0)',
    );
    expect(lightnessOf(document.body.style.color)).toBeGreaterThan(50);
    expect(lightnessOf(document.body.style.backgroundColor)).toBeLessThan(50);
  });

  it('applies only once', () => {
    const card = document.getElementById('card')!;

    applyColorInversion(iframe);
    const invertedOnce = card.style.backgroundColor;
    applyColorInversion(iframe);

    expect(card.style.backgroundColor).toBe(invertedOnce);
  });
});
