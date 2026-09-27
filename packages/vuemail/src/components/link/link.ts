import { type AnchorHTMLAttributes, defineComponent } from 'vue';
import { useTailwind } from '../element';
import { h } from '../utils/h';
import { styleToString } from '../utils/style';

export type LinkProps = AnchorHTMLAttributes;

export const Link = defineComponent(
  (_props: LinkProps, { attrs, slots }) => {
    const resolveTailwind = useTailwind();

    return () => {
      const { class: _class, style: _style, target, ...rest } = attrs;
      const { style, class: className } = resolveTailwind(
        attrs.class,
        attrs.style,
      );

      return h(
        'a',
        {
          ...rest,
          class: className,
          style: styleToString({
            color: '#067df7',
            textDecorationLine: 'none',
            ...style,
          }),
          target: target ?? '_blank',
        },
        slots.default?.(),
      );
    };
  },
  { name: 'Link', inheritAttrs: false },
);
