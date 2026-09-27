/**
 * Sends a test email with Resend, for the Send buttons of the components page
 * and of the preview server.
 */
export default defineEventHandler(async (event) => {
  const { resendApiKey } = useRuntimeConfig(event);

  const result = await sendTestEmail(
    await readBody(event).catch(() => undefined),
    {
      ip: getRequestIP(event, { xForwardedFor: true }) ?? 'unknown',
      resendApiKey,
      ipLimiter: sendTestIpRatelimit,
      recipientLimiter: sendTestRecipientRatelimit,
    },
  );

  setResponseStatus(event, result.status);
  return result.body;
});
