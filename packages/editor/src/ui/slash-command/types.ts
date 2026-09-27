import type { Editor, Range } from '@tiptap/core';
import type { Component, VNodeChild } from 'vue';

export type SlashCommandCategory = string;

export interface SearchableItem {
  title: string;
  description: string;
  searchTerms?: string[];
}

export interface SlashCommandItem extends SearchableItem {
  /** What to render as the icon: an element like `h(TextIcon, { size: 20 })`, or a component. */
  icon: VNodeChild | Component;
  category: SlashCommandCategory;
  command: (props: SlashCommandProps) => void;
}

export interface SlashCommandProps {
  editor: Editor;
  range: Range;
}

export interface SlashCommandRenderProps {
  items: SlashCommandItem[];
  query: string;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export interface SlashCommandRootProps {
  items?: SlashCommandItem[];
  filterItems?: (
    items: SlashCommandItem[],
    query: string,
    editor: Editor,
  ) => SlashCommandItem[];
  char?: string;
  allow?: (props: { editor: Editor }) => boolean;
}

export interface SlashCommandRootSlots {
  /** Replaces the default command list, receiving its render props. */
  default?: (props: SlashCommandRenderProps) => unknown;
}
