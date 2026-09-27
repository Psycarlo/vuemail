import { defineComponent, type HTMLAttributes } from 'vue';
import { useTailwind } from '../element';
import { h } from '../utils/h';
import { getSlotText } from '../utils/slot-text';
import { styleToString } from '../utils/style';

export type PreviewProps = HTMLAttributes & {
  /**
   * @default true
   */
  useTitleTag?: boolean;
};

const PREVIEW_MAX_LENGTH = 200;

const hiddenStyle =
  'display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0';

const whiteSpaceCodes = '\xa0‌​‍‎‏﻿';

export const renderWhiteSpace = (text: string) => {
  if (text.length >= PREVIEW_MAX_LENGTH) {
    return null;
  }

  return h('div', whiteSpaceCodes.repeat(PREVIEW_MAX_LENGTH - text.length));
};

export const Preview = defineComponent(
  (props: PreviewProps, { attrs, slots }) => {
    const resolveTailwind = useTailwind();

    return () => {
      const { class: _class, style: _style, ...rest } = attrs;
      const { style, class: className } = resolveTailwind(
        attrs.class,
        attrs.style,
      );
      // Trimmed because templates break lines around text, which Vue turns
      // into spaces at both of its ends.
      const text = getSlotText(slots.default?.())
        .trim()
        .substring(0, PREVIEW_MAX_LENGTH);
      const useTitleTag = (props.useTitleTag as unknown) !== false;

      return [
        // `render()` moves this title into the <head>, as React does
        useTitleTag ? h('title', { 'data-vuemail-hoist': '' }, text) : null,
        h(
          'div',
          {
            'data-skip-in-text': 'true',
            ...rest,
            class: className,
            style: styleToString(style) ?? hiddenStyle,
          },
          [text, renderWhiteSpace(text)],
        ),
      ];
    };
  },
  { name: 'Preview', inheritAttrs: false, props: ['useTitleTag'] },
);
