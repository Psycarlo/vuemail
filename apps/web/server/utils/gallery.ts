import { h } from 'vue';
import { pretty, render } from 'vuemail';
import { loadLayout, variants } from '#gallery';
import {
  type Category,
  type Component,
  componentsStructure,
} from '../../components/structure';
import { sortVariants } from './gallery-variants';

/**
 * Tailwind and Inline Styles are both written with Vue, while the Vue
 * variant is meant for components that use neither.
 */
export type CodeVariant = 'tailwind' | 'inline-styles' | 'vue' | 'html';

export interface ImportedComponent extends Component {
  code: Partial<Record<CodeVariant, string>> & { html: string };
}

const readSource = async (slug: string, variant: string) => {
  // `.vue` isn't a known text type, so the asset comes back as raw bytes
  const source = await useStorage('assets:gallery').getItemRaw(
    `${slug}/${variant}.vue`,
  );
  if (source === null || source === undefined) {
    throw new Error(`Could not read the source code of ${slug}/${variant}.vue`);
  }
  const text =
    typeof source === 'string'
      ? source
      : new TextDecoder().decode(source as Uint8Array);
  return text.replaceAll('\r\n', '\n');
};

export async function getImportedComponent(
  component: Component,
): Promise<ImportedComponent> {
  const loaders = variants[component.slug];
  if (!loaders) {
    throw new Error(`There is no component called ${component.slug}`);
  }

  const variantNames = sortVariants(Object.keys(loaders));
  const [{ default: Layout }, { default: firstVariant }] = await Promise.all([
    loadLayout(),
    loaders[variantNames[0]!]!(),
  ]);

  const code: ImportedComponent['code'] = {
    html: await pretty(await render(h(Layout, null, () => h(firstVariant)))),
  };
  for (const variant of variantNames) {
    code[variant === 'index' ? 'vue' : (variant as CodeVariant)] =
      await readSource(component.slug, variant);
  }

  return { ...component, code };
}

export const findCategory = (slug: string): Category | undefined =>
  componentsStructure.find((category) => slugify(category.name) === slug);
