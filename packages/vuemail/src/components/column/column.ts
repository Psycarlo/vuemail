import { defineComponent, type TdHTMLAttributes } from 'vue';
import { useTailwind } from '../element';
import { h } from '../utils/h';
import { styleToString } from '../utils/style';

export type ColumnProps = TdHTMLAttributes;

export const Column = defineComponent(
  (_props: ColumnProps, { attrs, slots }) => {
    const resolveTailwind = useTailwind();

    return () => {
      const { class: _class, style: _style, ...rest } = attrs;
      const { style, class: className } = resolveTailwind(
        attrs.class,
        attrs.style,
      );

      return h(
        'td',
        {
          ...rest,
          class: className,
          'data-id': '__vuemail-column',
          style: styleToString(style),
        },
        slots.default?.(),
      );
    };
  },
  { name: 'Column', inheritAttrs: false },
);
