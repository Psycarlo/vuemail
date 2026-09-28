# Vuemail Editor Reference

A visual rich-text editor for building email templates, built on [TipTap](https://tiptap.dev/) and [ProseMirror](https://prosemirror.net/). Embed it in your Vue app to let users compose email-ready HTML without writing code.

## Table of Contents

- [Installation](#installation)
- [CSS Setup](#css-setup)
- [Architecture](#architecture)
- [EmailEditor Component](#emaileditor-component)
- [Minimal Setup (Extensions Only)](#minimal-setup-extensions-only)
- [Bubble Menus](#bubble-menus)
- [Slash Commands](#slash-commands)
- [Inspector](#inspector)
- [Email Theming](#email-theming)
- [Email Export](#email-export)
- [Custom Extensions](#custom-extensions)

## Installation

Install the editor:

```sh
npm install vuemail-editor
```

Requires **Vue 3.4+** and a bundler that supports [package exports](https://nodejs.org/api/packages.html#exports) (Vite, Nuxt, Webpack 5, etc.). The editor is created once its component mounts, so it only runs in the browser.

## CSS Setup

Import the bundled default theme for the quickest start:

```ts
import 'vuemail-editor/themes/default.css';
```

This includes the default color theme and built-in UI styles for bubble menus, slash commands, and the inspector.

To import only what you need:

```ts
import 'vuemail-editor/styles/bubble-menu.css';
import 'vuemail-editor/styles/slash-command.css';
import 'vuemail-editor/styles/inspector.css';
```

## Architecture

The editor is organized into six entry points:

| Import | Purpose |
|--------|---------|
| `vuemail-editor` | `EmailEditor`: the all-in-one component, and `EditorProvider` |
| `vuemail-editor/core` | `composeVueEmail` serialization, `EmailNode`, `EmailMark`, `useCurrentEditor`, event bus, types |
| `vuemail-editor/extensions` | `StarterKit` and the email-aware extensions |
| `vuemail-editor/ui` | `BubbleMenu`, `SlashCommand`, `Inspector` |
| `vuemail-editor/plugins` | `EmailTheming` plugin, image upload |
| `vuemail-editor/utils` | Selection and alignment helpers |

## EmailEditor Component

The `EmailEditor` component from `vuemail-editor` is a batteries-included component that bundles StarterKit, EmailTheming, BubbleMenus, and SlashCommands. Use it when you want the full experience with minimal setup.

```vue
<script setup lang="ts">
import { EmailEditor, type EmailEditorRef } from 'vuemail-editor';
import 'vuemail-editor/themes/default.css';
import { ref } from 'vue';

const editorRef = ref<EmailEditorRef | null>(null);

async function handleExport() {
  const { html, text } = await editorRef.value!.getEmail();
  console.log(html, text);
}

function handleReady(editor: EmailEditorRef) {
  console.log('Editor ready', editor.getJSON());
}

function handleUpdate() {
  console.log('Content changed');
}
</script>

<template>
  <div>
    <EmailEditor
      ref="editorRef"
      content="<p>Start typing...</p>"
      theme="basic"
      @ready="handleReady"
      @update="handleUpdate"
    />
    <button type="button" @click="handleExport">Export HTML</button>
  </div>
</template>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `Content` | — | Initial editor content (HTML string or TipTap JSON) |
| `theme` | `'basic' \| 'minimal'` or a theme config | `'basic'` | Built-in email theme |
| `editable` | `boolean` | `true` | Whether content is editable |
| `placeholder` | `string` | — | Placeholder text for empty editor |
| `bubble-menu` | `{ hideWhenActiveNodes?: string[], hideWhenActiveMarks?: string[] }` | — | Configure bubble menu visibility |
| `extensions` | `Extensions` | — | Override the default extensions entirely |
| `on-upload-image` | `(file: File) => Promise<{ url: string }>` | — | Handler for pasted/dropped images, resolving with their hosted URL |
| `class` | `string` | — | CSS class for the editor container |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `@ready` | `EmailEditorRef` | Emitted once the editor is initialized |
| `@update` | `EmailEditorRef` | Emitted on every content change |

The default slot renders next to the editor's content once the editor exists, which is where an [Inspector](#inspector) or your own UI goes.

### Template Ref (`EmailEditorRef`)

| Method | Returns | Description |
|--------|---------|-------------|
| `getEmail()` | `Promise<{ html: string; text: string }>` | Export email-ready HTML and plain text |
| `getEmailHTML()` | `Promise<string>` | Export only the HTML |
| `getEmailText()` | `Promise<string>` | Export only the plain text |
| `getJSON()` | `JSONContent` | Get editor content as TipTap JSON |
| `editor` | `Editor \| null` | Access the underlying TipTap editor instance |

## Minimal Setup (Extensions Only)

For more control, use `EditorProvider` from `vuemail-editor` with `StarterKit`. It creates the editor and provides it to the components in its default slot, like `EditorProvider` from `@tiptap/react`:

```vue
<script setup lang="ts">
import { EditorProvider } from 'vuemail-editor';
import { StarterKit } from 'vuemail-editor/extensions';

const extensions = [StarterKit];

const content = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Start typing or edit this text.' }],
    },
  ],
};
</script>

<template>
  <EditorProvider :extensions="extensions" :content="content" />
</template>
```

This gives you a content-editable area with all core extensions (paragraphs, headings, lists, tables, code blocks, columns, buttons, etc.) but no UI overlays.

`EditorProvider` also takes `editable`, `editor-props`, `editor-class` (classes for the content area), and `@create`/`@update` callbacks. Its default slot receives `{ editor }`.

## Bubble Menus

Floating formatting toolbars that appear on text selection. Add them to the default slot of `EditorProvider`.

```vue
<script setup lang="ts">
import { EditorProvider } from 'vuemail-editor';
import { StarterKit } from 'vuemail-editor/extensions';
import { BubbleMenu } from 'vuemail-editor/ui';
import 'vuemail-editor/themes/default.css';

const extensions = [StarterKit];

const content = '<p>Select this text to see the bubble menu.</p>';
</script>

<template>
  <EditorProvider :extensions="extensions" :content="content">
    <BubbleMenu />
  </EditorProvider>
</template>
```

### Available Bubble Menus

| Component | Appears when... | Controls |
|-----------|----------------|----------|
| `BubbleMenu` | Text is selected | Bold, italic, underline, strike, code, uppercase, alignment, node type, link |
| `BubbleMenu.LinkDefault` | Cursor is on a link | Edit URL, open link, unlink |
| `BubbleMenu.ButtonDefault` | Cursor is on a button | Edit button URL, unlink |
| `BubbleMenu.ImageDefault` | Cursor is on an image | Edit or remove the image's link |

Exclude specific items from the link menu:

```vue
<BubbleMenu.LinkDefault :exclude-items="['open-link']" />
```

Build a text menu with only the items you need out of the compound components:

```vue
<BubbleMenu>
  <BubbleMenu.ItemGroup>
    <BubbleMenu.Bold />
    <BubbleMenu.Italic />
    <BubbleMenu.Underline />
  </BubbleMenu.ItemGroup>
  <BubbleMenu.Separator />
  <BubbleMenu.LinkSelector />
</BubbleMenu>
```

When combining the text bubble menu with contextual menus for links, images, or buttons, use `hide-when-active-marks` on `BubbleMenu` to prevent it from appearing when a link is focused:

```vue
<BubbleMenu
  :hide-when-active-nodes="['image', 'button']"
  :hide-when-active-marks="['link']"
/>
<BubbleMenu.LinkDefault />
<BubbleMenu.ButtonDefault />
<BubbleMenu.ImageDefault />
```

## Slash Commands

Insert content blocks by typing `/` in the editor.

```vue
<script setup lang="ts">
import { EditorProvider } from 'vuemail-editor';
import { StarterKit } from 'vuemail-editor/extensions';
import { SlashCommand, defaultSlashCommands } from 'vuemail-editor/ui';
import 'vuemail-editor/themes/default.css';

const extensions = [StarterKit];
</script>

<template>
  <EditorProvider :extensions="extensions" content="<p></p>">
    <SlashCommand :items="defaultSlashCommands" />
  </EditorProvider>
</template>
```

### Default Commands

| Command | Category | Description |
|---------|----------|-------------|
| `TEXT` | Text | Plain text block |
| `H1`, `H2`, `H3` | Text | Headings |
| `BULLET_LIST` | Text | Unordered list |
| `NUMBERED_LIST` | Text | Ordered list |
| `QUOTE` | Text | Block quote |
| `CODE` | Text | Code snippet |
| `BUTTON` | Layout | Clickable button |
| `DIVIDER` | Layout | Horizontal separator |
| `SECTION` | Layout | Content section |
| `TWO_COLUMNS` | Layout | Two column layout |
| `THREE_COLUMNS` | Layout | Three column layout |
| `FOUR_COLUMNS` | Layout | Four column layout |

Cherry-pick individual commands:

```vue
<script setup lang="ts">
import { BUTTON, H1, H2, SlashCommand, TEXT } from 'vuemail-editor/ui';

const items = [TEXT, H1, H2, BUTTON];
</script>

<template>
  <SlashCommand :items="items" />
</template>
```

`SlashCommand` also takes `char` (default `/`), `allow`, and `filter-items`. To render the command list yourself, use its default slot, which receives `{ items, query, selectedIndex, onSelect }`.

## Inspector

A contextual sidebar for editing document-level styles, node properties, and text formatting. Requires the `EmailTheming` plugin.

```vue
<script setup lang="ts">
import { EditorProvider } from 'vuemail-editor';
import { StarterKit } from 'vuemail-editor/extensions';
import { EmailTheming } from 'vuemail-editor/plugins';
import { Inspector } from 'vuemail-editor/ui';
import 'vuemail-editor/themes/default.css';

const extensions = [StarterKit, EmailTheming];

const content = '<h1>Hello</h1><p>Click any element to inspect it.</p>';
</script>

<template>
  <div style="display: flex">
    <EditorProvider
      :extensions="extensions"
      :content="content"
      editor-class="editor-content"
    >
      <Inspector.Root style="width: 240px; border-left: 1px solid #e5e7eb; padding: 16px">
        <Inspector.Breadcrumb />
        <Inspector.Document />
        <Inspector.Node />
        <Inspector.Text />
      </Inspector.Root>
    </EditorProvider>
  </div>
</template>

<style>
.editor-content {
  flex: 1;
}
</style>
```

The inspector automatically switches between document, node, and text controls based on the current selection.

With `EmailEditor`, put `Inspector.Root` in its default slot instead: `EmailTheming` is part of its default extensions.

Its parts take scoped slots to customize them. For example, `Inspector.Breadcrumb` passes its `segments`:

```vue
<Inspector.Breadcrumb>
  <template #default="{ segments }">
    <button
      v-for="(segment, index) in segments"
      :key="index"
      type="button"
      @click="segment.focus()"
    >
      {{ segment.node.nodeType }}
    </button>
  </template>
</Inspector.Breadcrumb>
```

## Email Theming

Apply visual styles (typography, spacing, colors) to email output. Themes are resolved during `composeVueEmail` and inlined as `style` attributes.

```ts
import { StarterKit } from 'vuemail-editor/extensions';
import { EmailTheming } from 'vuemail-editor/plugins';

const extensions = [StarterKit, EmailTheming.configure({ theme: 'basic' })];
```

### Built-in Themes

| Theme | Description |
|-------|-------------|
| `'basic'` | Full styling: typography, spacing, borders, visual hierarchy. **Default.** |
| `'minimal'` | Essentially no styles — blank slate for custom themes. |

### Switching Themes Dynamically

With `EmailEditor`, change its `theme` prop, and it sets the editor up again. With `EditorProvider`, give it a `key`:

```vue
<script setup lang="ts">
import { EditorProvider } from 'vuemail-editor';
import { StarterKit } from 'vuemail-editor/extensions';
import { EmailTheming } from 'vuemail-editor/plugins';
import { computed, ref } from 'vue';

const theme = ref<'basic' | 'minimal'>('basic');
const extensions = computed(() => [
  StarterKit,
  EmailTheming.configure({ theme: theme.value }),
]);
</script>

<template>
  <!-- Re-key EditorProvider when theme changes -->
  <EditorProvider :key="theme" :extensions="extensions" content="<p>Hello</p>" />
</template>
```

## Email Export

Convert editor content to email-ready HTML and plain text.

### Via EmailEditor ref

```ts
const editorRef = ref<EmailEditorRef | null>(null);

const { html, text } = await editorRef.value!.getEmail();
```

### Via composeVueEmail (lower-level)

In a component rendered inside `EditorProvider` or `EmailEditor`:

```vue
<script setup lang="ts">
import { composeVueEmail, useCurrentEditor } from 'vuemail-editor/core';

const { editor } = useCurrentEditor();

async function handleExport() {
  if (!editor.value) return;
  const { html, text } = await composeVueEmail({
    editor: editor.value,
    preview: 'Inbox preview text', // optional
  });
  console.log(html, text);
}
</script>

<template>
  <button type="button" @click="handleExport">Export HTML</button>
</template>
```

The `preview` parameter is optional — when provided, it sets the inbox preview text in the exported HTML. Besides the formatted `html`, `composeVueEmail` returns `unformattedHtml`, which is smaller: use it to store or send the email.

The export pipeline:
1. Reads the editor's JSON document
2. Traverses each node and mark
3. Calls `renderToVueEmail()` on each `EmailNode` and `EmailMark`
4. Applies theme styles via `EmailTheming` plugin (if configured)
5. Wraps in a base template and renders it with Vuemail's `render` to HTML string + plain text

## Custom Extensions

Create custom email-compatible nodes using `EmailNode` (extends TipTap's `Node` with `renderToVueEmail()`, which returns VNodes built with `h()` and Vuemail components):

```ts
import { mergeAttributes } from '@tiptap/core';
import { EmailNode } from 'vuemail-editor/core';
import { StarterKit } from 'vuemail-editor/extensions';
import { h } from 'vue';
import { Section } from 'vuemail';

const Callout = EmailNode.create({
  name: 'callout',
  group: 'block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: 'div[data-type="callout"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'callout',
        style: 'padding: 12px 16px; background: #f4f4f5; border-left: 3px solid #1c1c1c;',
      }),
      0,
    ];
  },

  renderToVueEmail({ children, style }) {
    return h(
      Section,
      {
        style: {
          ...style,
          padding: '12px 16px',
          backgroundColor: '#f4f4f5',
          borderLeft: '3px solid #1c1c1c',
        },
      },
      () => children,
    );
  },
});

// Register it
const extensions = [StarterKit, Callout];
```

Mark custom `div` nodes with a `data-type` attribute: `StarterKit` parses every other `div` as its own generic node. Prefer Vuemail components in `renderToVueEmail`: plain elements rendered with `h()` don't add `px` to numbers in `style`.

For custom marks (inline formatting), use `EmailMark` from `vuemail-editor/core` — same pattern but for inline elements.
