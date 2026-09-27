import { isVNode, type VNode, h as vueH } from 'vue';

const isProps = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  !isVNode(value);

/**
 * Vue's `h()`, except that `class` and `style` props without a value are
 * left out, because Vue's server renderer would still render them as empty
 * attributes.
 */
export const h = ((...args: unknown[]) => {
  const props = args[1];
  if (isProps(props)) {
    if (props.class === undefined || props.class === '') delete props.class;
    if (props.style === undefined || props.style === '') delete props.style;
  }
  return (vueH as (...args: unknown[]) => VNode)(...args);
}) as typeof vueH;
