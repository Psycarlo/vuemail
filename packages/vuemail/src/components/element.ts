import { type InjectionKey, inject, normalizeClass } from 'vue';
import { type StyleObject, toStyleObject } from './utils/style';

export interface ResolvedTailwind {
  /** Tailwind's inlinable styles merged with the `style` given, which wins. */
  style: StyleObject;
  /** The classes that could not be inlined, which have to stay on the element. */
  class: string | undefined;
  /** The CSS properties each class that stays on the element sets. */
  classProperties: Record<string, string[]>;
}

export interface TailwindResolution {
  style: Record<string, string>;
  className: string | undefined;
  classProperties: Record<string, string[]>;
}

export interface TailwindContext {
  resolve(className: string): TailwindResolution;
}

export const tailwindContextKey: InjectionKey<TailwindContext> =
  Symbol('vuemail.tailwind');

/**
 * Added to the classes of elements whose Tailwind classes were resolved by
 * their component, so that `<Tailwind>` doesn't resolve them a second time.
 */
export const resolvedClassMarker = '__vuemail_resolved';

export type TailwindResolver = (
  className: unknown,
  style: unknown,
) => ResolvedTailwind;

/**
 * Lets a component resolve its own Tailwind classes into inline styles
 * before it renders, which is what allows components like `<Button>` to
 * compute their Outlook fallbacks from padding set through classes.
 *
 * Outside of `<Tailwind>`, it only normalizes `class` and `style`.
 * Must be called inside `setup()`.
 *
 * @example
 * ```ts
 * const Badge = defineComponent((_, { attrs, slots }) => {
 *   const resolveTailwind = useTailwind();
 *   return () => {
 *     const { style, class: className } = resolveTailwind(attrs.class, attrs.style);
 *     return h('span', { class: className, style: styleToString(style) }, slots.default?.());
 *   };
 * });
 * ```
 */
export function useTailwind(): TailwindResolver {
  const context = inject(tailwindContextKey, null);

  return (className, style) => {
    const explicitStyle = toStyleObject(style);
    const classes = normalizeClass(className).trim();

    if (!context || classes === '') {
      return {
        style: explicitStyle,
        class: classes === '' ? undefined : classes,
        classProperties: {},
      };
    }

    const resolved = context.resolve(classes);
    return {
      style: { ...resolved.style, ...explicitStyle },
      // The marker tells <Tailwind> that the classes left have been resolved
      // already, and it takes the marker out of the HTML once it's rendered.
      class: resolved.className
        ? `${resolved.className} ${resolvedClassMarker}`
        : undefined,
      classProperties: resolved.classProperties,
    };
  };
}
