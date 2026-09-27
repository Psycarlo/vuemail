/**
 * Shared helpers for the component tests that run in a real browser (vitest
 * browser mode with Playwright), like upstream's.
 *
 * `pasteText` and `pasteHtml` simulate clipboard interactions, `typeText`
 * and `pressKey` go through the real keyboard, to the focused element.
 */
import type { Editor, FocusPosition } from '@tiptap/core';
import { userEvent } from 'vitest/browser';

/**
 * Simulates pasting plain text into an element by dispatching a ClipboardEvent
 * with the given text set as `text/plain` in the DataTransfer.
 */
export function pasteText(element: Element, text: string): void {
  const dataTransfer = new DataTransfer();
  dataTransfer.setData('text/plain', text);
  element.dispatchEvent(
    new ClipboardEvent('paste', {
      clipboardData: dataTransfer,
      bubbles: true,
      cancelable: true,
    }),
  );
}

/**
 * Simulates pasting HTML content into an element by dispatching a ClipboardEvent
 * with the given markup set as `text/html` in the DataTransfer.
 */
export function pasteHtml(element: Element, html: string): void {
  const dataTransfer = new DataTransfer();
  dataTransfer.setData('text/html', html);
  element.dispatchEvent(
    new ClipboardEvent('paste', {
      clipboardData: dataTransfer,
      bubbles: true,
      cancelable: true,
    }),
  );
}

/** Types text into the focused element, one key at a time. */
export async function typeText(text: string): Promise<void> {
  // `{` and `[` start key descriptors, doubling them types them as they are
  await userEvent.keyboard(text.replace(/[{[]/g, (char) => char + char));
}

/** The modifier of keyboard shortcuts, `Mod` in ProseMirror keymaps. */
export const mod = navigator.platform.includes('Mac') ? 'Meta' : 'Control';

/**
 * Presses a key on the focused element, holding the modifiers given
 * (`'Control'`, `'Meta'`, `'Shift'` or `'Alt'`).
 */
export async function pressKey(
  key: string,
  modifiers: string[] = [],
): Promise<void> {
  const hold = modifiers.map((modifier) => `{${modifier}>}`).join('');
  const release = [...modifiers]
    .reverse()
    .map((modifier) => `{/${modifier}}`)
    .join('');
  await userEvent.keyboard(`${hold}{${key}}${release}`);
}

/**
 * Focuses the editor, at `position` if given. TipTap moves the browser's
 * focus in the next animation frame, which keys pressed next must wait for.
 */
export async function focusEditor(
  editor: Editor,
  position?: FocusPosition,
): Promise<void> {
  editor.commands.focus(position);
  await nextFrame();
}

export function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}
