import type { Editor, JSONContent } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Body, Head, Html, Preview } from '@vuemaildev/vuemail';
import {
  type CSSProperties,
  h,
  type MaybeRefOrGetter,
  type ShallowRef,
  shallowRef,
  toValue,
  watch,
} from 'vue';
import type { SerializerPlugin } from '../../core/serializer/serializer-plugin';
import { getGlobalContent } from '../../extensions/global-content';
import { DARK_MODE_CSS } from '../../utils/dark-mode';
import {
  injectGlobalPlainCss,
  injectThemeCss,
  mergeCssJs,
  transformToCssJs,
} from './css-transforms';
import {
  inferThemeFromPanelStyles,
  normalizeThemePanelStyles,
} from './normalization';
import { isThemeConfig, themeStylesToPanelOverrides } from './theme-config';
import {
  DEFAULT_INBOX_FONT_SIZE_PX,
  EDITOR_THEMES,
  RESET_THEMES,
} from './themes';
import type {
  CssJs,
  EditorTheme,
  EditorThemeInput,
  KnownThemeComponents,
  PanelGroup,
} from './types';

/**
 * Maps a document node (type + attrs) to the theme component key used for style lookup.
 * Centralizes all node-type → theme-component knowledge.
 */
export function getThemeComponentKey(
  nodeType: string,
  depth: number,
  attrs: Record<string, unknown> = {},
): KnownThemeComponents | null {
  switch (nodeType) {
    case 'paragraph':
      if (depth > 0) {
        return 'listParagraph';
      }
      return 'paragraph';
    case 'heading': {
      const level = attrs.level as number | undefined;
      return `h${level ?? 1}` as KnownThemeComponents;
    }
    case 'blockquote':
      return 'blockquote';
    case 'button':
      return 'button';
    case 'container':
      return 'container';
    case 'section':
      return 'section';
    case 'footer':
      return 'footer';
    case 'image':
      return 'image';
    case 'youtube':
    case 'twitter':
      return 'image';
    case 'orderedList':
    case 'bulletList':
      if (depth > 0) {
        return 'nestedList';
      }
      return 'list';
    case 'listItem':
      return 'listItem';
    case 'codeBlock':
      return 'codeBlock';
    case 'code':
      return 'inlineCode';
    case 'link':
      return 'link';
    case 'horizontalRule':
      return 'hr';
    default:
      return null;
  }
}

/**
 * Returns merged theme styles (reset + panel styles) for the given editor.
 * Use when you have editor access and need the full CssJs map.
 */
export function getMergedCssJs(
  theme: EditorTheme,
  panelStyles: PanelGroup[] | undefined,
): CssJs {
  const panels: PanelGroup[] =
    normalizeThemePanelStyles(theme, panelStyles) ?? EDITOR_THEMES[theme];
  const parsed = transformToCssJs(panels, DEFAULT_INBOX_FONT_SIZE_PX);
  const merged = mergeCssJs(RESET_THEMES[theme], parsed);

  return merged;
}

/**
 * Node types and theme component keys that should receive the universal
 * `reset` CSS (e.g. `margin: 0; padding: 0`) layered underneath their own
 * theme styles. Shared between `getResolvedNodeStyles` (email serializer)
 * and `injectThemeCss` (editor preview) so both surfaces stay in sync.
 *
 * Includes both raw tiptap node names (e.g. `tableCell`) and theme
 * component keys (e.g. `list`) because the serializer matches against both.
 *
 * `bulletList` and `orderedList` are intentionally omitted: their elements
 * already carry the shared `node-list` class, so the `list` reset rule
 * covers them without forcing the dedicated `.node-bulletList` /
 * `.node-orderedList` rules to redundantly emit `margin: 0; padding: 0`.
 */
export const RESET_NODE_TYPES = new Set<string>([
  'body',
  'button',
  'columns',
  'div',
  'h1',
  'h2',
  'h3',
  'list',
  'listItem',
  'listParagraph',
  'nestedList',
  'table',
  'paragraph',
  'tableCell',
  'tableHeader',
  'tableRow',
  'youtube',
]);

/**
 * Returns resolved CSSProperties for a node when you already have merged CssJs
 * (e.g. in the serializer where there is no editor). Centralizes which theme keys
 * apply to which node type.
 */
export function getResolvedNodeStyles(
  node: JSONContent,
  depth: number,
  mergedCssJs: CssJs,
): CSSProperties {
  const key = getThemeComponentKey(node.type ?? '', depth, node.attrs ?? {});
  if (!key) {
    if (RESET_NODE_TYPES.has(node.type ?? '')) {
      return mergedCssJs.reset ?? {};
    }
    return {};
  }
  const component = mergedCssJs[key] ?? {};
  const shouldReset =
    RESET_NODE_TYPES.has(key) || RESET_NODE_TYPES.has(node.type ?? '');
  if (shouldReset) {
    const reset = mergedCssJs.reset ?? {};
    return { ...reset, ...component };
  }
  return { ...component };
}

export function stylesToCss(
  styles: PanelGroup[],
  theme: EditorTheme,
): Record<KnownThemeComponents, CSSProperties> {
  const parsed = transformToCssJs(
    normalizeThemePanelStyles(theme, styles) ?? EDITOR_THEMES[theme],
    DEFAULT_INBOX_FONT_SIZE_PX,
  );
  return mergeCssJs(RESET_THEMES[theme], parsed);
}

function resolveThemeConfig(config: EditorThemeInput): {
  baseTheme: EditorTheme;
  panels: PanelGroup[] | undefined;
} {
  if (!isThemeConfig(config)) {
    return { baseTheme: config, panels: undefined };
  }
  const baseTheme: EditorTheme = config.extends ?? 'minimal';
  const basePanels = EDITOR_THEMES[baseTheme];
  const panels = themeStylesToPanelOverrides(config.styles, basePanels);
  return { baseTheme, panels };
}

export function getEmailTheming(editor: Editor) {
  const theme = getEmailTheme(editor);
  const normalizedStyles =
    normalizeThemePanelStyles(theme, getEmailStyles(editor)) ??
    EDITOR_THEMES[theme];

  return {
    styles: normalizedStyles,
    theme,
    css: getEmailCss(editor),
  };
}

function isDeepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) {
    return true;
  }
  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null ||
    Array.isArray(a) !== Array.isArray(b)
  ) {
    return false;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  return aKeys.every(
    (key) =>
      Object.hasOwn(b, key) &&
      isDeepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      ),
  );
}

/**
 * The theming of the editor's document, kept up to date as the document
 * changes, like `useEditorState` would do with `@tiptap/react`. It's `null`
 * while there's no editor.
 *
 * Must be called inside `setup()`, or inside an effect scope.
 */
export function useEmailTheming(
  editor: MaybeRefOrGetter<Editor | null | undefined>,
): Readonly<ShallowRef<ReturnType<typeof getEmailTheming> | null>> {
  const theming = shallowRef<ReturnType<typeof getEmailTheming> | null>(null);

  watch(
    () => toValue(editor),
    (currentEditor, _previousEditor, onCleanup) => {
      if (!currentEditor) {
        theming.value = null;
        return;
      }

      const sync = () => {
        const next = getEmailTheming(currentEditor);
        // Like `useEditorState`, only notify when what's selected changed,
        // not on every transaction.
        if (!isDeepEqual(next, theming.value)) {
          theming.value = next;
        }
      };

      sync();
      currentEditor.on('transaction', sync);
      onCleanup(() => {
        currentEditor.off('transaction', sync);
      });
    },
    { immediate: true },
  );

  return theming;
}

function getEmailStyles(editor: Editor) {
  return getGlobalContent('styles', editor) as PanelGroup[] | null;
}

/**
 * Sets the global panel styles on the editor document.
 * Persists into the `GlobalContent` node under the `'styles'` key.
 */
export function setGlobalStyles(editor: Editor, styles: PanelGroup[]): boolean {
  return editor.commands.setGlobalContent('styles', styles);
}

/**
 * Sets the current email theme on the editor document.
 * Persists into the `GlobalContent` node under the `'theme'` key.
 */
export function setCurrentTheme(editor: Editor, theme: EditorTheme): boolean {
  return editor.commands.setGlobalContent('theme', theme);
}

/**
 * Sets the global CSS string injected into the email `<head>`.
 * Persists into the `GlobalContent` node under the `'css'` key.
 */
export function setGlobalCssInjected(editor: Editor, css: string): boolean {
  return editor.commands.setGlobalContent('css', css);
}

function getEmailTheme(editor: Editor): EditorTheme {
  const extensionOptions = (
    editor.extensionManager.extensions.find(
      (extension) => extension.name === 'theming',
    ) as { options?: { theme?: EditorThemeInput } }
  )?.options?.theme;

  if (isThemeConfig(extensionOptions)) {
    return extensionOptions.extends ?? 'minimal';
  }

  if (extensionOptions === 'basic' || extensionOptions === 'minimal') {
    return extensionOptions;
  }

  const globalTheme = getGlobalContent('theme', editor) as EditorTheme | null;
  if (globalTheme === 'basic' || globalTheme === 'minimal') {
    return globalTheme;
  }

  const inferredTheme = inferThemeFromPanelStyles(getEmailStyles(editor));
  if (inferredTheme) {
    return inferredTheme;
  }

  return 'basic';
}

function getEmailCss(editor: Editor) {
  return getGlobalContent('css', editor) as string | null;
}

/**
 * Keeps CSS from closing the `<style>` it's rendered in, the way React does
 * for the text of `<style>` elements.
 */
function escapeStyleText(css: string): string {
  return css.replace(
    /(<\/|<)(s)(tyle)/gi,
    (_match, prefix: string, s: string, suffix: string) =>
      `${prefix}${s === 's' ? '\\73 ' : '\\53 '}${suffix}`,
  );
}

export const EmailTheming = Extension.create<{
  theme?: EditorThemeInput;
  serializerPlugin: SerializerPlugin;
}>({
  name: 'theming',

  addOptions() {
    return {
      theme: undefined as EditorThemeInput | undefined,
      serializerPlugin: {
        getNodeStyles(node, depth, editor): CSSProperties {
          const theming = getEmailTheming(editor);

          return getResolvedNodeStyles(
            node,
            depth,
            getMergedCssJs(theming.theme, theming.styles),
          );
        },
        BaseTemplate({ previewText, children, editor, previewMode = false }) {
          const { css: globalCss, styles, theme } = getEmailTheming(editor);
          const mergedStyles = getMergedCssJs(theme, styles);

          return h(Html, null, () => [
            h(Head, null, () => [
              h('meta', { content: 'width=device-width', name: 'viewport' }),
              h('meta', {
                content: 'IE=edge',
                'http-equiv': 'X-UA-Compatible',
              }),
              h('meta', { name: 'x-apple-disable-message-reformatting' }),
              h('meta', {
                content: 'telephone=no,address=no,email=no,date=no,url=no',
                name: 'format-detection',
              }),
              previewMode ? null : h('style', { innerHTML: DARK_MODE_CSS }),
              globalCss
                ? h('style', { innerHTML: escapeStyleText(globalCss) })
                : null,
            ]),
            previewText && previewText !== ''
              ? h(Preview, null, () => previewText)
              : null,
            h(Body, { style: mergedStyles.body }, () => children),
          ]);
        },
      } satisfies SerializerPlugin,
    };
  },

  addProseMirrorPlugins() {
    const { editor } = this;
    const scopeId = `tiptap-theme-${Math.random().toString(36).slice(2, 10)}`;
    const scopeAttribute = 'data-editor-theme-scope';
    const scopeSelector = `.tiptap.ProseMirror[${scopeAttribute}="${scopeId}"]`;
    const themeStyleId = `${scopeId}-theme`;
    const globalStyleId = `${scopeId}-global`;

    return [
      new Plugin({
        key: new PluginKey('themingStyleInjector'),
        view(view) {
          let prevStyles: PanelGroup[] | null = null;
          let prevTheme: EditorTheme | null = null;
          let prevCss: string | null = null;
          let seededFromConfig = false;

          view.dom.setAttribute(scopeAttribute, scopeId);

          const sync = () => {
            if (!seededFromConfig) {
              seededFromConfig = true;
              const extensionTheme = (
                editor.extensionManager.extensions.find(
                  (ext) => ext.name === 'theming',
                ) as { options?: { theme?: EditorThemeInput } }
              )?.options?.theme;

              if (isThemeConfig(extensionTheme)) {
                const { baseTheme, panels } =
                  resolveThemeConfig(extensionTheme);
                if (panels && !getGlobalContent('styles', editor)) {
                  editor.commands.setGlobalContent('styles', panels);
                }
                if (!getGlobalContent('theme', editor)) {
                  editor.commands.setGlobalContent('theme', baseTheme);
                }
              }
            }

            const theme = getEmailTheme(editor);
            const styles = getEmailStyles(editor);
            const resolvedStyles = styles ?? EDITOR_THEMES[theme];
            const css = getEmailCss(editor);

            if (styles !== prevStyles || theme !== prevTheme) {
              prevStyles = styles as PanelGroup[] | null;
              prevTheme = theme;
              const mergedCssJs = getMergedCssJs(theme, resolvedStyles);
              injectThemeCss(mergedCssJs, {
                scopeSelector,
                styleId: themeStyleId,
              });
            }

            if (css !== prevCss) {
              prevCss = css;
              injectGlobalPlainCss(css, {
                scopeSelector,
                styleId: globalStyleId,
              });
            }
          };

          sync();

          return {
            update: sync,
            destroy() {
              document.getElementById(themeStyleId)?.remove();
              document.getElementById(globalStyleId)?.remove();
              view.dom.removeAttribute(scopeAttribute);
            },
          };
        },
      }),
    ];
  },
});
