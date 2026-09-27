import { defineComponent, type TableHTMLAttributes } from 'vue';
import { useTailwind } from '../element';
import { h } from '../utils/h';
import {
  splitPaddingClasses,
  splitPaddingStyles,
} from '../utils/split-padding';
import { styleToString } from '../utils/style';

export type ContainerProps = TableHTMLAttributes & {
  align?: 'left' | 'center' | 'right';
  /** Classes for the inner cell, where padding is applied. */
  tdClass?: string;
};

export const Container = defineComponent(
  (props: ContainerProps, { attrs, slots }) => {
    const resolveTailwind = useTailwind();

    return () => {
      const { class: _class, style: _style, ...rest } = attrs;
      const {
        style,
        class: className,
        classProperties,
      } = resolveTailwind(attrs.class, attrs.style);
      const { tableClass, tdClass } = splitPaddingClasses(
        className,
        classProperties,
        props.tdClass,
      );
      const { tdStyle, tableStyle } = splitPaddingStyles(style);

      return h(
        'table',
        {
          align: 'center',
          width: '100%',
          ...rest,
          class: tableClass,
          border: 0,
          cellpadding: '0',
          cellspacing: '0',
          role: 'presentation',
          style: styleToString({ maxWidth: '37.5em', ...tableStyle }),
        },
        h(
          'tbody',
          h(
            'tr',
            { style: 'width:100%' },
            h(
              'td',
              { class: tdClass, style: styleToString(tdStyle) },
              slots.default?.(),
            ),
          ),
        ),
      );
    };
  },
  { name: 'Container', inheritAttrs: false, props: ['tdClass'] },
);
