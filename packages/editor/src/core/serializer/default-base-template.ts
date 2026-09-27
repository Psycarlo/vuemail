import { h, type VNodeChild } from 'vue';
import { Body, Head, Html, Preview } from 'vuemail';
import { DARK_MODE_CSS } from '../../utils/dark-mode';

interface DefaultBaseTemplateProps {
  children: VNodeChild;
  previewText?: string;
  previewMode?: boolean;
}

export function DefaultBaseTemplate({
  children,
  previewText,
  previewMode = false,
}: DefaultBaseTemplateProps): VNodeChild {
  return h(Html, null, () => [
    h(Head, null, () => [
      h('meta', { content: 'width=device-width', name: 'viewport' }),
      h('meta', { content: 'IE=edge', 'http-equiv': 'X-UA-Compatible' }),
      h('meta', { name: 'x-apple-disable-message-reformatting' }),
      h('meta', {
        content: 'telephone=no,address=no,email=no,date=no,url=no',
        name: 'format-detection',
      }),
      previewMode ? null : h('style', { innerHTML: DARK_MODE_CSS }),
    ]),
    previewText && previewText !== ''
      ? h(Preview, null, () => previewText)
      : null,
    h(Body, null, () => children),
  ]);
}
