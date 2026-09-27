import { defineComponent, type HTMLAttributes } from 'vue';
import { h } from '../utils/h';

export type HeadProps = HTMLAttributes;

export const Head = defineComponent(
  (_props: HeadProps, { attrs, slots }) => {
    return () =>
      h('head', { ...attrs }, [
        h('meta', {
          content: 'text/html; charset=UTF-8',
          'http-equiv': 'Content-Type',
        }),
        h('meta', { name: 'x-apple-disable-message-reformatting' }),
        ...(slots.default?.() ?? []),
      ]);
  },
  { name: 'Head', inheritAttrs: false },
);
