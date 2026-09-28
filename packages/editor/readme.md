# @vuemaildev/editor

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

- `@vuemaildev/editor` — Main editor component and top-level API
- `@vuemaildev/editor/core` — Serializer, types, and event bus
- `@vuemaildev/editor/extensions` — Tiptap extensions for all supported email elements
- `@vuemaildev/editor/ui` — UI components (bubble menus, slash command, inspector)
- `@vuemaildev/editor/plugins` — Editor plugins (email theming, image upload)
- `@vuemaildev/editor/utils` — Shared utilities

And its styles:

- `@vuemaildev/editor/themes/default.css` — Default theme, with the styles of every UI component
- `@vuemaildev/editor/styles/bubble-menu.css`, `@vuemaildev/editor/styles/slash-command.css`, `@vuemaildev/editor/styles/inspector.css` — Styles of each UI component

## Installation

```bash
npm install @vuemaildev/editor
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
