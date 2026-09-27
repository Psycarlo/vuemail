import { defineComponent, type ImgHTMLAttributes } from 'vue';
import { useTailwind } from '../element';
import { h } from '../utils/h';
import { styleToString } from '../utils/style';

export type ImgProps = ImgHTMLAttributes;

export const Img = defineComponent(
  (_props: ImgProps, { attrs }) => {
    const resolveTailwind = useTailwind();

    return () => {
      const { class: _class, style: _style, alt, ...rest } = attrs;
      const { style, class: className } = resolveTailwind(
        attrs.class,
        attrs.style,
      );

      return h('img', {
        ...rest,
        alt: alt ?? '',
        class: className,
        style: styleToString({
          display: 'block',
          outline: 'none',
          border: 'none',
          textDecoration: 'none',
          ...style,
        }),
      });
    };
  },
  { name: 'Img', inheritAttrs: false },
);
