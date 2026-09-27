import { defineComponent, type HTMLAttributes } from 'vue';
import { useTailwind } from '../element';
import { h } from '../utils/h';
import { styleToString } from '../utils/style';
import { type Margin, withMargin } from './utils/spaces';

export type HeadingAs = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HeadingProps = HTMLAttributes &
  Margin & {
    /** The heading level to render. Default: 'h1' */
    as?: HeadingAs;
  };

export const Heading = defineComponent(
  (props: HeadingProps, { attrs, slots }) => {
    const resolveTailwind = useTailwind();

    return () => {
      const { class: _class, style: _style, ...rest } = attrs;
      const { style, class: className } = resolveTailwind(
        attrs.class,
        attrs.style,
      );
      const { as = 'h1', m, mx, my, mt, mr, mb, ml } = props;

      return h(
        as,
        {
          ...rest,
          class: className,
          style: styleToString({
            ...withMargin({ m, mx, my, mt, mr, mb, ml }),
            ...style,
          }),
        },
        slots.default?.(),
      );
    };
  },
  {
    name: 'Heading',
    inheritAttrs: false,
    props: ['as', 'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml'],
  },
);
