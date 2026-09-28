import { describe, expect, it } from 'vitest';
import { componentsStructure } from '../../../components/structure';
import { categoryMarkdown, componentsIndexMarkdown } from './components';

const category = {
  name: 'Code Block',
  description: 'Syntax highlighted code.',
  components: [{ slug: 'code-block-basic', title: 'Basic code block' }],
};

describe('componentsIndexMarkdown', () => {
  it('lists each category with its markdown url', () => {
    const markdown = componentsIndexMarkdown([category]);

    expect(markdown).toContain('## Code Block');
    expect(markdown).toContain(
      'Markdown: https://vuemail.dev/components/code-block.md',
    );
    expect(markdown).toContain('- Basic code block');
  });

  it('lists every category of the gallery', () => {
    const markdown = componentsIndexMarkdown(componentsStructure);

    expect(markdown.startsWith('# Vuemail Components\n')).toBe(true);
    for (const { name, components } of componentsStructure) {
      expect(markdown).toContain(`## ${name}\n`);
      for (const { title } of components) {
        expect(markdown).toContain(`- ${title}\n`);
      }
    }
  });
});

describe('categoryMarkdown', () => {
  it('emits one fenced block per available variant, in a fixed order', () => {
    const markdown = categoryMarkdown(category, [
      {
        slug: 'code-block-basic',
        title: 'Basic code block',
        code: {
          html: '<table></table>',
          'inline-styles': '<template>\n  <Section :style="{}" />\n</template>',
          tailwind: '<template>\n  <Section class="p-4" />\n</template>',
        },
      },
    ]);

    expect(markdown.indexOf('### Tailwind')).toBeLessThan(
      markdown.indexOf('### Inline styles'),
    );
    expect(markdown).toContain(
      '```vue\n<template>\n  <Section class="p-4" />\n</template>\n```',
    );
    expect(markdown).not.toContain('<table>');
    expect(markdown).toContain(
      'Source: https://github.com/psycarlo/vuemail/tree/main/apps/web/components/code-block-basic',
    );
  });

  it('emits the Vue variant for single-file components', () => {
    const markdown = categoryMarkdown(category, [
      {
        slug: 'code-block-basic',
        title: 'Basic code block',
        code: {
          html: '<table></table>',
          vue: '<template>\n  <CodeBlock code="x" />\n</template>',
        },
      },
    ]);

    expect(markdown).toContain(
      '### Vue\n\n```vue\n<template>\n  <CodeBlock code="x" />\n</template>\n```',
    );
    expect(markdown).not.toContain('### Tailwind');
  });

  it('starts with the category and where to see it', () => {
    const markdown = categoryMarkdown(category, []);

    expect(markdown).toContain(
      '# Code Block\n\n> Syntax highlighted code.\n\nWeb: https://vuemail.dev/components/code-block\n',
    );
  });
});
