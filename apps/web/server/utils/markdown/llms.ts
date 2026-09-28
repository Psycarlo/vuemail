import type { Category } from '../../../components/structure';
import { categoryUrl } from './components';

const description =
  'A collection of high-quality, unstyled components for creating beautiful emails using Vue and TypeScript.';

/** The contents of `/llms.txt` */
export const llmsTxt = (categories: Category[]): string => `# Vuemail

> ${description}

Vuemail is an open-source library that lets developers build emails with Vue components instead of raw HTML tables. It includes unstyled primitives (Button, Container, Head, Html, Img, Link, Section, Text, etc.) and a pattern library of 60+ copy-paste components across 25 categories.

## Key Links

- Documentation: https://vuemail.dev/docs
- Documentation for LLMs: https://vuemail.dev/docs/llms.txt
- Components: https://vuemail.dev/components
- Templates: https://vuemail.dev/templates
- Editor: https://vuemail.dev/editor
- GitHub: https://github.com/psycarlo/vuemail
- npm: https://www.npmjs.com/package/@vuemaildev/vuemail

## Getting Started

npx create-vuemail@latest

## Integrations

Works with any email provider: Resend, SendGrid, AWS SES, Postmark, Nodemailer, and more.

## Component Categories

${categories.map((category) => category.name).join(', ')}

## Skills

- [Vuemail Skill](https://raw.githubusercontent.com/psycarlo/vuemail/main/skills/vuemail/SKILL.md)

## Optional

- [Full component catalog](https://vuemail.dev/llms-full.txt)
- [Components as markdown](https://vuemail.dev/components.md): append \`.md\` to any components URL, or send \`Accept: text/markdown\`
- [Templates as markdown](https://vuemail.dev/templates.md): every template with its preview and source links
`;

const primitives: Array<[string, string]> = [
  ['Body', '<Body> wrapper'],
  ['Button', '<Button> with link support'],
  ['Column', '<Column> for table-based layouts'],
  ['Container', '<Container> with max-width centering'],
  ['Font', '<Font> for web font loading'],
  ['Head', '<Head> with meta tags'],
  ['Heading', '<Heading> (h1-h6)'],
  ['Hr', '<Hr> horizontal rule'],
  ['Html', '<Html> root element'],
  ['Img', '<Img> with dimensions'],
  ['Link', '<Link> anchor tag'],
  ['Markdown', '<Markdown> renderer'],
  ['Preview', '<Preview> preheader text'],
  ['Row', '<Row> for table rows'],
  ['Section', '<Section> table wrapper'],
  ['Tailwind', '<Tailwind> CSS utility support'],
  ['Text', '<Text> paragraph'],
];

/** The contents of `/llms-full.txt` */
export const llmsFullTxt = (categories: Category[]): string => {
  const lines: string[] = [
    '# Vuemail — Full Component Catalog',
    '',
    `> ${description}`,
    '',
    'Vuemail is an open-source library that lets developers build emails with Vue components instead of raw HTML tables. Components are copy-paste ready and work with any email provider.',
    '',
    '## Installation',
    '',
    '```',
    'npx create-vuemail@latest',
    '```',
    '',
    '## Primitives',
    '',
    'Core building blocks, all exported by the `@vuemaildev/vuemail` npm package:',
    '',
    ...primitives.map(([name, summary]) => `- ${name} — ${summary}`),
    '',
    '## Component Categories',
    '',
  ];

  for (const category of categories) {
    lines.push(`### ${category.name}`);
    lines.push('');
    lines.push(category.description);
    lines.push('');
    const url = categoryUrl(category);
    lines.push(`URL: ${url}`);
    lines.push(`Markdown: ${url}.md`);
    lines.push('');

    for (const component of category.components) {
      lines.push(`- ${component.title}`);
    }

    lines.push('');
  }

  lines.push('## Integrations');
  lines.push('');
  lines.push('Works with any email sending service:');
  lines.push('');
  lines.push('- Resend (https://vuemail.dev/docs/integrations/resend)');
  lines.push('- SendGrid (https://vuemail.dev/docs/integrations/sendgrid)');
  lines.push('- AWS SES (https://vuemail.dev/docs/integrations/aws-ses)');
  lines.push('- Postmark (https://vuemail.dev/docs/integrations/postmark)');
  lines.push('- Nodemailer (https://vuemail.dev/docs/integrations/nodemailer)');
  lines.push('');
  lines.push('## Links');
  lines.push('');
  lines.push('- Documentation: https://vuemail.dev/docs');
  lines.push('- GitHub: https://github.com/psycarlo/vuemail');
  lines.push('- npm: https://www.npmjs.com/package/@vuemaildev/vuemail');
  lines.push('- Templates: https://vuemail.dev/templates');
  lines.push('- Editor: https://vuemail.dev/editor');
  lines.push('');

  return lines.join('\n');
};

export const llmsHeaders = {
  'Content-Type': 'text/plain; charset=utf-8',
  'Cache-Control': 'public, max-age=86400, s-maxage=86400',
};
