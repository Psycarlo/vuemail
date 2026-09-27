import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

export interface HighlightedToken {
  content: string;
  types: string[];
}

export type HighlightedLine = HighlightedToken[];

export interface CodeTheme {
  plain: Record<string, string>;
  styles: { types: string[]; style: Record<string, string> }[];
}

/** The theme code blocks of the website share. */
export const codeTheme: CodeTheme = {
  plain: {
    color: '#EDEDEF',
    fontSize: '13px',
    fontFamily: 'CommitMono, monospace',
  },
  styles: [
    { types: ['comment'], style: { color: '#706F78' } },
    {
      types: ['atrule', 'keyword', 'attr-name', 'selector'],
      style: { color: '#7E7D86' },
    },
    { types: ['punctuation', 'operator'], style: { color: '#706F78' } },
    {
      types: ['class-name', 'function', 'tag', 'key-white'],
      style: { color: '#EDEDEF' },
    },
  ],
};

/** Languages that Prism knows under another name. */
const languageAliases: Record<string, string> = {
  vue: 'markup',
  html: 'markup',
  sh: 'bash',
  shell: 'bash',
};

const flatten = (
  tokens: (string | Prism.Token)[],
  types: string[] = [],
): HighlightedToken[] =>
  tokens.flatMap((token) => {
    if (typeof token === 'string') return [{ content: token, types }];
    const tokenTypes = [
      ...types,
      token.type,
      ...(Array.isArray(token.alias)
        ? token.alias
        : token.alias
          ? [token.alias]
          : []),
    ];
    if (typeof token.content === 'string') {
      return [{ content: token.content, types: tokenTypes }];
    }
    return flatten(
      Array.isArray(token.content) ? token.content : [token.content],
      tokenTypes,
    );
  });

/**
 * Splits highlighted code into lines of tokens, the same shape
 * prism-react-renderer works with.
 */
export function highlight(code: string, language: string): HighlightedLine[] {
  const grammarName = languageAliases[language] ?? language;
  const grammar = Prism.languages[grammarName] ?? Prism.languages.markup!;
  const tokens = flatten(Prism.tokenize(code, grammar));

  const lines: HighlightedLine[] = [[]];
  for (const token of tokens) {
    const parts = token.content.split('\n');
    parts.forEach((part, index) => {
      if (index > 0) lines.push([]);
      if (part !== '')
        lines[lines.length - 1]!.push({ ...token, content: part });
    });
  }

  // `from` as an object key, like in `{ from: 'a' }`, stands out like other keys
  for (const line of lines) {
    line.forEach((token, index) => {
      if (token.content === 'from' && line[index + 1]?.content === ':') {
        token.types = [...token.types, 'key-white'];
      }
    });
  }
  return lines;
}

/**
 * The style a token gets from the theme. Like prism-react-renderer, the
 * styles of its types apply from the outermost to the innermost one, so that
 * the punctuation of a tag, for example, looks like punctuation.
 */
export function styleForToken(
  token: HighlightedToken,
  theme: CodeTheme = codeTheme,
): Record<string, string> {
  const style: Record<string, string> = {};
  for (const type of token.types) {
    for (const rule of theme.styles) {
      if (rule.types.includes(type)) Object.assign(style, rule.style);
    }
  }
  return style;
}
