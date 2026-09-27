import type { HtmlToTextOptions } from 'html-to-text';
import type { App } from 'vue';
import type { pretty } from './utils/pretty';
import type { toPlainText } from './utils/to-plain-text';
import type { unstableToPlainText } from './utils/unstable-to-plain-text';

export type Options = {
  /**
   * @see {@link pretty}
   */
  pretty?: boolean;
  /**
   * Called with the Vue application used for rendering, before it renders.
   * Use it to install plugins your email depends on, like `vue-i18n`.
   *
   * @example
   * ```ts
   * await render(Email, props, { setupApp: (app) => app.use(i18n) });
   * ```
   */
  setupApp?: (app: App) => unknown;
} & (
  | {
      /**
       * @see {@link toPlainText}
       */
      plainText?: false;
    }
  | {
      /**
       * @see {@link toPlainText}
       */
      plainText?: true;
      /**
       * These are options you can pass down directly to the library we use for
       * converting the rendered email's HTML into plain text.
       *
       * @see https://github.com/html-to-text/node-html-to-text
       */
      htmlToTextOptions?: HtmlToTextOptions;
      unstableTextConversion?: false;
    }
  | {
      plainText?: true;
      /**
       * Converts to plain text with an in-house formatter instead of
       * html-to-text, so it doesn't take `htmlToTextOptions`.
       *
       * @see {@link unstableToPlainText}
       */
      unstableTextConversion: true;
    }
);
