<script lang="ts">
import {
  EDITOR_THEMES,
  SUPPORTED_CSS_PROPERTIES,
} from '../../plugins/email-theming/themes';
import type {
  KnownCssProperties,
  KnownThemeComponents,
  PanelGroup,
} from '../../plugins/email-theming/types';

function ensureAllProperties(
  currentStyles: PanelGroup[],
  themeDefaults: PanelGroup[],
): PanelGroup[] {
  return currentStyles.map((group) => {
    const defaultGroup = themeDefaults.find((g) =>
      group.id ? g.id === group.id : g.title === group.title,
    );

    if (!defaultGroup || defaultGroup.inputs.length === 0) {
      return group;
    }

    const existingProps = new Set(
      group.inputs.map((i) => `${i.classReference}:${i.prop}`),
    );

    const missingInputs = defaultGroup.inputs
      .filter(
        (defaultInput) =>
          !existingProps.has(
            `${defaultInput.classReference}:${defaultInput.prop}`,
          ),
      )
      .map((defaultInput) => {
        const propDef = SUPPORTED_CSS_PROPERTIES[defaultInput.prop];

        if (propDef && propDef.type === 'number') {
          return {
            ...defaultInput,
            value: '' as string | number,
            placeholder: String(propDef.defaultValue),
          };
        }

        return { ...defaultInput };
      });

    if (missingInputs.length === 0) {
      return group;
    }

    return {
      ...group,
      inputs: [...group.inputs, ...missingInputs],
    };
  });
}

function applyStyleChange(
  styles: PanelGroup[],
  themeName: 'basic' | 'minimal',
  {
    classReference,
    prop,
    newValue,
  }: {
    classReference?: string;
    prop: string;
    newValue: string | number;
  },
): PanelGroup[] {
  let found = false;

  const updatedStyles = styles.map((styleGroup) => {
    const matchingInput = styleGroup.inputs.find(
      (input) => input.classReference === classReference && input.prop === prop,
    );

    if (matchingInput) {
      found = true;
      return {
        ...styleGroup,
        inputs: styleGroup.inputs.map((input) => {
          if (input.classReference === classReference && input.prop === prop) {
            return { ...input, value: newValue };
          }
          return input;
        }),
      };
    }

    return styleGroup;
  });

  if (found) {
    return updatedStyles;
  }

  const propDef = SUPPORTED_CSS_PROPERTIES[prop as KnownCssProperties] ?? null;

  return updatedStyles.map((styleGroup) => {
    if (styleGroup.classReference !== classReference) {
      return styleGroup;
    }

    const themeDefaults = EDITOR_THEMES[themeName];
    const defaultGroup = themeDefaults.find((g) =>
      styleGroup.id ? g.id === styleGroup.id : g.title === styleGroup.title,
    );
    const defaultInput = defaultGroup?.inputs.find(
      (i) => i.prop === prop && i.classReference === classReference,
    );

    if (defaultInput) {
      return {
        ...styleGroup,
        inputs: [...styleGroup.inputs, { ...defaultInput, value: newValue }],
      };
    }

    if (propDef) {
      return {
        ...styleGroup,
        inputs: [
          ...styleGroup.inputs,
          {
            label: propDef.label,
            type: propDef.type,
            value: newValue,
            prop: prop as KnownCssProperties,
            classReference: classReference as KnownThemeComponents | undefined,
            unit: propDef.unit,
            options: propDef.options,
          },
        ],
      };
    }

    return styleGroup;
  });
}
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { useCurrentEditor } from '../../email-editor/use-current-editor';
import {
  setGlobalStyles,
  useEmailTheming,
} from '../../plugins/email-theming/extension';
import NumberInput from './components/number-input.vue';
import PropRow from './components/prop-row.vue';
import Section from './components/section.vue';
import { ColorInput, Label } from './primitives';
import { useInspector } from './root';

export type SetGlobalStyle = (
  classReference: KnownThemeComponents,
  property: KnownCssProperties,
  value: unknown,
) => void;

export type BatchSetGlobalStyle = (
  changes: Array<{
    classReference: KnownThemeComponents;
    property: KnownCssProperties;
    value: unknown;
  }>,
) => void;

export type FindStyleValue = (
  classReference: KnownThemeComponents,
  prop: KnownCssProperties,
) => string | number;

export interface InspectorDocumentContext {
  styles: PanelGroup[];
  setGlobalStyle: SetGlobalStyle;
  batchSetGlobalStyle: BatchSetGlobalStyle;
  findStyleValue: FindStyleValue;
}

export interface InspectorDocumentSlots {
  /** Replaces the default document sections, receiving the document context. */
  default?: (context: InspectorDocumentContext) => unknown;
}

/** `<Inspector.Document>` has no props: its default slot gets the context. */
export type InspectorDocumentProps = Record<never, never>;

defineOptions({ name: 'InspectorDocument' });

defineSlots<InspectorDocumentSlots>();

const { editor } = useCurrentEditor();
const theming = useEmailTheming(editor);
const { target } = useInspector();

const context = computed<InspectorDocumentContext | null>(() => {
  const currentEditor = editor.value;
  const currentTheming = theming.value;

  if (!currentEditor || !currentTheming) {
    return null;
  }

  const themeDefaults = EDITOR_THEMES[currentTheming.theme];

  const groups = ensureAllProperties(currentTheming.styles, themeDefaults);

  function setGlobalStyle(
    classReference: KnownThemeComponents,
    property: KnownCssProperties,
    value: unknown,
  ) {
    const newStyles = applyStyleChange(
      currentTheming!.styles,
      currentTheming!.theme,
      {
        classReference,
        prop: property,
        newValue: value as string | number,
      },
    );
    setGlobalStyles(currentEditor!, newStyles);
  }

  function batchSetGlobalStyle(
    changes: Array<{
      classReference: KnownThemeComponents;
      property: KnownCssProperties;
      value: unknown;
    }>,
  ) {
    let styles = currentTheming!.styles;
    for (const change of changes) {
      styles = applyStyleChange(styles, currentTheming!.theme, {
        classReference: change.classReference,
        prop: change.property,
        newValue: change.value as string | number,
      });
    }
    setGlobalStyles(currentEditor!, styles);
  }

  function findStyleValue(
    classReference: KnownThemeComponents,
    prop: KnownCssProperties,
  ): string | number {
    for (const group of groups) {
      const input = group.inputs.find(
        (i) => i.classReference === classReference && i.prop === prop,
      );
      if (input && input.value !== undefined) return input.value;
    }

    for (const group of themeDefaults) {
      const input = group.inputs.find(
        (i) => i.classReference === classReference && i.prop === prop,
      );
      if (input && input.value !== undefined) return input.value;
    }

    const propDef = SUPPORTED_CSS_PROPERTIES[prop];
    return propDef?.defaultValue ?? '';
  }

  if (typeof target.value !== 'object' || target.value.nodeType !== 'body') {
    return null;
  }

  return {
    styles: groups,
    setGlobalStyle,
    batchSetGlobalStyle,
    findStyleValue,
  };
});

const findStyle = (
  classReference: KnownThemeComponents,
  prop: KnownCssProperties,
) => context.value?.findStyleValue(classReference, prop) ?? '';

const setStyle =
  (classReference: KnownThemeComponents, prop: KnownCssProperties) =>
  (value: unknown) =>
    context.value?.setGlobalStyle(classReference, prop, value);
</script>

<template>
  <template v-if="context">
    <slot v-if="$slots.default" v-bind="context" />
    <template v-else>
      <Section title="Background">
        <PropRow>
          <Label>Color</Label>
          <ColorInput
            :value="String(findStyle('body', 'backgroundColor'))"
            :on-change="setStyle('body', 'backgroundColor')"
          />
        </PropRow>
        <PropRow>
          <Label>Padding</Label>
          <NumberInput
            :value="findStyle('body', 'padding')"
            :on-change="setStyle('body', 'padding')"
            unit="px"
          />
        </PropRow>
      </Section>

      <Section title="Container">
        <PropRow>
          <Label>Color</Label>
          <ColorInput
            :value="String(findStyle('container', 'backgroundColor'))"
            :on-change="setStyle('container', 'backgroundColor')"
          />
        </PropRow>
        <PropRow>
          <Label>Width</Label>
          <NumberInput
            :value="findStyle('container', 'width')"
            :on-change="setStyle('container', 'width')"
            unit="px"
          />
        </PropRow>
        <PropRow>
          <Label>Padding</Label>
          <NumberInput
            :value="findStyle('container', 'padding')"
            :on-change="setStyle('container', 'padding')"
            unit="px"
          />
        </PropRow>
        <PropRow>
          <Label>Rounded</Label>
          <NumberInput
            :value="findStyle('container', 'borderRadius')"
            :on-change="setStyle('container', 'borderRadius')"
            unit="px"
          />
        </PropRow>
      </Section>
    </template>
  </template>
</template>
