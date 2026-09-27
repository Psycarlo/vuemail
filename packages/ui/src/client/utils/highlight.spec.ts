import Prism from 'prismjs';
import { describe, expect, it } from 'vitest';
import {
  getTokenClass,
  getTokenStyle,
  highlight,
  lineStyle,
  normalizeTokens,
} from './highlight';

describe('normalizeTokens()', () => {
  it('groups plain strings by line', () => {
    expect(normalizeTokens(['first\nsecond'])).toEqual([
      [{ types: ['plain'], content: 'first' }],
      [{ types: ['plain'], content: 'second' }],
    ]);
  });

  it('gives empty lines a single empty token', () => {
    expect(normalizeTokens(['first\n\nthird'])).toEqual([
      [{ types: ['plain'], content: 'first' }],
      [{ types: ['plain'], content: '\n', empty: true }],
      [{ types: ['plain'], content: 'third' }],
    ]);
  });

  it('gives nested tokens the types of their parents, once each', () => {
    const tokens = Prism.tokenize('<b>', Prism.languages.markup!);

    expect(normalizeTokens(tokens)).toEqual([
      [
        { types: ['tag', 'punctuation'], content: '<' },
        { types: ['tag'], content: 'b' },
        { types: ['tag', 'punctuation'], content: '>' },
      ],
    ]);
  });
});

describe('highlight()', () => {
  it('highlights the markup of Vue sources, script blocks included', () => {
    const lines = highlight(
      '<script setup>\nconst a = 1;\n</script>\n<template>\n  <p>{{ a }}</p>\n</template>',
      'markup',
    );

    expect(lines).toHaveLength(6);
    expect(lines[1]?.some((token) => token.types.includes('keyword'))).toBe(
      true,
    );
    expect(
      lines[4]?.some(
        (token) => token.content === 'p' && token.types.includes('tag'),
      ),
    ).toBe(true);
  });

  it('leaves code in grammars Prism does not know as plain text', () => {
    expect(highlight('a\nb', 'nope')).toEqual([
      [{ types: ['plain'], content: 'a' }],
      [{ types: ['plain'], content: 'b' }],
    ]);
  });

  it('highlights JSON and markdown', () => {
    expect(
      highlight('{ "a": 1 }', 'json')[0]?.some((token) =>
        token.types.includes('property'),
      ),
    ).toBe(true);
    expect(
      highlight('# Title', 'markdown')[0]?.some((token) =>
        token.types.includes('title'),
      ),
    ).toBe(true);
  });
});

describe('token styles', () => {
  it('styles lines with the plain style of the theme', () => {
    expect(lineStyle).toEqual({
      color: '#EDEDEF',
      fontSize: '13px',
      fontFamily: 'MonoLisa, Menlo, monospace',
    });
  });

  it('styles tokens by their types, the last type winning', () => {
    expect(getTokenStyle({ types: ['plain'], content: 'a' })).toBeUndefined();
    expect(
      getTokenStyle({ types: ['plain'], content: '\n', empty: true }),
    ).toEqual({ display: 'inline-block' });
    expect(getTokenStyle({ types: ['comment'], content: '// a' })).toEqual({
      color: '#706F78',
    });
    expect(
      getTokenStyle({ types: ['tag', 'punctuation'], content: '<' }),
    ).toEqual({ color: '#706F78' });
    expect(getTokenClass({ types: ['tag', 'punctuation'], content: '<' })).toBe(
      'token tag punctuation',
    );
  });
});
