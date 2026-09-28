# Vuemail Components Reference

Complete reference for all Vuemail components. All examples use the Tailwind component for styling.

**Important:** Only import the components you need. Do not use components in the code if you are not importing them.

In templates, use `class` (never `className`), bind dynamic values with `:` (`:href="url"`), and write props in kebab-case (`font-family`, `td-class`). Components also accept the attributes of the element they render, like `target` or `align`.

## Available Components

All components are imported from `@vuemaildev/vuemail`:

- **Body** - A Vue component to wrap emails
- **Button** - A link that is styled to look like a button
- **CodeBlock** - Display code with a selected theme and regex highlighting using Prism.js
- **CodeInline** - Display a predictable inline code HTML element that works on all email clients
- **Column** - Display a column that separates content areas vertically in your email (must be used with Row)
- **Container** - A layout component that centers your content horizontally on a breaking point
- **Font** - A Vue Font component to set your fonts
- **Head** - Contains head components, related to the document such as style and meta elements
- **Heading** - A block of heading text
- **Hr** - Display a divider that separates content areas in your email
- **Html** - A Vue html component to wrap emails
- **Img** - Display an image in your email
- **Link** - A hyperlink to web pages, email addresses, or anything else a URL can address
- **Markdown** - A Markdown component that converts markdown to valid email HTML
- **Preview** - A preview text that will be displayed in the inbox of the recipient
- **Row** - Display a row that separates content areas horizontally in your email
- **Section** - Display a section that can also be formatted using rows and columns
- **Tailwind** - A Vue component to wrap emails with Tailwind CSS
- **Text** - A block of text separated by blank spaces

## Tailwind

The recommended way to style Vuemail components. Wrap your email content and use utility classes.

```vue
<script setup lang="ts">
import {
  Body,
  Button,
  Container,
  Heading,
  Html,
  Tailwind,
  Text,
  pixelBasedPreset,
  type TailwindConfig,
} from '@vuemaildev/vuemail';

const tailwindConfig = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        brand: '#007bff',
        accent: '#28a745',
      },
    },
  },
} satisfies TailwindConfig;
</script>

<template>
  <Html lang="en">
    <Tailwind :config="tailwindConfig">
      <Body class="bg-gray-100 font-sans">
        <Container class="max-w-xl mx-auto p-5">
          <Heading class="text-2xl font-bold text-brand mb-4">
            Welcome!
          </Heading>
          <Text class="text-base text-gray-700 mb-4">
            Your content here.
          </Text>
          <Button
            href="https://example.com"
            class="bg-brand text-white px-6 py-3 rounded-lg block text-center box-border"
          >
            Get Started
          </Button>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
```

**Props:**
- `config` - Tailwind configuration object
- `theme` - CSS for Tailwind's `@theme`, as you would write it in a stylesheet (`@theme { --color-brand: #007bff; }`)
- `utility` - CSS for your own utility classes (`.content-auto { content-visibility: auto; }`)

**How it works:**
- Uses Tailwind CSS 4, compiled while the email renders
- Tailwind classes are converted to inline styles automatically, on Vuemail components, plain elements, and your own components alike
- Media queries are extracted to `<style>` tag in `<head>`
- CSS variables are resolved
- RGB color syntax is normalized for email client compatibility

**Important:**
- Always use `pixelBasedPreset` - email clients don't support `rem` units
- Custom config is optional - defaults work well
- Avoid responsive classes (sm:, md:, lg:). These have limited email client support, and are not reliable across major clients

## Structural Components

### Html

Root wrapper for the email. Always use as the outermost component.

```vue
<script setup lang="ts">
import { Html, Tailwind, pixelBasedPreset } from '@vuemaildev/vuemail';
</script>

<template>
  <Html lang="en" dir="ltr">
    <Tailwind :config="{ presets: [pixelBasedPreset] }">
      <!-- email content -->
    </Tailwind>
  </Html>
</template>
```

**Props:**
- `lang` - Language code (e.g., "en", "es", "fr"), defaults to "en"
- `dir` - Text direction ("ltr" or "rtl"), defaults to "ltr"

### Head

Contains head components, related to the document such as style and meta elements. Place inside `<Tailwind>`.

```vue
<Head>
  <meta name="color-scheme" content="light" />
</Head>
```

`<Head>` already renders the `Content-Type` and `x-apple-disable-message-reformatting` meta tags. Vue leaves `<style>` tags out of templates, so custom CSS is rendered from `<script setup>` instead (see [STYLING.md](STYLING.md)).

### Body

A Vue component to wrap emails.

```vue
<Body class="bg-gray-100 font-sans">
  <!-- email content -->
</Body>
```

### Container

A layout component that centers your content horizontally on a breaking point. Has a max-width constraint of `37.5em`.

```vue
<Container class="max-w-xl mx-auto p-5">
  <!-- centered content -->
</Container>
```

**Props:**
- `td-class` - Classes for the inner cell. Padding, from `class` or `style`, is applied to that cell for Outlook compatibility

### Section

Display a section that can also be formatted using rows and columns.

```vue
<Section class="p-5 bg-white">
  <!-- section content -->
</Section>
```

**Props:**
- `td-class` - Classes for the inner cell, where padding is applied like in `Container`

Layout components (`<Section>`, `<Row>`, `<Container>`, `<Markdown>` tables) render `<table role="presentation">` by default so screen readers don't announce them as data tables. If you drop in a raw `<table>` for layout, add `role="presentation"` yourself.

### Row & Column

Row displays content areas horizontally, Column displays content areas vertically. A Column needs to be used in combination with a Row component.

```vue
<Section>
  <Row>
    <Column class="w-1/2 p-2 align-top">
      Left column content
    </Column>
    <Column class="w-1/2 p-2 align-top">
      Right column content
    </Column>
  </Row>
</Section>
```

**Column widths:**
- Use percentage widths (e.g., "w-1/2", "w-1/3")
- Or use Tailwind's width utilities
- Total should add up to 100% or container width

## Content Components

### Preview

A preview text that will be displayed in the inbox of the recipient. The text comes from its default slot, so it can interpolate props.

```vue
<Preview>Welcome to our platform - Get started today!</Preview>

<Preview>Welcome, {{ name }}</Preview>
```

**Props:**
- `use-title-tag` - Also renders the text as the `<title>` of the email, moved into `<head>` (default: `true`)

**Best practices:**
- Keep under 140 characters
- Make it compelling and action-oriented
- Should always be the first element inside `<Body>`

### Heading

A block of heading text (h1-h6).

```vue
<Heading as="h1" class="text-2xl font-bold text-gray-800 mb-4">
  Welcome to Acme
</Heading>

<Heading as="h2" class="text-xl font-semibold text-gray-600 mb-3">
  Getting Started
</Heading>
```

**Props:**
- `as` - HTML heading level ("h1" through "h6"), defaults to "h1"
- `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml` - Margin shorthands in pixels (e.g., `:mb="16"`)

### Text

A block of text separated by blank spaces.

```vue
<Text class="text-base leading-6 text-gray-800 my-4">
  Your paragraph content here.
</Text>
```

### Button

A link that is styled to look like a button. Has workaround for padding issues in Outlook.

```vue
<Button
  href="https://example.com/verify"
  target="_blank"
  class="bg-blue-600 text-white px-5 py-3 rounded block text-center no-underline font-medium box-border"
>
  Verify Email Address
</Button>
```

**Props:**
- `href` (required) - URL to link to, bound with `:href` when it comes from a prop
- `target` - Default is "_blank"

**Styling tips:**
- Use `block` for full-width buttons
- Use `text-center` for centered text
- Add `no-underline` to remove underline

### Link

A hyperlink to web pages, email addresses, or anything else a URL can address.

```vue
<Link href="https://example.com" target="_blank" class="text-blue-600 underline">
  Visit our website
</Link>
```

**Props:**
- `href` (required) - URL to link to
- `target` - Default is "_blank"

### Img

Display an image in your email.

```vue
<Img
  src="https://example.com/logo.png"
  alt="Company Logo"
  width="150"
  height="50"
  class="block mx-auto"
/>
```

**Props:**
- `src` (required) - Image URL (must be absolute)
- `alt` - Alt text for accessibility (defaults to `""`; set a descriptive value for meaningful images)
- `width` - Image width in pixels
- `height` - Image height in pixels

**Best practices:**
- Always use absolute URLs hosted on CDN
- **Meaningful images**: write descriptive `alt` text covering purpose and key details (e.g., `alt="Red bicycle leaning against a brick wall"`, not `alt="image"`)
- **Decorative images** (spacers, dividers, background flourishes): pass an explicit `alt=""` so screen readers skip them cleanly — never omit the attribute
- **Linked images are never decorative.** When `<Img>` sits inside a `<Link>` or `<Button>`, its `alt` must describe where the link goes (e.g., `alt="View order #123"`). An empty `alt=""` on a linked image leaves the link with no accessible name for screen readers
- Specify width and height to prevent layout shift
- Use `block` class to avoid spacing issues

### Hr

Display a divider that separates content areas in your email.

```vue
<Hr class="border-solid border-gray-200 my-5" />
```

## Specialized Components

### CodeBlock

Display code with a selected theme and regex highlighting using Prism.js.

```vue
<script setup lang="ts">
import { CodeBlock, dracula } from '@vuemaildev/vuemail';

const code = `export default defineEventHandler(async () => {
  try {
    const html = await render(EmailTemplate, { firstName: 'John' });
    return { html };
  } catch (error) {
    return { error };
  }
});`;
</script>

<template>
  <div class="overflow-auto">
    <CodeBlock
      font-family="monospace"
      :theme="dracula"
      language="javascript"
      :code="code"
    />
  </div>
</template>
```

**Props:**
- `code` (required) - The actual code to render in the code block. Just a plain string, with the proper indentation included
- `language` (required) - The language under the supported languages defined in PrismLanguage (e.g., "javascript", "python", "typescript")
- `theme` (required) - The theme to use for the code block (import from "@vuemaildev/vuemail": dracula, nord, oneDark, vscDarkPlus, etc.)
- `font-family` (optional) - The font family to use for the code block (e.g., "monospace")
- `line-numbers` (optional) - Whether or not to automatically include line numbers on the rendered code block (boolean, default: false)

**Important:**
- By default, do not use the `line-numbers` prop unless specifically requested
- Always wrap the `CodeBlock` component in a `div` tag with the `overflow-auto` class to avoid padding overflow
- Keep the code in a string in `<script setup>` and bind it with `:code`: the template would collapse its whitespace

### CodeInline

Display a predictable inline code HTML element that works on all email clients.

```vue
<Text class="text-base text-gray-800">
  Run <CodeInline class="bg-gray-100 px-1 rounded">npm install</CodeInline> to get started.
</Text>
```

### Markdown

A Markdown component that converts markdown to valid email HTML.

```vue
<script setup lang="ts">
import { Html, Markdown } from '@vuemaildev/vuemail';

const markdown = `# Hello, World!`;
const strikethrough = `# This is a ~~strikethrough~~`;
</script>

<template>
  <Html lang="en" dir="ltr">
    <Markdown
      :markdown-custom-styles="{
        h1: { color: 'red' },
        h2: { color: 'blue' },
        codeInline: { background: 'grey' },
      }"
      :markdown-container-styles="{
        padding: '12px',
        border: 'solid 1px black',
      }"
      :source="markdown"
    />

    <!-- OR -->

    <Markdown>{{ strikethrough }}</Markdown>
  </Html>
</template>
```

**Props:**
- `source` - Markdown string. When it's not given, the text of the default slot is used, so interpolate a string there (`{{ markdown }}`); never write raw markdown in the template, where Vue collapses its line breaks
- `markdown-custom-styles` - Style overrides for HTML elements (h1, h2, p, link, codeInline, etc.)
- `markdown-container-styles` - Styles for container div

### Font

A Vue Font component to set your fonts. Place it inside `<Head>`.

```vue
<Head>
  <Font
    font-family="Roboto"
    :fallback-font-family="['Arial', 'sans-serif']"
    :web-font="{
      url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
      format: 'woff2',
    }"
  />
</Head>
```

**Props:**
- `font-family` (required) - Font family name
- `fallback-font-family` (required) - Fallback font, or an array of them in priority order
- `web-font` - Object with `url` and `format`
- `font-style` - Default is "normal"
- `font-weight` - Default is 400

**Supported formats:**
- woff2 (recommended)
- woff
- truetype
- opentype
