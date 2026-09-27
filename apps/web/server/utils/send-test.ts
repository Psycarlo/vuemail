import { Resend } from 'resend';
import { z } from 'zod';
import type { RateLimiter } from './rate-limiter';

export const sendTestBodySchema = z.object({
  to: z.email(),
  subject: z.string(),
  html: z.string(),
});

export interface SendTestEmailOptions {
  /** The IP the request comes from */
  ip: string;
  resendApiKey: string;
  ipLimiter: RateLimiter;
  recipientLimiter: RateLimiter;
}

/**
 * What `POST /api/send/test` answers to a request with the body given: sends
 * the email to the recipient with Resend, as long as neither the IP nor the
 * recipient sent too many of them.
 */
export async function sendTestEmail(
  body: unknown,
  { ip, resendApiKey, ipLimiter, recipientLimiter }: SendTestEmailOptions,
): Promise<{ status: number; body: { message: string } | { error: string } }> {
  const parsedBody = sendTestBodySchema.safeParse(body);
  if (!parsedBody.success) {
    return { status: 400, body: { error: parsedBody.error.message } };
  }
  const { to, subject, html } = parsedBody.data;

  // Both are consumed, like the upstream limiters, which run in parallel
  const ipCheck = ipLimiter.consume(ip);
  const recipientCheck = recipientLimiter.consume(to.toLowerCase());
  if (!ipCheck.allowed || !recipientCheck.allowed) {
    return { status: 429, body: { error: 'Rate limit exceeded' } };
  }

  try {
    const resend = new Resend(resendApiKey);
    const { error } = await resend.emails.send({
      from: 'Vuemail <preview@vuemail.dev>',
      to: [to],
      subject,
      html,
    });
    if (error) {
      return { status: 500, body: { error: error.message } };
    }

    return { status: 200, body: { message: 'Test email sent' } };
  } catch (error) {
    return {
      status: 500,
      body: {
        error: error instanceof Error ? error.message : 'Something went wrong',
      },
    };
  }
}
