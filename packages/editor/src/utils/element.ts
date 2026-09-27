import {
  h,
  normalizeClass,
  type VNode,
  type VNodeArrayChildren,
  type VNodeChild,
} from 'vue';
import { styleToString, toStyleObject } from 'vuemail';

/**
 * Renders a plain HTML element into an email the way React renders it, for
 * the `renderToVueEmail` of nodes and marks: attributes keep their order,
 * `class` and `style` are left out when they're empty (Vue's server renderer
 * would render them as empty attributes) and numbers in `style` get a `px`
 * unit unless the property is unitless.
 */
export function element(
  tag: string,
  props: Record<string, unknown> | null,
  children?: VNodeChild,
): VNode {
  const attributes: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props ?? {})) {
    if (key === 'class') {
      const className = normalizeClass(value);
      if (className) {
        attributes.class = className;
      }
    } else if (key === 'style') {
      const style = styleToString(toStyleObject(value));
      if (style) {
        attributes.style = style;
      }
    } else if (value !== undefined && value !== null) {
      attributes[key] = value;
    }
  }

  if (children === undefined) {
    return h(tag, attributes);
  }

  return h(
    tag,
    attributes,
    (Array.isArray(children) ? children : [children]) as VNodeArrayChildren,
  );
}
