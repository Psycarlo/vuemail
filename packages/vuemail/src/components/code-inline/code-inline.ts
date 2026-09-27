import { defineComponent, type HTMLAttributes } from 'vue';
import { useTailwind } from '../element';
import { h } from '../utils/h';
import { styleToString } from '../utils/style';

export type CodeInlineProps = HTMLAttributes;

/**
 * If you are sending emails for users that have the Orange.fr email client,
 * beware that this component will only work when you have a head containing meta tags.
 */
export const CodeInline = defineComponent(
  (_props: CodeInlineProps, { attrs, slots }) => {
    const resolveTailwind = useTailwind();

    return () => {
      const { class: _class, style: _style, ...rest } = attrs;
      const { style, class: className } = resolveTailwind(
        attrs.class,
        attrs.style,
      );
      const withClass = (marker: string) =>
        className ? `${className} ${marker}` : marker;

      return [
        // This style tag is targeted at fixing an issue for the Orange.fr email client
        // See:
        // - https://www.caniemail.com/features/html-code/
        // - https://www.howtotarget.email/#2019-03-26-freenet-2
        //
        // On that email client, the head and html elements are removed, making the meta tag a sibling of them
        // allowing us to use a selector on them. Also <style> tags are supported on it.
        h('style', {
          innerHTML: `
        meta ~ .cino {
          display: none !important;
          opacity: 0 !important;
        }

        meta ~ .cio {
          display: block !important;
        }
      `,
        }),
        // Does not render on Orange.fr
        h(
          'code',
          { ...rest, class: withClass('cino'), style: styleToString(style) },
          slots.default?.(),
        ),
        // Renders only on Orange.fr
        h(
          'span',
          {
            ...rest,
            class: withClass('cio'),
            style: styleToString({ display: 'none', ...style }),
          },
          slots.default?.(),
        ),
      ];
    };
  },
  { name: 'CodeInline', inheritAttrs: false },
);
