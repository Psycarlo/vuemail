import { communityItems, officialItems } from '../../../shared/templates';

/** The templates, as markdown: `/templates.md` */
export default defineEventHandler((event) => {
  setResponseHeaders(event, markdownHeaders);
  return templatesMarkdown(officialItems, communityItems);
});
