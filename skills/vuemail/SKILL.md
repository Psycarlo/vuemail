---
name: vuemail
description: Use when building HTML email templates with Vue components, adding a visual email editor to a Vue application using the Vuemail visual editor, rendering emails to HTML, or sending emails with Resend and other providers, including from Nuxt server routes. Covers welcome emails, password resets, notifications, order confirmations, newsletters, transactional emails, and the embeddable email editor component.
license: MIT
metadata:
  author: Vuemail
  version: "0.1.0"
  homepage: https://vuemail.dev
  source: https://github.com/psycarlo/vuemail
  openclaw:
    install:
      - kind: node
        package: vuemail
        label: Vuemail
    links:
      repository: https://github.com/psycarlo/vuemail
      documentation: https://vuemail.dev/docs
---

# Vuemail

Build and send HTML emails using Vue components. A modern, component-based approach to email development that works across all major email clients.

## Installation

```sh
npm i @vuemaildev/vuemail
```

Or scaffold a new project:

```sh
npx create-vuemail@latest
cd vuemail-starter
npm install
npm run dev
```

This works with any package manager (npm, yarn, pnpm, bun) — substitute accordingly.

The dev server runs at localhost:3000 with a preview interface for templates in the `emails` folder.

### Adding to an Existing Project

Install the packages (the preview app, `@vuemaildev/ui`, is a dev dependency in the same version as `@vuemaildev/vuemail`) and add a script to your `package.json`:

```sh
npm i @vuemaildev/vuemail
npm i -D @vuemaildev/ui
```

```json
{
  "scripts": {
    "email": "email dev --dir emails --port 3000"
  }
}
```

Make sure the path to the emails folder is relative to the base project directory. Emails are compiled with Vite, so TypeScript and the `paths` aliases of `tsconfig.json` work in them without extra configuration. Vuemail requires Node 20.19 or higher, and `vue` 3.4 or higher as a peer dependency.

In a Nuxt app, also add the `@vuemaildev/nuxt` module, so that server routes can import and render the emails (see [references/SENDING.md](references/SENDING.md)).

## Basic Email Template

Create an email as a Vue single file component in the `emails` folder, using the Tailwind component for styling:

```vue
<!-- emails/welcome.vue -->
<script setup lang="ts">
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
  Text,
  pixelBasedPreset,
  type TailwindConfig,
} from '@vuemaildev/vuemail';

interface WelcomeEmailProps {
  name: string;
  verificationUrl: string;
}

const { name, verificationUrl } = defineProps<WelcomeEmailProps>();

// Preview props for testing
defineOptions({
  PreviewProps: {
    name: 'John Doe',
    verificationUrl: 'https://example.com/verify/abc123',
  } satisfies WelcomeEmailProps,
});

const tailwindConfig = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        brand: '#007bff',
      },
    },
  },
} satisfies TailwindConfig;
</script>

<template>
  <Html lang="en">
    <Tailwind :config="tailwindConfig">
      <Head />
      <Body class="bg-gray-100 font-sans">
        <Preview>Welcome - Verify your email</Preview>
        <Container class="max-w-xl mx-auto p-5">
          <Heading class="text-2xl text-gray-800">
            Welcome!
          </Heading>
          <Text class="text-base text-gray-800">
            Hi {{ name }}, thanks for signing up!
          </Text>
          <Button
            :href="verificationUrl"
            class="bg-brand text-white px-5 py-3 rounded block text-center no-underline box-border"
          >
            Verify Email
          </Button>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
```

The component itself is the default export of the file, which is what the preview and `render` use.

## Behavioral Guidelines

- When iterating over the code, only update what the user asked for. Keep the rest intact.
- If the user asks to use media queries, inform them that most email clients don't support them and suggest a different approach.
- Vue templates already use `{{ }}` for interpolation: `{{ name }}` renders the value of the `name` prop. Never write the template variables of another templating system (like a `{{name}}` Mustache placeholder) directly in the template. Instead, reference the underlying props. If the user explicitly asks for `{{variableName}}` in the output, place the placeholder string only in PreviewProps (or pass it as the prop's value when rendering), never in the template:

```vue
<script setup lang="ts">
const { variableName } = defineProps<{ variableName: string }>();

defineOptions({
  PreviewProps: {
    variableName: '{{variableName}}',
  },
});
</script>

<template>
  <h1>Hello, {{ variableName }}!</h1>
</template>
```

- Never write the `{{variableName}}` pattern directly in the template, and don't escape it with `v-pre`. If the user insists, explain that Vue parses it as an interpolation of a `variableName` binding, which renders that binding's value instead of the placeholder, and that hardcoding it with `v-pre` would make the template unusable with real data.

## Essential Components

See [references/COMPONENTS.md](references/COMPONENTS.md) for complete component documentation.

**Core Structure:**
- `Html` - Root wrapper with `lang` attribute
- `Head` - Meta elements, styles, fonts
- `Body` - Main content wrapper
- `Container` - Outermost centering wrapper (has built-in `max-width: 37.5em`). Use only once per email.
- `Section` - Interior content blocks (no built-in max-width). Use for grouping content inside `Container`.
- `Row` & `Column` - Multi-column layouts
- `Tailwind` - Enables Tailwind CSS utility classes

**Content:**
- `Preview` - Inbox preview text (from its default slot), always first inside `<Body>`
- `Heading` - h1-h6 headings
- `Text` - Paragraphs
- `Button` - Styled link buttons (always include `box-border`)
- `Link` - Hyperlinks
- `Img` - Images (see Static Files section below)
- `Hr` - Horizontal dividers

**Specialized:**
- `CodeBlock` - Syntax-highlighted code
- `CodeInline` - Inline code
- `Markdown` - Render markdown (passed with the `source` prop)
- `Font` - Custom web fonts

## Before Writing Code

When a user requests an email template, ask clarifying questions FIRST if they haven't provided:

1. **Brand colors** - Ask for primary brand color (hex code like #007bff)
2. **Logo** - Ask if they have a logo file and its format (PNG/JPG only - warn if SVG/WEBP)
3. **Style preference** - Professional, casual, or minimal tone
4. **Production URL** - Where will static assets be hosted in production?

## Static Files and Images

### Directory Structure

Local images must be placed in the `static` folder inside your emails directory:

```
project/
├── emails/
│   ├── welcome.vue
│   └── static/           <-- Images go here
│       └── logo.png
```

### Dev vs Production URLs

Use this pattern for images that work in both dev preview and production:

```vue
<script setup lang="ts">
import { Img } from '@vuemaildev/vuemail';

const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://cdn.example.com' // User's production CDN
  : '';
</script>

<template>
  <Img
    :src="`${baseURL}/static/logo.png`"
    alt="Logo"
    width="150"
    height="50"
  />
</template>
```

**How it works:**
- **Development:** `baseURL` is empty, so URL is `/static/logo.png` - served by Vuemail's preview server
- **Production:** `baseURL` is the CDN domain, so URL is `https://cdn.example.com/static/logo.png`

**Important:** Always ask the user for their production hosting URL. Do not hardcode `localhost:3000`.

## Styling

See [references/STYLING.md](references/STYLING.md) for comprehensive styling documentation including typography, layout patterns, dark mode, and brand consistency.

### Key Rules

- Use `Tailwind` with `pixelBasedPreset` (email clients don't support `rem`). Import `pixelBasedPreset` from `@vuemaildev/vuemail`.
- Never use flexbox or grid — use `Row`/`Column` components or tables for layouts.
- Avoid CSS/Tailwind media queries (`sm:`, `md:`, `lg:`, `xl:`) — limited email client support.
- Never use theme selectors (`dark:`, `light:`) — not supported.
- Never use SVG or WEBP images — warn users about rendering issues.
- Always specify border type (`border-solid`, `border-dashed`, etc.) — email clients don't inherit it.
- For single-side borders, reset others first (`border-none border-l border-solid`).
- In `:style` objects, write lengths as strings with units (`'16px'`): Vuemail components add `px` to numbers, but plain elements like `<td>` don't.

### Required Classes

| Component | Required Class | Why |
|-----------|---------------|-----|
| `Button` | `box-border` | Prevents padding from overflowing the button width |
| `Hr` / any border | `border-solid` (or `border-dashed`, etc.) | Email clients don't inherit border type |
| Single-side borders | `border-none` + the side | Resets default borders on other sides |

### Structure Notes
- Always define `<Head />` inside `<Tailwind>` when using Tailwind CSS
- `<Preview>` should always be the first element inside `<Body>`
- Only include props in `PreviewProps` that the component actually uses
- Use fixed width/height for known-size elements (logos, icons); responsive sizing (`w-full`, `h-auto`) for content images

### Vue Notes
- Use `class`, never `className`. Bind dynamic values with `:` (`:href="url"`) and write component props in kebab-case in templates (`font-family`, `td-class`).
- `defineOptions()` is hoisted out of `setup()`, so write `PreviewProps` inline with literals (imported values work too), never with objects or values computed in `<script setup>`.
- Vue leaves `<style>` tags out of templates. Render custom CSS from `<script setup>` with `h('style', { innerHTML: css })` (see [references/STYLING.md](references/STYLING.md)).
- Pass markdown to `<Markdown>` with `:source="markdown"` (or `{{ markdown }}`), never as raw text in the template, where Vue collapses its line breaks.

## Rendering

### Convert to HTML

```ts
import { render } from '@vuemaildev/vuemail';
import WelcomeEmail from './emails/welcome.vue';

const html = await render(WelcomeEmail, {
  name: 'John',
  verificationUrl: 'https://example.com/verify',
});
```

### Convert to Plain Text

```ts
const text = await render(
  WelcomeEmail,
  { name: 'John', verificationUrl: 'https://example.com/verify' },
  { plainText: true },
);
```

Importing a `.vue` file needs a build step that compiles it: Nuxt with the `@vuemaildev/nuxt` module, Vite (an SSR build, or vite-node), or a bundler with a Vue plugin, like tsdown with `unplugin-vue`. Plain Node can't import `.vue` files.

## Sending

Vuemail supports sending with any email service provider. See [references/SENDING.md](references/SENDING.md) for complete sending documentation including Resend, Nodemailer, SendGrid, and Nuxt server route examples.

Quick example using the Resend SDK:

```ts
import { Resend } from 'resend';
import { render } from '@vuemaildev/vuemail';
import WelcomeEmail from './emails/welcome.vue';

const resend = new Resend(process.env.RESEND_API_KEY);

const props = { name: 'John', verificationUrl: 'https://example.com/verify' };

const { data, error } = await resend.emails.send({
  from: 'Acme <onboarding@resend.dev>',
  to: ['user@example.com'],
  subject: 'Welcome to Acme',
  html: await render(WelcomeEmail, props),
  text: await render(WelcomeEmail, props, { plainText: true }),
});
```

The `react` option of the Resend SDK only takes React elements, so render Vuemail emails into `html` and `text` yourself.

## CLI Commands

The `@vuemaildev/vuemail` package provides a CLI accessible via the `email` command:

| Command | Description |
|---------|-------------|
| `email dev --dir <path> --port <port>` | Start the preview development server (default: `./emails`, port 3000) |
| `email build --dir <path>` | Build the preview app into a static website (in `.vuemail`) |
| `email start` | Run the built preview app |
| `email export --outDir <path> --pretty --plainText --dir <path>` | Export templates to static HTML files |
| `email resend setup` | Connect the CLI to your Resend account via API key |
| `email resend reset` | Remove the stored Resend API key |

## Internationalization

See [references/I18N.md](references/I18N.md) for complete i18n documentation. Vuemail works with vue-i18n, installed for each render through the `setupApp` option of `render`, and with messages passed as props.

## Email Editor

Vuemail includes a visual editor (`@vuemaildev/editor`) that can be embedded in your Vue app. It's built on TipTap/ProseMirror and produces email-ready HTML.

See [references/EDITOR.md](references/EDITOR.md) for complete documentation including:
- `EmailEditor` — batteries-included component with bubble menus, slash commands, and theming
- `StarterKit` — email-aware extensions (headings, lists, tables, columns, buttons, etc.)
- `Inspector` — contextual sidebar for editing styles
- `EmailTheming` — built-in themes (`basic`, `minimal`) with customizable CSS properties
- `composeVueEmail` — export editor content to email-ready HTML and plain text
- Custom extensions via `EmailNode` and `EmailMark`

Quick example:

```vue
<script setup lang="ts">
import { EmailEditor, type EmailEditorRef } from '@vuemaildev/editor';
import '@vuemaildev/editor/themes/default.css';
import { ref } from 'vue';

const editorRef = ref<EmailEditorRef | null>(null);
</script>

<template>
  <EmailEditor
    ref="editorRef"
    content="<p>Start typing...</p>"
    theme="basic"
  />
</template>
```

## Common Patterns

See [references/PATTERNS.md](references/PATTERNS.md) for complete examples including:
- Password reset emails
- Order confirmations with product lists
- Notification emails with code blocks
- Multi-column layouts
- Team invitation emails

## Email Best Practices

1. **Test across email clients** - Gmail, Outlook, Apple Mail, Yahoo Mail
2. **Keep it responsive** - Max-width around 600px, test on mobile
3. **Use absolute image URLs** - Host on reliable CDN
4. **Write meaningful alt text** - Describe purpose and details for content images; use `alt=""` for decorative images (spacers, dividers, background flourishes). Vuemail's `<Img>` defaults to `alt=""`.
5. **Provide plain text version** - Required for accessibility
6. **Keep file size under 102KB** - Gmail clips larger emails
7. **Add proper TypeScript types** - Define interfaces for all email props, used with `defineProps<Props>()`
8. **Include preview props** - Add `defineOptions({ PreviewProps })` for development testing
9. **Use verified domains** - For production `from` addresses

### Accessibility

Vuemail handles the structural defaults; the rest is content.

**What Vuemail gives you for free:**
- `<Html>` sets `lang` and `dir` (defaults: `lang="en" dir="ltr"` — override per locale)
- `<Img>` defaults to `alt=""` so decorative images are skipped by screen readers
- `<Markdown>` renders tables with `role="presentation"`
- `<Preview>` also emits a `<title>` tag

**What you still have to do (content choices):**
- Open with a single `<Heading as="h1">`, nest subheadings in order, never skip levels (very short SMS-style emails may skip the heading entirely)
- Set descriptive `alt` on meaningful images; pass an explicit `alt=""` on decorative images — never omit the attribute
- **Linked images are never decorative.** When an `<Img>` is inside a `<Link>` or `<Button>`, the `alt` must describe where the link goes — `alt=""` on a linked image leaves the link with no accessible name
- Write link text that describes the destination (`<Button>Read the report</Button>`, not `click here`)
- Hit 4.5:1 text contrast (WCAG AA); preview in dark mode
- For layout tables you build by hand (outside `<Markdown>`), add `role="presentation"`
- For non-English emails, pass the locale: `<Html :lang="locale" :dir="isRTL ? 'rtl' : 'ltr'">` (see [I18N.md](references/I18N.md))

For the full rule set, severity ranking, and authoring checklist, see the [accessibility reference](https://github.com/resend/email-best-practices/blob/main/references/accessibility.md) in the `email-best-practices` skill.

## Additional Resources

- [Vuemail Documentation](https://vuemail.dev/docs/llms.txt)
- [Vuemail GitHub](https://github.com/psycarlo/vuemail)
- [Resend Documentation](https://resend.com/docs/llms.txt)
- [Email Client CSS Support](https://www.caniemail.com)
- Component Reference: [references/COMPONENTS.md](references/COMPONENTS.md)
- Styling Guide: [references/STYLING.md](references/STYLING.md)
- Email Editor: [references/EDITOR.md](references/EDITOR.md)
- Sending Guide: [references/SENDING.md](references/SENDING.md)
- Internationalization Guide: [references/I18N.md](references/I18N.md)
- Common Patterns: [references/PATTERNS.md](references/PATTERNS.md)
