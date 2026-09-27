<script setup lang="ts">
import { computed } from 'vue';
import { useCurrentEditor } from '../../email-editor/use-current-editor';
import {
  stylesToCss,
  useEmailTheming,
} from '../../plugins/email-theming/extension';
import type { KnownCssProperties } from '../../plugins/email-theming/types';
import { inlineCssToJs } from '../../utils/styles';
import { useEditorState } from '../use-editor-state';
import { useDocumentColors } from './hooks/use-document-colors';
import {
  getLinkColor,
  updateLinkColor,
  useLinkMark,
} from './hooks/use-link-mark';
import { useInspector } from './root';
import LinkSection from './sections/link.vue';
import TypographySection from './sections/typography.vue';
import { resolveThemeDefaults } from './utils/resolve-theme-defaults';
import {
  getParentBlockInfo,
  updateParentBlockStyle,
} from './utils/text-block-utils';

export interface InspectorTextContext {
  marks: Record<string, boolean>;
  toggleMark: (mark: string) => void;
  alignment: string;
  setAlignment: (value: string) => void;
  linkHref: string;
  linkColor: string;
  setLinkColor: (color: string) => void;
  isLinkActive: boolean;
  getStyle: (prop: KnownCssProperties) => string | number | undefined;
  setStyle: (prop: KnownCssProperties, value: string | number) => void;
  presetColors: string[];
}

export interface InspectorTextSlots {
  /** Replaces the default text sections, receiving the text context. */
  default?: (context: InspectorTextContext) => unknown;
}

/** `<Inspector.Text>` has no props: its default slot gets the context. */
export type InspectorTextProps = Record<never, never>;

defineOptions({ name: 'InspectorText' });

defineSlots<InspectorTextSlots>();

const MARK_NAMES = ['bold', 'italic', 'underline', 'strike', 'code'] as const;

const { editor } = useCurrentEditor();
const theming = useEmailTheming(editor);
const { target } = useInspector();
const documentColors = useDocumentColors(editor);
const linkMark = useLinkMark(editor);

const activeMarks = useEditorState({
  editor,
  selector: ({ editor: ed }) => {
    if (!ed) return {} as Record<string, boolean>;
    const result: Record<string, boolean> = {};
    for (const mark of MARK_NAMES) {
      result[mark] = ed.isActive(mark);
    }
    return result;
  },
});

const parentBlock = useEditorState({
  editor,
  selector: ({ editor: ed }) => getParentBlockInfo(ed),
});

const context = computed<InspectorTextContext | null>(() => {
  const currentEditor = editor.value;

  if (!currentEditor || !theming.value || target.value !== 'text') {
    return null;
  }

  const css = stylesToCss(theming.value.styles, theming.value.theme);
  const parentAttrs = parentBlock.value?.attrs ?? {};
  const parentNodeType = parentBlock.value?.nodeType ?? 'paragraph';
  const parentPos = parentBlock.value?.pos ?? 0;

  const themeDefaults = resolveThemeDefaults(
    parentNodeType,
    parentAttrs as Record<string, unknown>,
    css,
  );

  const parentStyle = inlineCssToJs(String(parentAttrs.style || ''));
  const mergedStyles: Record<string, string | number | undefined> = {
    ...themeDefaults,
    ...parentStyle,
  };

  const themeLinkColor = css.link?.color ? String(css.link.color) : undefined;
  const link = linkMark.value;

  return {
    marks: activeMarks.value,
    toggleMark: (mark: string) => {
      currentEditor.chain().focus().toggleMark(mark).run();
    },
    alignment: parentBlock.value?.alignment ?? 'left',
    setAlignment: (value: string) => {
      if (!parentBlock.value) return;
      currentEditor
        .chain()
        .focus()
        .updateAttributes(parentNodeType, { alignment: value })
        .run();
    },
    linkHref: link.href,
    linkColor: getLinkColor(link.style, themeLinkColor),
    setLinkColor: (color: string) => {
      updateLinkColor(currentEditor, link.style, color);
    },
    isLinkActive: link.isActive,
    getStyle: (prop: KnownCssProperties) => mergedStyles[prop],
    setStyle: (prop: KnownCssProperties, value: string | number) => {
      updateParentBlockStyle(currentEditor, parentPos, prop, value);
    },
    presetColors: documentColors.value,
  };
});
</script>

<template>
  <template v-if="context">
    <slot v-if="$slots.default" v-bind="context" />
    <template v-else>
      <TypographySection v-bind="context" />
      <LinkSection v-if="context.isLinkActive" v-bind="context" />
    </template>
  </template>
</template>
