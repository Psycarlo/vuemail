/// <reference types="vite/client" />

import { render } from '@vuemaildev/vuemail';
import { describe, expect, it } from 'vitest';
import { type Component, h } from 'vue';
import Layout from './_components/layout.vue';
import { componentsStructure } from './structure';

const modules = import.meta.glob<{ default: Component }>([
  './*/*.vue',
  '!./_components/*.vue',
]);

const variants = Object.entries(modules).map(([path, load]) => {
  const [, slug, name] = path.match(/^\.\/([^/]+)\/([^/]+)\.vue$/)!;
  return { slug: slug!, name: name!, load };
});

const components = componentsStructure.flatMap(
  (category) => category.components,
);
const slugs = new Set(components.map((component) => component.slug));

describe('components gallery', () => {
  it.each(components)('has variants for $slug', ({ slug }) => {
    const names = variants
      .filter((variant) => variant.slug === slug)
      .map((variant) => variant.name)
      .sort();

    expect(names.length).toBeGreaterThan(0);
    // Either both styling variants, or a single one using neither
    expect([['inline-styles', 'tailwind'], ['index']]).toContainEqual(names);
  });

  it('has no variants for components missing from the structure', () => {
    const unknown = variants.filter((variant) => !slugs.has(variant.slug));

    expect(unknown.map((variant) => variant.slug)).toEqual([]);
  });

  it.each(
    variants
      .filter((variant) => slugs.has(variant.slug))
      .map((variant) => [`${variant.slug}/${variant.name}`, variant] as const),
  )('renders %s', async (_name, { load }) => {
    const { default: Variant } = await load();

    const html = await render(h(Layout, null, () => h(Variant)));

    expect(html).toContain('<html');
    expect(html).not.toContain('{{');
    expect(html).not.toContain('[object Object]');
    expect(html).not.toContain('undefined');
  });
});
