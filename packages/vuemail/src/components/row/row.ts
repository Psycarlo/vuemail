import { defineComponent, type TableHTMLAttributes } from 'vue';
import { useTailwind } from '../element';
import { h } from '../utils/h';
import { styleToString } from '../utils/style';

export type RowProps = TableHTMLAttributes & {
  align?: 'left' | 'center' | 'right';
};

export const Row = defineComponent(
  (_props: RowProps, { attrs, slots }) => {
    const resolveTailwind = useTailwind();

    return () => {
      const { class: _class, style: _style, ...rest } = attrs;
      const { style, class: className } = resolveTailwind(
        attrs.class,
        attrs.style,
      );

      return h(
        'table',
        {
          align: 'center',
          width: '100%',
          border: 0,
          cellpadding: '0',
          cellspacing: '0',
          role: 'presentation',
          ...rest,
          class: className,
          style: styleToString(style),
        },
        h(
          'tbody',
          { style: 'width:100%' },
          h('tr', { style: 'width:100%' }, slots.default?.()),
        ),
      );
    };
  },
  { name: 'Row', inheritAttrs: false },
);
