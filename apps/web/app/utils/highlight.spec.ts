import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { codeTheme, highlight, styleForToken } from './highlight';

const colorsOf = (code: string, language: string) =>
  highlight(code, language)
    .flat()
    .map((token) => [token.content, styleForToken(token).color ?? 'plain']);

describe('highlight()', () => {
  it('splits the tokens into lines', () => {
    const lines = highlight('const a = 1;\nconst b = 2;', 'ts');

    expect(lines).toHaveLength(2);
    expect(lines[1]!.map((token) => token.content).join('')).toBe(
      'const b = 2;',
    );
  });

  it('colors the parts of a tag like prism-react-renderer', () => {
    const colors = colorsOf('<td align="center">', 'tsx');
    const color = (content: string) =>
      colors.find(([token]) => token === content)?.[1];

    const [punctuation, attributeName, tag] = [
      codeTheme.styles[2]!.style.color,
      codeTheme.styles[1]!.style.color,
      codeTheme.styles[3]!.style.color,
    ];
    expect(color('<')).toBe(punctuation);
    expect(color('td')).toBe(tag);
    expect(color('align')).toBe(attributeName);
    expect(color('>')).toBe(punctuation);
  });

  it('highlights Vue files as markup', () => {
    const colors = colorsOf('<template><Html /></template>', 'vue');

    expect(colors.some(([, color]) => color !== 'plain')).toBe(true);
  });
});

describe('codeTheme', () => {
  it('renders code with the mono font the site declares', () => {
    const css = readFileSync(
      fileURLToPath(new URL('../assets/css/globals.css', import.meta.url)),
      'utf8',
    );
    const declared = [
      ...css.matchAll(/@font-face\s*{[^}]*font-family:\s*"([^"]+)"/g),
    ].map((match) => match[1]);
    const family = codeTheme.plain
      .fontFamily!.split(',')[0]!
      .replaceAll('"', '');

    expect(declared).toContain(family);
  });
});
