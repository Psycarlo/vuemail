<script lang="ts">
interface NodeLayout {
  sections: Array<{
    type:
      | 'attributes'
      | 'size'
      | 'link'
      | 'typography'
      | 'padding'
      | 'columnSpacing'
      | 'background'
      | 'border';
  }>;
}

function getDefaultLayout(nodeType: string): NodeLayout {
  switch (nodeType) {
    case 'image':
      return {
        sections: [
          { type: 'attributes' },
          { type: 'size' },
          { type: 'link' },
          { type: 'padding' },
          { type: 'border' },
        ],
      };
    case 'button':
      return {
        sections: [
          { type: 'link' },
          { type: 'typography' },
          { type: 'size' },
          { type: 'padding' },
          { type: 'border' },
          { type: 'background' },
        ],
      };
    case 'section':
    case 'div':
      return {
        sections: [
          { type: 'background' },
          { type: 'padding' },
          { type: 'border' },
        ],
      };
    case 'codeBlock':
      return {
        sections: [
          { type: 'attributes' },
          { type: 'padding' },
          { type: 'border' },
        ],
      };
    case 'footer':
      return {
        sections: [
          { type: 'typography' },
          { type: 'padding' },
          { type: 'background' },
        ],
      };
    case 'twoColumns':
    case 'threeColumns':
    case 'fourColumns':
      return {
        sections: [
          { type: 'columnSpacing' },
          { type: 'typography' },
          { type: 'padding' },
          { type: 'background' },
          { type: 'border' },
        ],
      };
    default:
      return {
        sections: [
          { type: 'typography' },
          { type: 'padding' },
          { type: 'background' },
          { type: 'border' },
        ],
      };
  }
}
</script>

<script setup lang="ts">
import type { Attrs } from '@tiptap/pm/model';
import { computed, shallowRef, watch } from 'vue';
import { useCurrentEditor } from '../../email-editor/use-current-editor';
import {
  stylesToCss,
  useEmailTheming,
} from '../../plugins/email-theming/extension';
import { SUPPORTED_CSS_PROPERTIES } from '../../plugins/email-theming/themes';
import type { KnownCssProperties } from '../../plugins/email-theming/types';
import { inlineCssToJs } from '../../utils/styles';
import { useDocumentColors } from './hooks/use-document-colors';
import { useInspector } from './root';
import AttributesSection from './sections/attributes.vue';
import BackgroundSection from './sections/background.vue';
import BorderSection from './sections/border.vue';
import ColumnSpacingSection from './sections/column-spacing.vue';
import PaddingSection from './sections/padding.vue';
import SizeSection from './sections/size.vue';
import TypographySection from './sections/typography.vue';
import { resolveThemeDefaults } from './utils/resolve-theme-defaults';
import {
  customUpdateAttributes,
  customUpdateStyles,
} from './utils/style-updates';

export interface InspectorNodeContext {
  nodeType: string;
  nodePos: { pos: number; inside: number };
  getStyle: (prop: KnownCssProperties) => string | number | undefined;
  setStyle: (prop: KnownCssProperties, value: string | number) => void;
  batchSetStyle: (
    changes: Array<{ prop: KnownCssProperties; value: string | number }>,
  ) => void;
  getAttr: (name: string) => unknown;
  setAttr: (name: string, value: unknown) => void;
  themeDefaults: Record<string, string | number | undefined>;
  presetColors: string[];
}

export interface InspectorNodeSlots {
  /** Replaces the default node sections, receiving the node context. */
  default?: (context: InspectorNodeContext) => unknown;
}

/** `<Inspector.Node>` has no props: its default slot gets the context. */
export type InspectorNodeProps = Record<never, never>;

defineOptions({ name: 'InspectorNode' });

defineSlots<InspectorNodeSlots>();

const { editor } = useCurrentEditor();
const theming = useEmailTheming(editor);
const { target } = useInspector();
const documentColors = useDocumentColors(editor);

const localAttr = shallowRef<Attrs | null>(null);

const focusedNode = computed(() =>
  typeof target.value === 'object' && target.value.nodeType !== 'body'
    ? target.value
    : null,
);

watch(
  focusedNode,
  (node) => {
    if (node) {
      localAttr.value = node.nodeAttrs;
    }
  },
  { immediate: true },
);

const setLocalAttr = (value: Attrs) => {
  localAttr.value = value;
};

const context = computed<InspectorNodeContext | null>(() => {
  const currentEditor = editor.value;
  const node = focusedNode.value;

  if (!currentEditor || !theming.value || !node) {
    return null;
  }

  const attrs = localAttr.value ?? node.nodeAttrs;
  const inlineStyles = inlineCssToJs(attrs.style || '');

  const css = stylesToCss(theming.value.styles, theming.value.theme);
  const themeDefaults = resolveThemeDefaults(
    node.nodeType,
    attrs as Record<string, unknown>,
    css,
  );

  const mergedStyles: Record<string, string | number | undefined> = {
    ...themeDefaults,
    ...inlineStyles,
  };

  const getStyle = (prop: KnownCssProperties) => {
    const value = mergedStyles[prop];
    // Strip the trailing CSS unit only for numeric properties so that
    // numeric inputs receive a parseable number. Non-numeric properties
    // (colors, gradients, etc.) are returned verbatim — stripping `%`/`px`
    // globally would corrupt values like `hsl(200, 50%, 40%)`.
    const isNumericProperty = Boolean(SUPPORTED_CSS_PROPERTIES[prop]?.unit);
    if (isNumericProperty && typeof value === 'string') {
      return value.replace(/(px|%)$/, '');
    }
    return value;
  };

  const setStyle = (prop: KnownCssProperties, value: string | number) => {
    customUpdateStyles(
      {
        editor: currentEditor,
        nodePos: node.nodePos,
        prop,
        newValue: value,
      },
      setLocalAttr,
    );
  };

  const batchSetStyle = (
    changes: Array<{ prop: KnownCssProperties; value: string | number }>,
  ) => {
    customUpdateStyles(
      {
        editor: currentEditor,
        nodePos: node.nodePos,
        changes: changes.map((c) => [c.prop, c.value]),
      },
      setLocalAttr,
    );
  };

  const getAttr = (name: string) => attrs[name];

  const setAttr = (name: string, value: unknown) => {
    customUpdateAttributes(
      {
        editor: currentEditor,
        nodePos: node.nodePos,
        prop: name,
        newValue: value as string | number,
      },
      setLocalAttr,
    );
  };

  return {
    nodeType: node.nodeType,
    nodePos: node.nodePos,
    getStyle,
    setStyle,
    batchSetStyle,
    getAttr,
    setAttr,
    themeDefaults,
    presetColors: documentColors.value,
  };
});

const layout = computed(() =>
  context.value ? getDefaultLayout(context.value.nodeType) : null,
);
</script>

<template>
  <template v-if="context">
    <slot v-if="$slots.default" v-bind="context" />
    <template v-else>
      <template v-for="section in layout?.sections ?? []" :key="section.type">
        <AttributesSection
          v-if="section.type === 'attributes'"
          v-bind="context"
        />
        <SizeSection v-else-if="section.type === 'size'" v-bind="context" />
        <TypographySection
          v-else-if="section.type === 'typography'"
          v-bind="context"
        />
        <PaddingSection
          v-else-if="section.type === 'padding'"
          v-bind="context"
        />
        <ColumnSpacingSection
          v-else-if="section.type === 'columnSpacing'"
          v-bind="context"
        />
        <BackgroundSection
          v-else-if="section.type === 'background'"
          v-bind="context"
        />
        <BorderSection v-else-if="section.type === 'border'" v-bind="context" />
      </template>
    </template>
  </template>
</template>
