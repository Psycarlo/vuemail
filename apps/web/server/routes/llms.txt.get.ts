import { componentsStructure } from '../../components/structure';

export default defineEventHandler((event) => {
  setResponseHeaders(event, llmsHeaders);
  return llmsTxt(componentsStructure);
});
