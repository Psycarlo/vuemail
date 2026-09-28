import type { InjectionKey } from 'vue';

/** Provided as true inside an example's page. */
export const editorExamplePageKey: InjectionKey<boolean> = Symbol(
  'editor-example-page',
);

export interface EditorExample {
  slug: string;
  title: string;
  description: string;
  /** The description of the example's page, when it isn't the card's one */
  pageDescription?: string;
  /** Heading of the example's page, `subtitle` goes above the example. */
  heading: string;
  subtitle?: string;
  docsUrl?: string;
}

export interface EditorExampleSection {
  title: string;
  examples: EditorExample[];
}

export const editorExampleSections: EditorExampleSection[] = [
  {
    title: 'Standalone editor',
    examples: [
      {
        slug: 'standalone-editor',
        title: 'Minimal',
        description:
          'The simplest setup — one component with everything included.',
        heading: 'Standalone editor',
        subtitle: 'Minimal',
        docsUrl: '/docs/editor/getting-started',
      },
      {
        slug: 'standalone-editor-full',
        title: 'Full Features',
        description:
          'Theme switching, ref methods (export, getJSON), and callbacks — all with a single component.',
        pageDescription:
          'Theme switching, ref methods (getEmailHTML, getJSON), and callbacks — all with a single component.',
        heading: 'Standalone editor',
        subtitle: 'Full features',
        docsUrl: '/docs/editor/getting-started',
      },
      {
        slug: 'standalone-editor-inspector',
        title: 'Inspector',
        description:
          'Add an inspector sidebar alongside the one-line EmailEditor — no manual EditorProvider setup needed.',
        pageDescription:
          'Add an inspector sidebar alongside the standalone EmailEditor.',
        heading: 'Standalone editor',
        subtitle: 'Inspector',
        docsUrl: '/docs/editor/features/inspector',
      },
    ],
  },
  {
    title: 'Getting started',
    examples: [
      {
        slug: 'basic-editor',
        title: 'Basic editor',
        description: 'Minimal setup with StarterKit and no UI overlays.',
        heading: 'Basic editor',
        docsUrl: '/docs/editor/getting-started',
      },
      {
        slug: 'bubble-menu',
        title: 'Bubble menu',
        description:
          'Select text to see the default bubble menu with formatting options.',
        heading: 'Bubble menu',
        docsUrl: '/docs/editor/features/bubble-menu',
      },
      {
        slug: 'slash-commands',
        title: 'Slash commands',
        description:
          'Type / to open the command menu. Includes default commands plus a custom "Greeting" command.',
        heading: 'Slash commands',
        docsUrl: '/docs/editor/features/slash-commands',
      },
    ],
  },
  {
    title: 'Intermediate',
    examples: [
      {
        slug: 'custom-bubble-menu',
        title: 'Custom bubble menu',
        description: 'Building bubble menus from primitives.',
        heading: 'Custom bubble menu',
        docsUrl: '/docs/editor/features/bubble-menu',
      },
      {
        slug: 'link-editing',
        title: 'Link editing',
        description:
          'Click a link to see the link bubble menu. Select text and press Cmd+K to add links.',
        heading: 'Link editing',
        docsUrl: '/docs/editor/features/link-editing',
      },
      {
        slug: 'column-layouts',
        title: 'Column layouts',
        description: 'Insert multi-column layouts using the toolbar buttons.',
        heading: 'Column layouts',
        docsUrl: '/docs/editor/features/column-layouts',
      },
      {
        slug: 'buttons',
        title: 'Buttons',
        description:
          'Click the button to edit its link via the button bubble menu.',
        heading: 'Buttons',
        docsUrl: '/docs/editor/features/buttons',
      },
      {
        slug: 'image-upload',
        title: 'Image upload',
        description:
          'Upload images via paste, drop, or the slash command — with a stubbed uploader and an error-path toggle.',
        pageDescription:
          'Upload images via paste, drop, or the slash command using the useEditorImage composable.',
        heading: 'Image upload',
        docsUrl: '/docs/editor/features/image-upload',
      },
    ],
  },
  {
    title: 'Advanced',
    examples: [
      {
        slug: 'email-theming',
        title: 'Email theming',
        description:
          'Switch between Basic, Minimal, and Custom themes to see how email styles change.',
        pageDescription:
          'Switch between Basic and Minimal themes to see how email styles change.',
        heading: 'Email theming',
        docsUrl: '/docs/editor/features/theming',
      },
      {
        slug: 'custom-theme',
        title: 'Custom themes',
        description:
          'Define custom themes with createTheme and extendTheme helpers.',
        heading: 'Custom themes',
        docsUrl: '/docs/editor/features/theming',
      },
      {
        slug: 'email-export',
        title: 'Email export',
        description:
          'Edit content and export it as email-ready HTML using composeVueEmail().',
        heading: 'Email export',
        docsUrl: '/docs/editor/features/email-export',
      },
      {
        slug: 'custom-extensions',
        title: 'Custom extensions',
        description:
          'A custom Callout node created with EmailNode.create — showing how to extend the editor with email-compatible nodes.',
        heading: 'Custom extensions',
        docsUrl: '/docs/editor/advanced/custom-extensions',
      },
      {
        slug: 'inspector-defaults',
        title: 'Inspector — defaults',
        description:
          'Zero-config inspector sidebar. All three inspectors render sensible defaults when no children are passed.',
        heading: 'Inspector',
        subtitle: 'Defaults',
        docsUrl: '/docs/editor/overview',
      },
      {
        slug: 'inspector-composed',
        title: 'Inspector — composed',
        description:
          'Cherry-pick which sections render, control collapse state, and mix in custom sections alongside built-in ones.',
        heading: 'Inspector',
        subtitle: 'Composed',
        docsUrl: '/docs/editor/overview',
      },
      {
        slug: 'inspector-custom',
        title: 'Inspector — fully custom',
        description:
          'Build the entire inspector UI from scratch using only scoped slot data and plain HTML.',
        heading: 'Inspector',
        subtitle: 'Fully custom',
        docsUrl: '/docs/editor/overview',
      },
      {
        slug: 'full-email-builder',
        title: 'Full email builder',
        description:
          'All components combined: bubble menus, slash commands, theming, inspector sidebar, and export.',
        heading: 'Full email builder',
        docsUrl: '/docs/editor/features/email-export',
      },
    ],
  },
];

export const editorExamples = editorExampleSections.flatMap((section) =>
  section.examples.map((example) => ({ ...example, section: section.title })),
);

export type EditorIllustrationTone = 'amber' | 'green' | 'purple' | 'slate';

export const editorIllustrationSurfaceByTone: Record<
  EditorIllustrationTone,
  { inner: string; outer: string }
> = {
  amber: {
    inner: 'border-amber-6/15',
    outer: 'border-amber-6/30 bg-amber-2/10',
  },
  green: {
    inner: 'border-green-6/15',
    outer: 'border-green-6/30 bg-green-2/10',
  },
  purple: {
    inner: 'border-purple-6/15',
    outer: 'border-purple-6/30 bg-purple-2/10',
  },
  slate: {
    inner: 'border-slate-6/15',
    outer: 'border-slate-6/30 bg-slate-2/10',
  },
};

// React Email's standalone editor section is in its cyan, which is Vuemail's
// green
export function editorSectionTone(
  sectionTitle: string,
): EditorIllustrationTone {
  switch (sectionTitle) {
    case 'Advanced':
      return 'purple';
    case 'Getting started':
    case 'Standalone editor':
      return 'green';
    case 'Intermediate':
      return 'amber';
    default:
      return 'slate';
  }
}

export function getEditorExampleGitHubUrl(slug: string) {
  return `https://github.com/vuemail/vuemail/tree/main/apps/web/app/editor-examples/${slug}.vue`;
}
