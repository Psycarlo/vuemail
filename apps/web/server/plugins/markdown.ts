/**
 * Serves the markdown twins of the pages (see `proxyMarkdown`), the way React
 * Email's website does with a Next.js middleware.
 */
export default defineNitroPlugin((nitroApp) => {
  const markdownHandler = defineEventHandler(async (event) => {
    if (event.method !== 'GET' && event.method !== 'HEAD') return;

    const response = await proxyMarkdown(
      {
        pathname: event.path.split('?')[0] || '/',
        accept: getRequestHeader(event, 'accept') ?? '',
      },
      (target) => nitroApp.localFetch(target),
    );
    if (!response) return;

    setResponseStatus(event, response.status);
    setResponseHeaders(event, response.headers);
    return response.body;
  });

  // Nitro serves the public assets, prerendered pages included, before any
  // server middleware, so this goes first for the pages to be negotiated
  nitroApp.h3App.stack.unshift({ route: '', handler: markdownHandler });
});
