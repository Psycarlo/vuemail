import type { Category } from '../../../../components/structure';
import type { ImportedComponent } from '../../../utils/gallery';

// Rendering the components of a category takes a while, and they don't change
// while the server runs
const componentsPerCategory = new Map<string, Promise<ImportedComponent[]>>();

const getComponentsOf = (category: Category) => {
  let components = componentsPerCategory.get(category.name);
  if (!components) {
    components = Promise.all(
      category.components.map((component) => getImportedComponent(component)),
    );
    componentsPerCategory.set(category.name, components);
    components.catch(() => componentsPerCategory.delete(category.name));
  }
  return components;
};

/** The components of a category, with their code, as markdown */
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? '';
  const category = findCategory(slug);
  if (!category) {
    setResponseStatus(event, 404);
    setResponseHeaders(event, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=60',
    });
    return `No component category "${slug}". The list of categories is at https://vuemail.dev/components.md`;
  }

  const components = await getComponentsOf(category);
  setResponseHeaders(event, markdownHeaders);
  return categoryMarkdown(category, components);
});
