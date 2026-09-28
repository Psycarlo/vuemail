import { describe, expect, it } from 'vitest';
import type { DirectiveBinding } from 'vue';
import { vSrcdoc } from './srcdoc';

/** An iframe that counts how many times its document gets set */
const iframeWith = (attribute: string | null) => {
  const iframe = {
    sets: 0,
    getAttribute: () => attribute,
    set srcdoc(_value: string) {
      iframe.sets++;
    },
  };
  return iframe;
};

const binding = (value: string, oldValue: string | null = null) =>
  ({ value, oldValue }) as DirectiveBinding<string>;

describe('v-srcdoc', () => {
  it('renders the document as the srcdoc attribute on the server', () => {
    expect(vSrcdoc.getSSRProps?.(binding('<p>Hi</p>'), null as never)).toEqual({
      srcdoc: '<p>Hi</p>',
    });
  });

  it("doesn't reload an iframe hydrated with the same document", () => {
    const iframe = iframeWith('<p>Hi</p>');

    vSrcdoc.mounted?.(
      iframe as never,
      binding('<p>Hi</p>'),
      null as never,
      null,
    );

    expect(iframe.sets).toBe(0);
  });

  it('sets the document of an iframe rendered in the browser', () => {
    const iframe = iframeWith(null);

    vSrcdoc.mounted?.(
      iframe as never,
      binding('<p>Hi</p>'),
      null as never,
      null,
    );

    expect(iframe.sets).toBe(1);
  });

  it('sets the document again when it changes', () => {
    const iframe = iframeWith('<p>Hi</p>');

    vSrcdoc.updated?.(
      iframe as never,
      binding('<p>Bye</p>', '<p>Hi</p>'),
      null as never,
      null as never,
    );
    vSrcdoc.updated?.(
      iframe as never,
      binding('<p>Bye</p>', '<p>Bye</p>'),
      null as never,
      null as never,
    );

    expect(iframe.sets).toBe(1);
  });
});
