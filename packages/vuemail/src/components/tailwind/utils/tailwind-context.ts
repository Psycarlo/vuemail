import {
  type CssNode,
  clone,
  generate,
  List,
  type Rule,
  type StyleSheet,
  walk,
} from 'css-tree';
import type { TailwindContext, TailwindResolution } from '../../element';
import { sanitizeStyleSheet } from '../sanitize-stylesheet';
import { sanitizeClassName } from './compatibility/sanitize-class-name';
import { downlevelForEmailClients } from './css/downlevel-for-email-clients';
import { extractRulesPerClass } from './css/extract-rules-per-class';
import {
  type CustomProperties,
  getCustomProperties,
} from './css/get-custom-properties';
import { makeInlineStylesFor } from './css/make-inline-styles-for';
import { sanitizeNonInlinableRules } from './css/sanitize-non-inlinable-rules';
import type { TailwindSetup } from './tailwindcss/setup-tailwind';

export interface TailwindRenderContext extends TailwindContext {
  /** Makes sure the CSS for all of these classes has been generated. */
  prepare(classes: string[]): void;
  /** The name a class a component already resolved should end up with. */
  refreshResolvedClass(className: string): string;
  /** The `<style>` contents for every class used so far that can't be inlined. */
  getNonInlinableCss(): string;
  /** The classes used so far that can't be inlined, as they were written. */
  getNonInlinableClasses(): string[];
}

const splitClasses = (className: string) =>
  className.trim().split(/\s+/).filter(Boolean);

interface CachedResolution {
  resolution: TailwindResolution;
  /** The classes, as written, whose styles have to go in a `<style>` tag. */
  nonInlinableClasses: string[];
}

/**
 * What's known about the classes a compiler has seen, which doesn't depend on
 * a render, so that every render using the same configuration shares it.
 */
interface SetupCache {
  knownClasses: Set<string>;
  inlinableRules: Map<string, Rule[]>;
  nonInlinableProperties: Map<string, string[]>;
  resolutions: Map<string, CachedResolution>;
  customProperties: CustomProperties;
}

const setupCaches = new WeakMap<TailwindSetup, SetupCache>();

const getSetupCache = (setup: TailwindSetup) => {
  let cache = setupCaches.get(setup);
  if (!cache) {
    cache = {
      knownClasses: new Set(),
      inlinableRules: new Map(),
      nonInlinableProperties: new Map(),
      resolutions: new Map(),
      customProperties: new Map(),
    };
    setupCaches.set(setup, cache);
  }
  return cache;
};

/**
 * Keeps track of the Tailwind classes used during a single render of
 * `<Tailwind>`: generates their CSS as new ones show up, inlines what can be
 * inlined, and remembers what has to go into a `<style>` tag instead.
 */
export function createTailwindContext(
  setup: TailwindSetup,
): TailwindRenderContext {
  const cache = getSetupCache(setup);
  const usedNonInlinableClasses = new Set<string>();

  function prepare(classes: string[]) {
    const unknownClasses = classes.filter(
      (className) => !cache.knownClasses.has(className),
    );
    if (unknownClasses.length === 0) return;

    for (const className of unknownClasses) {
      cache.knownClasses.add(className);
    }
    setup.addUtilities(unknownClasses);

    const styleSheet = setup.getStyleSheet();
    sanitizeStyleSheet(styleSheet);
    // Every known class is extracted again, since the rules that name a class
    // can come from the new ones: `group-hover/item:underline` gives the
    // `group/item` class used before it a rule of its own.
    const { inlinable, nonInlinable } = extractRulesPerClass(
      styleSheet,
      Array.from(cache.knownClasses),
    );
    cache.inlinableRules = inlinable;
    cache.nonInlinableProperties = new Map();
    for (const [className, rules] of nonInlinable) {
      const properties: string[] = [];
      for (const rule of rules) {
        walk(rule, {
          visit: 'Declaration',
          enter(declaration) {
            properties.push(declaration.property);
          },
        });
      }
      cache.nonInlinableProperties.set(className, properties);
    }
    cache.customProperties = getCustomProperties(styleSheet);
    cache.resolutions.clear();
  }

  function computeResolution(className: string): CachedResolution {
    const classes = splitClasses(className);
    prepare(classes);

    const residualClasses: string[] = [];
    const nonInlinableClasses: string[] = [];
    const classProperties: Record<string, string[]> = Object.create(null);
    const rules: Rule[] = [];

    for (const name of classes) {
      const classRules = cache.inlinableRules.get(name);
      if (classRules) {
        // Inlining resolves variables in place, and the variables a rule
        // resolves to depend on the other classes of the element.
        rules.push(...classRules.map((rule) => clone(rule) as Rule));
      }
      const properties = cache.nonInlinableProperties.get(name);
      if (properties) {
        const sanitized = sanitizeClassName(name);
        residualClasses.push(sanitized);
        classProperties[sanitized] = properties;
        nonInlinableClasses.push(name);
      } else if (!classRules) {
        residualClasses.push(name);
      }
    }

    return {
      resolution: {
        style: makeInlineStylesFor(rules, cache.customProperties),
        className:
          residualClasses.length > 0 ? residualClasses.join(' ') : undefined,
        classProperties,
      },
      nonInlinableClasses,
    };
  }

  function resolve(className: string): TailwindResolution {
    let cached = cache.resolutions.get(className);
    if (!cached) {
      cached = computeResolution(className);
      cache.resolutions.set(className, cached);
    }
    for (const name of cached.nonInlinableClasses) {
      usedNonInlinableClasses.add(name);
    }
    return cached.resolution;
  }

  function getNonInlinableCss() {
    if (usedNonInlinableClasses.size === 0) return '';

    // Extracted again from a fresh stylesheet, so that the rules keep the
    // order Tailwind gives them instead of the order they were found in.
    const styleSheet = setup.getStyleSheet();
    sanitizeStyleSheet(styleSheet);
    const { nonInlinable } = extractRulesPerClass(
      styleSheet,
      Array.from(usedNonInlinableClasses),
    );

    const nonInlineStyles: StyleSheet = {
      type: 'StyleSheet',
      children: new List<CssNode>().fromArray(
        Array.from(nonInlinable.values()).flat(),
      ),
    };
    sanitizeNonInlinableRules(nonInlineStyles);
    downlevelForEmailClients(nonInlineStyles);

    return generate(nonInlineStyles);
  }

  /**
   * A class a component resolved can get non-inlinable rules from utilities
   * rendered after it, like the `group/item` of `group-hover/item:underline`.
   * React Email knows every class of the email before inlining any, so the
   * class is sanitized, as the selectors that refer to it are.
   */
  function refreshResolvedClass(className: string) {
    if (!cache.nonInlinableProperties.has(className)) return className;
    usedNonInlinableClasses.add(className);
    return sanitizeClassName(className);
  }

  return {
    prepare,
    resolve,
    refreshResolvedClass,
    getNonInlinableCss,
    getNonInlinableClasses: () => Array.from(usedNonInlinableClasses),
  };
}
