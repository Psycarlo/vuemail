import { defineComponent, type HTMLAttributes } from 'vue';
import { useTailwind } from '../element';
import { h } from '../utils/h';
import { type StyleObject, styleToString } from '../utils/style';
import { computeMargins } from './utils/compute-margins';

export type TextProps = HTMLAttributes;

export const Text = defineComponent(
  (_props: TextProps, { attrs, slots }) => {
    const resolveTailwind = useTailwind();

    return () => {
      const { class: _class, style: _style, ...rest } = attrs;
      const { style, class: className } = resolveTailwind(
        attrs.class,
        attrs.style,
      );

      /**
       * we do this clunky way of spreading these default margins because
       * if we were to simply spread, the ordering of the margins would be lost
       *
       * ex:
       * ```js
       * { ...{ marginTop: '16px', marginBottom: '16px' }, ...{ marginTop: '24px' } }
       * // would result in
       * { marginTop: '24px', marginBottom: '16px' }
       * // not the expected
       * { marginBottom: '16px', marginTop: '24px' }
       * ```
       */
      const defaultMargins: StyleObject = {};
      if (style.marginTop === undefined) {
        defaultMargins.marginTop = '16px';
      }
      if (style.marginBottom === undefined) {
        defaultMargins.marginBottom = '16px';
      }
      const margins = computeMargins({
        ...defaultMargins,
        ...style,
      } as Parameters<typeof computeMargins>[0]);

      return h(
        'p',
        {
          ...rest,
          class: className,
          style: styleToString({
            fontSize: '14px',
            lineHeight: '24px',
            ...style,
            ...margins,
          }),
        },
        slots.default?.(),
      );
    };
  },
  { name: 'Text', inheritAttrs: false },
);
