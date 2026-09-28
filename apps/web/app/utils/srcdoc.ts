import type { ObjectDirective } from 'vue';

/**
 * `v-srcdoc`: the document of an iframe. Unlike a `:srcdoc` binding, which Vue
 * sets again when it hydrates the page (it hydrates the dynamic props of
 * elements), it doesn't reload an iframe with the document it already has.
 */
export const vSrcdoc: ObjectDirective<HTMLIFrameElement, string> = {
  getSSRProps: ({ value }) => ({ srcdoc: value }),
  mounted(el, { value }) {
    if (el.getAttribute('srcdoc') !== value) el.srcdoc = value;
  },
  updated(el, { value, oldValue }) {
    if (value !== oldValue) el.srcdoc = value;
  },
};
