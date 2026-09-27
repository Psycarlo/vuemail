import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import type { CSSProperties } from 'vue';

export interface Token {
  types: string[];
  content: string;
  empty?: boolean;
}

interface ThemeEntry {
  types: string[];
  style: CSSProperties;
}

export const codeTheme: { plain: CSSProperties; styles: ThemeEntry[] } = {
  plain: {
    color: '#EDEDEF',
    fontSize: '13px',
    fontFamily: 'MonoLisa, Menlo, monospace',
  },
  styles: [
    {
      types: ['comment'],
      style: {
        color: '#706F78',
      },
    },
    {
      types: ['atrule', 'keyword', 'attr-name', 'selector'],
      style: {
        color: '#7E7D86',
      },
    },
    {
      types: ['punctuation', 'operator'],
      style: {
        color: '#706F78',
      },
    },
    {
      types: ['class-name', 'function', 'tag', 'key-white'],
      style: {
        color: '#EDEDEF',
      },
    },
  ],
};

const themeDictionary = (() => {
  const dictionary: Record<string, CSSProperties> = {};
  for (const { types, style } of codeTheme.styles) {
    for (const type of types) {
      dictionary[type] = { ...dictionary[type], ...style };
    }
  }
  dictionary.root = codeTheme.plain;
  dictionary.plain = codeTheme.plain;
  return dictionary;
})();

/** The style of every line, the theme's plain style. */
export const lineStyle = themeDictionary.plain;

export const getTokenClass = (token: Token) =>
  ['token', ...token.types].join(' ');

export const getTokenStyle = ({
  types,
  empty,
}: Token): CSSProperties | undefined => {
  if (types.length === 1 && types[0] === 'plain') {
    return empty ? { display: 'inline-block' } : undefined;
  }
  if (types.length === 1 && !empty) {
    return themeDictionary[types[0]!];
  }

  return Object.assign(
    empty ? { display: 'inline-block' } : {},
    ...types.map((type) => themeDictionary[type]),
  );
};

const newlineRegex = /\r\n|\r|\n/;

// Empty lines need to contain a single empty token, denoted with { empty: true }
const normalizeEmptyLines = (line: Token[]) => {
  if (line.length === 0) {
    line.push({ types: ['plain'], content: '\n', empty: true });
  } else if (line.length === 1 && line[0]!.content === '') {
    line[0]!.content = '\n';
    line[0]!.empty = true;
  }
};

const appendTypes = (types: string[], add: string | string[]): string[] => {
  if (types.length > 0 && types[types.length - 1] === add) return types;
  return types.concat(add);
};

/**
 * Groups Prism's tokens by line, turning plain strings into tokens as well.
 * Nested tokens get the types of all of their parents, plain strings are
 * always of type "plain". The same as prism-react-renderer does.
 */
export const normalizeTokens = (
  tokens: Array<string | Prism.Token>,
): Token[][] => {
  const typeArrStack: string[][] = [[]];
  const tokenArrStack: Array<Array<string | Prism.Token>> = [tokens];
  const tokenArrIndexStack = [0];
  const tokenArrSizeStack = [tokens.length];

  let stackIndex = 0;
  let currentLine: Token[] = [];
  const lines = [currentLine];

  while (stackIndex > -1) {
    let index: number;
    while (
      (index = tokenArrIndexStack[stackIndex]!++) <
      tokenArrSizeStack[stackIndex]!
    ) {
      let content: Prism.TokenStream;
      let types = typeArrStack[stackIndex]!;
      const token = tokenArrStack[stackIndex]![index]!;

      if (typeof token === 'string') {
        types = stackIndex > 0 ? types : ['plain'];
        content = token;
      } else {
        types = appendTypes(types, token.type);
        if (token.alias) {
          types = appendTypes(types, token.alias);
        }
        content = token.content;
      }

      // Nested tokens increase the depth of the stack
      if (typeof content !== 'string') {
        stackIndex++;
        typeArrStack.push(types);
        const nested = Array.isArray(content) ? content : [content];
        tokenArrStack.push(nested);
        tokenArrIndexStack.push(0);
        tokenArrSizeStack.push(nested.length);
        continue;
      }

      const splitByNewlines = content.split(newlineRegex);
      currentLine.push({ types, content: splitByNewlines[0]! });

      for (let i = 1; i < splitByNewlines.length; i++) {
        normalizeEmptyLines(currentLine);
        currentLine = [];
        lines.push(currentLine);
        currentLine.push({ types, content: splitByNewlines[i]! });
      }
    }

    stackIndex--;
    typeArrStack.pop();
    tokenArrStack.pop();
    tokenArrIndexStack.pop();
    tokenArrSizeStack.pop();
  }

  normalizeEmptyLines(currentLine);
  return lines;
};

/** Highlights code into lines of tokens, with one of Prism's grammars. */
export const highlight = (code: string, language: string): Token[][] => {
  const grammar = Prism.languages[language];
  return normalizeTokens(grammar ? Prism.tokenize(code, grammar) : [code]);
};
