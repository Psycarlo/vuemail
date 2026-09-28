# Styling Guide

Comprehensive styling reference for Vuemail templates.

## Styling Approach

Use the `Tailwind` component for styling if the project uses Tailwind CSS. Otherwise, use inline styles.

```vue
<script setup lang="ts">
import { Tailwind, pixelBasedPreset, type TailwindConfig } from '@vuemaildev/vuemail';

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
  <Tailwind :config="tailwindConfig">
    <!-- Email content -->
  </Tailwind>
</template>
```

## Tailwind CSS 4

`<Tailwind>` compiles the classes of the email with Tailwind CSS 4 while it renders, and inlines them as `style` attributes. It doesn't scan files or read your app's stylesheet, so:

- Classes built at runtime work, like `:class="['text-white', severityColors[severity]]"`
- An app that uses Tailwind CSS 4 itself, with Vite or Nuxt, keeps its own setup: share design tokens with the emails through the props below

It takes three props:

- `config` - a JavaScript configuration object (`presets`, `theme.extend`, `plugins`), typed with `TailwindConfig`
- `theme` - CSS for Tailwind's `@theme`, as you would write it in a stylesheet
- `utility` - CSS for your own utility classes

```vue
<Tailwind
  :config="{ presets: [pixelBasedPreset] }"
  theme="@theme { --color-brand: #007bff; --font-display: 'Satoshi', sans-serif; }"
  utility=".card-shadow { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }"
>
  <!-- bg-brand, font-display and card-shadow work in here -->
</Tailwind>
```

## pixelBasedPreset

Email clients don't support `rem` units. Always use `pixelBasedPreset` in your Tailwind configuration to convert rem-based utilities to pixels:

```vue
<Tailwind :config="{ presets: [pixelBasedPreset] }">
  <!-- Email content -->
</Tailwind>
```

## Inline Styles

Without Tailwind, style components with `:style` objects, or with `style` strings:

```vue
<script setup lang="ts">
import { Button, Container, Text } from '@vuemaildev/vuemail';

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
};

const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
};
</script>

<template>
  <Container :style="container">
    <Text :style="paragraph">Your paragraph content here.</Text>
    <Button
      href="https://example.com"
      style="background-color: #656ee8; color: #ffffff; padding: 12px 20px"
    >
      Click Here
    </Button>
  </Container>
</template>
```

### Units

Vuemail components add `px` to the numbers of style objects, except for unitless properties like `lineHeight`, `fontWeight` and `opacity`. Plain elements (`<div>`, `<td>`, `<span>`) use Vue's own style binding, which never adds units:

```vue
<!-- Renders padding:12px -->
<Section :style="{ padding: 12 }" />

<!-- Renders padding:12, which email clients ignore -->
<td :style="{ padding: 12 }" />
```

Always write lengths as strings with units, like `'12px'`, so styles work on both. Use `px`, never `rem`: email clients don't support it.

### Custom CSS

Vue leaves `<style>` tags out of templates, and the `<style>` blocks of single file components never reach the email either. Render the CSS that can't be inline, like a web font `@import`, from `<script setup>`:

```vue
<script setup lang="ts">
import { h } from 'vue';
import { Head } from '@vuemaildev/vuemail';

// Vue leaves <style> tags out of templates, so this one is rendered from here
const FontImport = () =>
  h('style', {
    innerHTML: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');`,
  });
</script>

<template>
  <Head>
    <FontImport />
  </Head>
</template>
```

Many email clients strip `<style>` tags, so keep everything you can inline, and prefer the `Font` component for web fonts.

## Email Client Limitations

Email clients have significant CSS restrictions. Follow these rules:

### Unsupported Features

- **SVG/WEBP images** - Use PNG or JPEG only
- **Flexbox/Grid** - Use `Row`/`Column` components or tables
- **Media queries** - `sm:`, `md:`, `lg:`, `xl:` prefixes don't work
- **Theme selectors** - `dark:`, `light:` prefixes don't work
- **rem units** - Use `pixelBasedPreset` for pixel conversion

### Border Handling

Always specify border style and reset other sides when needed:

```vue
<!-- Correct - specify border style -->
<div class="border-solid border border-gray-300" />

<!-- Correct - single side border with reset -->
<div class="border-none border-l border-solid border-l-gray-300" />

<!-- Incorrect - missing border style -->
<div class="border border-gray-300" />
```

## Component Structure

### Head Placement

Always define `<Head />` inside `<Tailwind>` when using Tailwind CSS:

```vue
<Html>
  <Tailwind :config="{ presets: [pixelBasedPreset] }">
    <Head />
    <Body>...</Body>
  </Tailwind>
</Html>
```

### PreviewProps

Only include props that the component actually uses:

```vue
<script setup lang="ts">
const { source } = defineProps<{ source: string }>();

defineOptions({
  PreviewProps: {
    source: 'https://example.com',
  },
});
</script>

<template>
  <div>
    <a :href="source">Click here</a>
  </div>
</template>
```

`defineOptions()` is hoisted out of `setup()`, so write `PreviewProps` inline with literals (imported values work too).

## Default Layout Structure

### Body

```vue
<Body class="font-sans py-10 bg-gray-100">
  <!-- email content -->
</Body>
```

### Container

White background, centered, left-aligned content:

```vue
<Container class="mx-auto bg-white p-6 rounded">
  <!-- email content -->
</Container>
```

### Footer

Include physical address, unsubscribe link, current year:

```vue
<Section class="text-center text-gray-500 text-sm">
  <Text class="m-0">123 Main St, City, State 12345</Text>
  <Text class="m-0">&copy; {{ new Date().getFullYear() }} Company Name</Text>
  <Link :href="unsubscribeUrl">Unsubscribe</Link>
</Section>
```

## Typography

### Titles

Bold, larger font, larger margins:

```vue
<Heading class="text-2xl font-bold text-gray-900 mb-4">Welcome to Acme</Heading>
```

### Paragraphs

Regular weight, smaller font, smaller margins:

```vue
<Text class="text-base text-gray-700 mb-3">Thanks for signing up!</Text>
```

### Hierarchy

Use consistent spacing that respects content hierarchy. Larger margins for headings, smaller for body text.

## Images

- Only include if user requests
- Content images: use responsive sizing (`w-full`, `h-auto`)
- Small icons (24-48px): fixed dimensions are acceptable
- Never distort user-provided images
- Never create SVG images
- Always use absolute URLs
- Set descriptive `alt` text on meaningful images; pass an explicit `alt=""` on decorative images so screen readers skip them — never omit the attribute

```vue
<!-- Meaningful image — describe purpose and details -->
<Img
  src="https://example.com/hero.png"
  alt="A team of engineers reviewing code on a laptop"
  class="w-full h-auto"
/>

<!-- Decorative image — always pass an empty alt string so screen readers skip it -->
<Img
  src="https://example.com/divider.png"
  alt=""
  class="w-full"
/>
```

## Buttons

Always use `box-border` to prevent padding overflow:

```vue
<Button
  href="https://example.com"
  class="bg-blue-600 text-white px-5 py-3 rounded box-border block text-center no-underline"
>
  Click Here
</Button>
```

## Layout

### Mobile-First

Always design for mobile by default:

- Use stacked layouts that work on all screen sizes
- Max-width around 600px for main container
- Remove default spacing/margins/padding between list items

### Multi-Column

Use `Row` and `Column` components instead of flexbox/grid:

```vue
<Row>
  <Column class="w-1/2">Left content</Column>
  <Column class="w-1/2">Right content</Column>
</Row>
```

## Dark Mode

When requested, use dark backgrounds:

- Container: black (`#000`)
- Background: dark gray (`#151516`)

```vue
<Body class="bg-[#151516]">
  <Container class="bg-black text-white">
    <!-- email content -->
  </Container>
</Body>
```

## Colors and Brand Consistency

### Gathering Brand Colors

Before creating emails, collect these colors from the user:

- **Primary**: Main brand color for buttons, links, key accents
- **Secondary**: Supporting color for borders, backgrounds, less prominent elements
- **Text**: Main body text color (suggest `#1a1a1a` for light backgrounds)
- **Text muted**: Secondary text like captions, footers (suggest `#6b7280`)
- **Background**: Email body background (suggest `#f4f4f5`)
- **Surface**: Container/card background (typically `#ffffff`)

### Tailwind Configuration File

Create a centralized Tailwind config file that all email templates import. Using `satisfies TailwindConfig` provides intellisense support for all configuration options:

```ts
// emails/tailwind.config.ts
import { pixelBasedPreset, type TailwindConfig } from '@vuemaildev/vuemail';

export default {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#007bff',
          secondary: '#6c757d',
        },
      },
    },
  },
} satisfies TailwindConfig;

// For non-Tailwind brand assets (optional)
export const brandAssets = {
  logo: {
    src: 'https://example.com/logo.png',
    alt: 'Company Name',
    width: 120,
  },
};
```

### Using Tailwind Config

Import the shared config in every email template:

```vue
<script setup lang="ts">
import { Body, Button, Container, Img, Tailwind } from '@vuemaildev/vuemail';
import tailwindConfig, { brandAssets } from './tailwind.config';
</script>

<template>
  <Tailwind :config="tailwindConfig">
    <Body class="bg-gray-100 font-sans">
      <Container class="bg-white p-6">
        <Img
          :src="brandAssets.logo.src"
          :alt="brandAssets.logo.alt"
          :width="brandAssets.logo.width"
        />
        <Button
          href="https://example.com"
          class="bg-brand-primary text-white px-5 py-3 rounded box-border"
        >
          Action
        </Button>
      </Container>
    </Body>
  </Tailwind>
</template>
```

With Tailwind CSS 4, the same tokens can also go in the `theme` prop, as CSS variables: `@theme { --color-brand-primary: #007bff; }`.

### Maintaining Consistency

- **Always use the brand config** - Never hardcode colors in individual templates
- **Update config, not templates** - When colors change, update `tailwind.config.ts` only
- **Use semantic names** - `bg-brand-primary` not `bg-[#007bff]`
- **Ensure contrast** - Test that text is readable against backgrounds (WCAG AA: 4.5:1 ratio)

## Asset Locations

Direct users to place brand assets in appropriate locations:

- **Logo and images**: Host on a CDN or public URL. For local development, place in `emails/static/`.
- **Custom fonts**: Use the `Font` component with a web font URL (Google Fonts, Adobe Fonts, or self-hosted).

**Example prompt for gathering brand info:**
> "Before I create your email template, I need some brand information to ensure consistency. Could you provide:
> 1. Your primary brand color (hex code, e.g., #007bff)
> 2. Your logo URL (must be a publicly accessible PNG or JPEG)
> 3. Any secondary colors you'd like to use
> 4. Style preference (modern/minimal or classic/traditional)"

## Best Practices

1. **Make templates unique** - Not generic, tailored to user's request
2. **Test across clients** - Gmail, Outlook, Apple Mail, Yahoo Mail
3. **Keep file size under 102KB** - Gmail clips larger emails
4. **Use keywords strategically** - Increase engagement in email body
5. **Inline styles as fallback** - Some clients strip `<style>` tags
