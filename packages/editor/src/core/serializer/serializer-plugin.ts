import type { Editor, JSONContent } from '@tiptap/core';
import type { CSSProperties, VNodeChild } from 'vue';

export interface BaseTemplateProps {
  previewText?: string;
  /** The content of the email, already rendered. */
  children: VNodeChild;
  editor: Editor;
  previewMode?: boolean;
}

export interface SerializerPlugin {
  getNodeStyles(
    node: JSONContent,
    depth: number,
    editor: Editor,
  ): CSSProperties;
  /** Renders the document around the content of the email. */
  BaseTemplate(props: BaseTemplateProps): VNodeChild;
}
