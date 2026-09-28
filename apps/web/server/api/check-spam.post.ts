/**
 * Scores an email with SpamAssassin, for the Spam tab of the toolbar of the
 * preview server.
 */
export default defineEventHandler(async (event) => {
  const { spamAssassinHost, spamAssassinPort } = useRuntimeConfig(event);

  const result = await checkSpamRequest(
    await readBody(event).catch(() => undefined),
    { spamd: { host: spamAssassinHost, port: spamAssassinPort } },
  );

  setResponseStatus(event, result.status);
  return result.body;
});
