import { type MaybeRefOrGetter, toValue } from 'vue';
import { createImageExtension } from './extension';
import type { UseEditorImageOptions } from './types';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      setImage: (attrs: {
        src: string;
        alt?: string;
        width?: string;
        height?: string;
        alignment?: string;
        href?: string;
      }) => ReturnType;
      uploadImage: () => ReturnType;
    };
  }
}

export { imageSlashCommand } from './slash-command';
export type { UploadImageResult, UseEditorImageOptions } from './types';

/**
 * Creates the image extension, which always uploads with the latest
 * `uploadImage` given, so the options can be a ref or a getter over props.
 */
export function useEditorImage(
  options: MaybeRefOrGetter<UseEditorImageOptions>,
) {
  return createImageExtension({
    uploadImage: (file) => toValue(options).uploadImage(file),
  });
}
