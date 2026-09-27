import { defineComponent, type HtmlHTMLAttributes } from 'vue';
import { h } from '../utils/h';

export type HtmlProps = HtmlHTMLAttributes & {
  lang?: string;
  dir?: string;
};

export const Html = defineComponent(
  (_props: HtmlProps, { attrs, slots }) => {
    return () => {
      const { lang, dir, ...rest } = attrs;

      return h(
        'html',
        { ...rest, dir: dir ?? 'ltr', lang: lang ?? 'en' },
        slots.default?.(),
      );
    };
  },
  { name: 'Html', inheritAttrs: false },
);
