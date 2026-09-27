import { defineComponent, type HTMLAttributes } from 'vue';
import { useTailwind } from '../element';
import { h } from '../utils/h';
import { styleToString } from '../utils/style';

export type HrProps = HTMLAttributes;

export const Hr = defineComponent(
  (_props: HrProps, { attrs }) => {
    const resolveTailwind = useTailwind();

    return () => {
      const { class: _class, style: _style, ...rest } = attrs;
      const { style, class: className } = resolveTailwind(
        attrs.class,
        attrs.style,
      );

      return h('hr', {
        ...rest,
        class: className,
        style: styleToString({
          width: '100%',
          border: 'none',
          borderColor: 'transparent',
          borderTop: '1px solid #eaeaea',
          ...style,
        }),
      });
    };
  },
  { name: 'Hr', inheritAttrs: false },
);
