# @vuemail/editor

A rich text editor for editing and building email templates with Vue, built on top of [Tiptap](https://tiptap.dev) and [Vuemail](https://vuemail.dev).

## Structure

```
packages/editor/src/
├── core/               # Editor core: serializer, event bus, types
├── extensions/         # Tiptap extensions for email elements (button, heading, columns, etc.)
├── plugins/            # Editor plugins (email theming, image upload)
├── ui/                 # UI components (bubble menus, slash command, inspector)
├── utils/              # Shared utilities
└── email-editor/       # Main editor component, EditorProvider, and the useCurrentEditor composable
```

## Entry Points

The package exposes multiple entry points for granular imports:

- `@vuemail/editor` — Main editor component and top-level API
- `@vuemail/editor/core` — Serializer, types, and event bus
- `@vuemail/editor/extensions` — Tiptap extensions for all supported email elements
- `@vuemail/editor/ui` — UI components (bubble menus, slash command, inspector)
- `@vuemail/editor/plugins` — Editor plugins (email theming, image upload)
- `@vuemail/editor/utils` — Shared utilities

And its styles:

- `@vuemail/editor/themes/default.css` — Default theme, with the styles of every UI component
- `@vuemail/editor/styles/bubble-menu.css`, `@vuemail/editor/styles/slash-command.css`, `@vuemail/editor/styles/inspector.css` — Styles of each UI component

## Installation

```bash
npm install @vuemail/editor
```

## Development

```bash
# Build the package
pnpm build

# Build the package on every change
pnpm build:watch

# Run type checking
pnpm typecheck

# Run all tests
pnpm test

# Run unit tests only
pnpm test:unit

# Run browser tests only (in Chromium: `pnpm exec playwright install chromium`)
pnpm test:browser

# Watch mode for tests
pnpm test:watch
```

## Documentation

For full usage guide and API reference, see the [Editor documentation](https://vuemail.dev/docs/editor/overview).

## License

MIT
