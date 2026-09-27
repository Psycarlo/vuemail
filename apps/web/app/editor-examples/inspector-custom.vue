<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3';
import { provideCurrentEditor } from '@vuemail/editor/core';
import { StarterKit } from '@vuemail/editor/extensions';
import { EmailTheming } from '@vuemail/editor/plugins';
import { Inspector } from '@vuemail/editor/ui';
import { type FunctionalComponent, h } from 'vue';
import ExampleShell from '~/components/editor/ExampleShell.vue';

const extensions = [StarterKit, EmailTheming];

const content = `
  <h1>Custom Inspector</h1>
  <p>This inspector is built entirely from scratch — no pre-built sections or primitives. Just scoped slot data and plain HTML inputs.</p>
  <a class="button" data-id="vuemail-button" href="https://vuemail.dev">Click me</a>
  <img src="https://placehold.co/600x200" alt="Placeholder" />
`;

const editor = useEditor({ extensions, content });
provideCurrentEditor(editor);

function normalizeHex(value: string): string {
  if (!value) return '#000000';
  const v = value.trim();
  const shortHex = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(v);
  if (shortHex) {
    return `#${shortHex[1]}${shortHex[1]}${shortHex[2]}${shortHex[2]}${shortHex[3]}${shortHex[3]}`;
  }
  if (/^#[0-9a-f]{6}$/i.test(v)) return v;
  return '#000000';
}

const inputValue = (event: Event) => (event.target as HTMLInputElement).value;

const Row: FunctionalComponent<{ label: string }> = ({ label }, { slots }) =>
  h(
    'div',
    { class: 'flex items-center justify-between gap-2 mt-1.5 first:mt-0' },
    [
      h('span', { class: 'text-(--re-text-muted) shrink-0' }, label),
      slots.default?.(),
    ],
  );

const ColorPicker: FunctionalComponent<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) =>
  h('span', { class: 'flex items-center gap-1' }, [
    h('input', {
      type: 'color',
      value: normalizeHex(value),
      class: 'w-5 h-5 border-0 p-0 cursor-pointer',
      onInput: (event: Event) => onChange(inputValue(event)),
    }),
    h('input', {
      type: 'text',
      value,
      class:
        'w-16 text-xs bg-transparent border border-(--re-border) rounded px-1 py-0.5',
      onInput: (event: Event) => onChange(inputValue(event)),
    }),
  ]);

const NumberField: FunctionalComponent<{
  value: string | number | undefined;
  onChange: (value: number | '') => void;
  unit?: string;
}> = ({ value, onChange, unit }) =>
  h('span', { class: 'flex items-center gap-1' }, [
    h('input', {
      type: 'number',
      value: value ?? '',
      class:
        'w-14 text-xs bg-transparent border border-(--re-border) rounded px-1 py-0.5',
      onInput: (event: Event) => {
        const raw = inputValue(event);
        onChange(raw === '' ? '' : Number.parseFloat(raw));
      },
    }),
    unit && h('span', { class: 'text-(--re-text-muted)' }, unit),
  ]);

const MarkButton: FunctionalComponent<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) =>
  h(
    'button',
    {
      type: 'button',
      class: [
        'w-6 h-6 text-xs border rounded cursor-pointer',
        active
          ? 'bg-(--re-text) text-(--re-bg) border-(--re-text)'
          : 'bg-transparent text-(--re-text) border-(--re-border)',
      ],
      onClick,
    },
    label,
  );

// Declared, so that they don't also fall through to the root element
Row.props = ['label'];
ColorPicker.props = ['value', 'onChange'];
NumberField.props = ['value', 'onChange', 'unit'];
MarkButton.props = ['label', 'active', 'onClick'];

const marks = [
  { name: 'bold', label: 'B', class: 'font-bold' },
  { name: 'italic', label: 'I', class: 'italic' },
  { name: 'underline', label: 'U', class: 'underline' },
  { name: 'strike', label: 'S', class: 'line-through' },
];

const alignments = ['left', 'center', 'right'] as const;
</script>

<template>
  <ExampleShell
    v-if="editor"
    title="Inspector — fully custom"
    description="Build the entire inspector UI from scratch using only scoped slot data and plain HTML. No primitives or section components."
  >
    <div class="flex -m-4">
      <div class="flex-1 min-w-0 m-4 mt-0">
        <EditorContent class="p-4 pt-0 bg-white rounded-md" :editor="editor" />
      </div>
      <aside
        class="w-60 shrink-0 border-l border-(--re-border) p-4 flex flex-col gap-3 text-xs"
      >
        <Inspector.Root>
          <Inspector.Document v-slot="{ findStyleValue, setGlobalStyle }">
            <fieldset class="border border-(--re-border) rounded p-2 m-0">
              <legend class="text-xs font-bold px-1">Document</legend>
              <Row label="Background">
                <ColorPicker
                  :value="String(findStyleValue('body', 'backgroundColor') ?? '')"
                  @change="(v) => setGlobalStyle('body', 'backgroundColor', v)"
                />
              </Row>
              <Row label="Container width">
                <NumberField
                  :value="findStyleValue('container', 'width')"
                  @change="(v) => setGlobalStyle('container', 'width', v)"
                  unit="px"
                />
              </Row>
              <Row label="Container radius">
                <NumberField
                  :value="findStyleValue('container', 'borderRadius')"
                  @change="
                    (v) => setGlobalStyle('container', 'borderRadius', v)
                  "
                  unit="px"
                />
              </Row>
            </fieldset>
          </Inspector.Document>

          <Inspector.Node
            v-slot="{ nodeType, getStyle, setStyle, getAttr, setAttr }"
          >
            <fieldset class="border border-(--re-border) rounded p-2 m-0">
              <legend class="text-xs font-bold px-1">{{ nodeType }}</legend>
              <Row label="Background">
                <ColorPicker
                  :value="String(getStyle('backgroundColor') ?? '')"
                  @change="(v) => setStyle('backgroundColor', v)"
                />
              </Row>
              <Row label="Padding">
                <NumberField
                  :value="getStyle('paddingTop')"
                  @change="(v) => setStyle('paddingTop', v)"
                  unit="px"
                />
              </Row>
              <template v-if="nodeType === 'image'">
                <Row label="Width">
                  <NumberField
                    :value="getAttr('width') as number"
                    @change="(v) => setAttr('width', v)"
                    unit="px"
                  />
                </Row>
                <Row label="Alt">
                  <input
                    type="text"
                    :value="String(getAttr('alt') ?? '')"
                    class="w-full text-xs bg-transparent border border-(--re-border) rounded px-1.5 py-1"
                    @input="setAttr('alt', inputValue($event))"
                  />
                </Row>
              </template>
              <Row v-if="nodeType === 'button'" label="Link">
                <input
                  type="text"
                  :value="String(getAttr('href') ?? '')"
                  class="w-full text-xs bg-transparent border border-(--re-border) rounded px-1.5 py-1"
                  @input="setAttr('href', inputValue($event))"
                />
              </Row>
            </fieldset>
          </Inspector.Node>

          <Inspector.Text
            v-slot="{
              marks: activeMarks,
              toggleMark,
              alignment,
              setAlignment,
              linkColor,
              setLinkColor,
              isLinkActive,
              getStyle,
              setStyle,
            }"
          >
            <fieldset class="border border-(--re-border) rounded p-2 m-0">
              <legend class="text-xs font-bold px-1">Text</legend>
              <Row label="Format">
                <span class="flex gap-0.5">
                  <MarkButton
                    v-for="mark in marks"
                    :key="mark.name"
                    :class="mark.class"
                    :label="mark.label"
                    :active="Boolean(activeMarks[mark.name])"
                    @click="toggleMark(mark.name)"
                  />
                </span>
              </Row>
              <Row label="Align">
                <span class="flex gap-0.5">
                  <MarkButton
                    v-for="a in alignments"
                    :key="a"
                    :label="a.charAt(0).toUpperCase()"
                    :active="alignment === a"
                    @click="setAlignment(a)"
                  />
                </span>
              </Row>
              <Row label="Color">
                <ColorPicker
                  :value="String(getStyle('color') ?? '')"
                  @change="(v) => setStyle('color', v)"
                />
              </Row>
              <Row label="Size">
                <NumberField
                  :value="getStyle('fontSize')"
                  @change="(v) => setStyle('fontSize', v)"
                  unit="px"
                />
              </Row>
              <Row v-if="isLinkActive" label="Link color">
                <ColorPicker :value="linkColor" @change="setLinkColor" />
              </Row>
            </fieldset>
          </Inspector.Text>
        </Inspector.Root>
      </aside>
    </div>
  </ExampleShell>
</template>
