import { defineComponent, type HTMLAttributes, type VNodeChild } from 'vue';
import { useTailwind } from '../element';
import { h } from '../utils/h';
import { type StyleObject, styleToString } from '../utils/style';
import type { PrismLanguage } from './languages-available';
import { Prism } from './prism';
import type { Theme } from './themes';

type PrismToken = InstanceType<typeof Prism.Token>;

export type CodeBlockProps = HTMLAttributes & {
  lineNumbers?: boolean;

  /**
   * This applies a certain font family on all elements render in this component,
   * it is mostly meant to override a global font that has already been used with
   * our `<Font>` component
   */
  fontFamily?: string;

  theme: Theme;
  language: PrismLanguage;
  code: string;
};

const stylesForToken = (token: PrismToken, theme: Theme) => {
  let styles = { ...theme[token.type] };

  const aliases = Array.isArray(token.alias) ? token.alias : [token.alias];

  for (const alias of aliases) {
    if (alias) styles = { ...styles, ...theme[alias] };
  }

  return styles;
};

const renderToken = (
  token: string | PrismToken,
  theme: Theme,
  inheritedStyles: StyleObject = {},
): VNodeChild => {
  if (token instanceof Prism.Token) {
    const styleForToken = {
      ...inheritedStyles,
      ...stylesForToken(token, theme),
    };

    if (token.content instanceof Prism.Token) {
      return h('span', { style: styleToString(styleForToken) }, [
        renderToken(token.content, theme),
      ]);
    }
    if (typeof token.content === 'string') {
      return h('span', { style: styleToString(styleForToken) }, token.content);
    }
    return token.content.map((subToken) =>
      renderToken(subToken, theme, styleForToken),
    );
  }

  return h(
    'span',
    { style: styleToString(inheritedStyles) },
    token.replaceAll(' ', '\xA0‍​'),
  );
};

export const CodeBlock = defineComponent(
  (props: CodeBlockProps, { attrs }) => {
    const resolveTailwind = useTailwind();

    return () => {
      const { class: _class, style: _style, ...rest } = attrs;
      const { style, class: className } = resolveTailwind(
        attrs.class,
        attrs.style,
      );
      const { code, fontFamily, theme, language } = props;
      const lineNumbers =
        props.lineNumbers === true || (props.lineNumbers as unknown) === '';

      const languageGrammar = Prism.languages[language];
      if (typeof languageGrammar === 'undefined') {
        throw new Error(
          `CodeBlock: There is no language defined on Prism called ${language}`,
        );
      }

      const lines = code.split(/\r\n|\r|\n/gm);
      const tokensPerLine = lines.map((line) =>
        Prism.tokenize(line, languageGrammar),
      );

      return h(
        'pre',
        {
          ...rest,
          class: className,
          style: styleToString({ ...theme.base, width: '100%', ...style }),
        },
        h(
          'code',
          tokensPerLine.map((tokensForLine, lineIndex) => [
            lineNumbers
              ? h(
                  'span',
                  {
                    style: styleToString({
                      width: '2em',
                      height: '1em',
                      display: 'inline-block',
                      fontFamily,
                    }),
                  },
                  String(lineIndex + 1),
                )
              : null,
            tokensForLine.map((token) =>
              renderToken(token, theme, { fontFamily }),
            ),
            h('br'),
          ]),
        ),
      );
    };
  },
  {
    name: 'CodeBlock',
    inheritAttrs: false,
    props: ['lineNumbers', 'fontFamily', 'theme', 'language', 'code'],
  },
);
