import { componentsStructure } from '../../components/structure';
import { slugify } from '../../shared/utils/slugify';

const SITE = 'https://vuemail.dev';

// The examples of the editor, the pages under `/editor`
const editorExampleSlugs = [
  'standalone-editor',
  'standalone-editor-full',
  'standalone-editor-inspector',
  'basic-editor',
  'bubble-menu',
  'slash-commands',
  'custom-bubble-menu',
  'link-editing',
  'column-layouts',
  'buttons',
  'image-upload',
  'email-theming',
  'custom-theme',
  'email-export',
  'custom-extensions',
  'inspector-defaults',
  'inspector-composed',
  'inspector-custom',
  'full-email-builder',
];

export default defineEventHandler((event) => {
  const lastModified = new Date().toISOString().split('T')[0];

  const urls = [
    ...['', '/components', '/templates'].map((route) => `${SITE}${route}`),
    ...componentsStructure.map(
      (category) => `${SITE}/components/${slugify(category.name)}`,
    ),
    `${SITE}/editor`,
    ...editorExampleSlugs.map((slug) => `${SITE}/editor/${slug}`),
  ];

  setResponseHeader(event, 'Content-Type', 'application/xml');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      (url) =>
        `<url>\n<loc>${url}</loc>\n<lastmod>${lastModified}</lastmod>\n</url>`,
    ),
    '</urlset>',
    '',
  ].join('\n');
});
