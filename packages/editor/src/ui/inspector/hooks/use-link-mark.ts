import type { Editor } from '@tiptap/core';
import type { ComputedRef, MaybeRefOrGetter } from 'vue';
import { inlineCssToJs, jsToInlineCss } from '../../../utils/styles';
import { useEditorState } from '../../use-editor-state';

interface LinkMarkState {
  href: string;
  style: string;
  isActive: boolean;
}

export function useLinkMark(
  editor: MaybeRefOrGetter<Editor | null | undefined>,
): ComputedRef<LinkMarkState> {
  return useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) {
        return { href: '', style: '', isActive: false };
      }
      const { from } = editor.state.selection;
      const mark =
        editor.state.doc
          .resolve(from)
          .marks()
          .find((m) => m.type.name === 'link') ?? null;
      return {
        href: (mark?.attrs?.href as string) ?? '',
        style: (mark?.attrs?.style as string) ?? '',
        isActive: !!mark,
      };
    },
  });
}

export function getLinkColor(
  linkStyle: string,
  themeLinkColor: string | undefined,
  fallback = '#000000',
): string {
  return inlineCssToJs(linkStyle).color || themeLinkColor || fallback;
}

export function updateLinkColor(
  editor: Editor,
  linkStyle: string,
  color: string,
): void {
  const styleObj = inlineCssToJs(linkStyle);
  styleObj.color = color;
  const newStyle = jsToInlineCss(styleObj);
  const { from, to } = editor.state.selection;
  editor
    .chain()
    .extendMarkRange('link')
    .updateAttributes('link', { style: newStyle })
    .setTextSelection({ from, to })
    .run();
}
