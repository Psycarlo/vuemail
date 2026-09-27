import { defineComponent, type HTMLAttributes } from 'vue';
import { useTailwind } from '../element';
import { h } from '../utils/h';
import { type StyleObject, styleToString } from '../utils/style';
import { marginProperties, paddingProperties } from './margin-properties';

export type BodyProps = HTMLAttributes;

export const Body = defineComponent(
  (_props: BodyProps, { attrs, slots }) => {
    const resolveTailwind = useTailwind();

    return () => {
      const { class: _class, style: _style, dir, lang, ...rest } = attrs;
      const { style, class: className } = resolveTailwind(
        attrs.class,
        attrs.style,
      );

      const bodyStyle: StyleObject = {
        background: style.background,
        backgroundColor: style.backgroundColor,
      };
      for (const property of [...marginProperties, ...paddingProperties]) {
        // We reset the margin if the user sets it, this mimics the
        // same behavior that would happen if this was only using the body.
        // This avoids the incoming margin summing up with the margin
        // defined by the email client on the body, or by the browser itself
        bodyStyle[property] = style[property] !== undefined ? 0 : undefined;
      }

      return h(
        'body',
        {
          ...rest,
          class: className,
          dir: dir ?? 'ltr',
          lang: lang ?? 'en',
          style: styleToString(bodyStyle),
        },
        h(
          'table',
          {
            border: 0,
            width: '100%',
            cellpadding: '0',
            cellspacing: '0',
            role: 'presentation',
            align: 'center',
          },
          h(
            'tbody',
            h(
              'tr',
              // Yahoo and AOL remove all styles of the body element while converting it to a div,
              // so we need to apply them to to an inner cell.
              //
              // See https://github.com/resend/react-email/issues/662.
              h(
                'td',
                {
                  dir: dir ?? 'ltr',
                  lang: lang ?? 'en',
                  style: styleToString(style),
                },
                slots.default?.(),
              ),
            ),
          ),
        ),
      );
    };
  },
  { name: 'Body', inheritAttrs: false },
);
