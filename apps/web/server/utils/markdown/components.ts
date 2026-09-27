import type { Category } from '../../../components/structure';
import { slugify } from '../../../shared/utils/slugify';
import type { CodeVariant, ImportedComponent } from '../gallery';

const SITE = 'https://vuemail.dev';
const SOURCE =
  'https://github.com/vuemail/vuemail/tree/main/apps/web/components';

const variantHeadings: Array<[CodeVariant, string]> = [
  ['tailwind', 'Tailwind'],
  ['inline-styles', 'Inline styles'],
  ['vue', 'Vue'],
];

const fence = (code: string) => ['```vue', code.trimEnd(), '```'].join('\n');

export const categoryUrl = (category: Category) =>
  `${SITE}/components/${slugify(category.name)}`;

export const componentsIndexMarkdown = (categories: Category[]): string => {
  const lines = [
    '# Vuemail Components',
    '',
    '> Copy-paste components for emails built with Vue and TypeScript. Each category page is available as markdown by appending `.md` to its URL.',
    '',
  ];

  for (const category of categories) {
    lines.push(`## ${category.name}`, '', category.description, '');
    lines.push(`Markdown: ${categoryUrl(category)}.md`, '');
    for (const component of category.components) {
      lines.push(`- ${component.title}`);
    }
    lines.push('');
  }

  return lines.join('\n');
};

export const categoryMarkdown = (
  category: Category,
  components: ImportedComponent[],
): string => {
  const lines = [
    `# ${category.name}`,
    '',
    `> ${category.description}`,
    '',
    `Web: ${categoryUrl(category)}`,
    '',
    'Paste any snippet into an email built with Vuemail. The snippets are single file components that use the primitives from `vuemail`.',
    '',
  ];

  for (const component of components) {
    lines.push(`## ${component.title}`, '');
    lines.push(`Source: ${SOURCE}/${component.slug}`, '');
    for (const [variant, heading] of variantHeadings) {
      const code = component.code[variant];
      if (code) {
        lines.push(`### ${heading}`, '', fence(code), '');
      }
    }
  }

  return lines.join('\n');
};

export const markdownHeaders = {
  'Content-Type': 'text/markdown; charset=utf-8',
  'Cache-Control': 'public, max-age=86400, s-maxage=86400',
};
