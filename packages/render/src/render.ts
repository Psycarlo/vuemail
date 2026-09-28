import {
  type AllowedComponentProps,
  type Component,
  createSSRApp,
  isVNode,
  type VNode,
  type VNodeProps,
} from 'vue';
import { renderToString } from 'vue/server-renderer';
import type { Options } from './options';
import { hoistTitles } from './utils/hoist-titles';
import { normalizeDocument } from './utils/normalize-document';
import { pretty } from './utils/pretty';
import { sanitizeUrlAttributes } from './utils/sanitize-url-attributes';
import { stripSsrMarkers } from './utils/strip-ssr-markers';
import { toPlainText } from './utils/to-plain-text';
import { unstableToPlainText } from './utils/unstable-to-plain-text';

/**
 * The props a component accepts, as seen by its parent.
 */
export type ComponentProps<C> = C extends new (
  ...args: any
) => { $props: infer P }
  ? Omit<P, keyof VNodeProps | keyof AllowedComponentProps>
  : C extends (props: infer P, ...args: any) => any
    ? P
    : Record<string, unknown>;

const doctype =
  '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';

/**
 * Renders a Vue component, or a VNode, into an email-ready HTML string.
 *
 * @example
 * ```ts
 * import { render } from '@vuemaildev/render';
 * import WelcomeEmail from './emails/welcome.vue';
 *
 * const html = await render(WelcomeEmail, { firstName: 'Jim' });
 * const text = await render(WelcomeEmail, { firstName: 'Jim' }, { plainText: true });
 * ```
 */
export async function render<C extends Component>(
  component: C,
  props?: ComponentProps<C>,
  options?: Options,
): Promise<string>;
export async function render(node: VNode, options?: Options): Promise<string>;
export async function render(
  input: Component | VNode,
  propsOrOptions?: unknown,
  maybeOptions?: Options,
): Promise<string> {
  const options = (isVNode(input) ? propsOrOptions : maybeOptions) as
    | Options
    | undefined;

  const app = isVNode(input)
    ? createSSRApp({ name: 'VuemailRoot', render: () => input })
    : createSSRApp(input, propsOrOptions as Record<string, unknown>);

  // Vue only logs some errors while rendering on the server, like the ones
  // thrown by an async setup(), and renders on. An email that failed to
  // render should not be sent though, so the first error is thrown instead.
  const errors: unknown[] = [];
  app.config.errorHandler = (error) => {
    errors.push(error);
  };
  await options?.setupApp?.(app);

  let markup: string;
  try {
    markup = await renderToString(app);
  } catch (error) {
    throw errors.length > 0 ? errors[0] : error;
  }
  if (errors.length > 0) throw errors[0];

  const html = hoistTitles(
    normalizeDocument(sanitizeUrlAttributes(stripSsrMarkers(markup))),
  );

  if (options?.plainText) {
    return options.unstableTextConversion
      ? unstableToPlainText(html)
      : toPlainText(html, options.htmlToTextOptions);
  }

  const document = `${doctype}${html.replace(/<!DOCTYPE.*?>/, '')}`;

  if (options?.pretty) {
    return pretty(document);
  }

  return document;
}
