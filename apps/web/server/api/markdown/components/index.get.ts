import { componentsStructure } from '../../../../components/structure';

/** The categories of components, as markdown: `/components.md` */
export default defineEventHandler((event) => {
  setResponseHeaders(event, markdownHeaders);
  return componentsIndexMarkdown(componentsStructure);
});
