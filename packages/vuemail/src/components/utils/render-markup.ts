import type { VNode } from 'vue';
import { render } from 'vuemail-render';

const doctype =
  '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';

/**
 * Renders a node the way emails are rendered, without the doctype, so that
 * specs can compare the markup their components produce.
 */
export async function renderMarkup(node: VNode) {
  const html = await render(node);
  return html.startsWith(doctype) ? html.slice(doctype.length) : html;
}
