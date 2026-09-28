import { z } from 'zod';
import { parsePointingTableRows } from './spam-assassin/parse-pointing-table-rows';
import { type SpamdOptions, sendToSpamd } from './spam-assassin/send-to-spamd';

export interface SpamCheck {
  name: string;
  description: string;
  points: number;
}

export interface SpamCheckingResult {
  checks: SpamCheck[];
  isSpam: boolean;
  points: number;
}

/** Scores an email with SpamAssassin, leaving out the rules about headers. */
export async function checkSpam(
  html: string,
  plainText: string,
  spamdOptions: SpamdOptions,
): Promise<SpamCheckingResult> {
  const response = await sendToSpamd(html, plainText, spamdOptions);
  const tableRows = parsePointingTableRows(response);

  const filteredRows = tableRows.filter(
    (row) =>
      !row.description.toLowerCase().includes('header') &&
      !row.ruleName.includes('HEADER') &&
      row.pts !== 0,
  );

  const checks = filteredRows.map((row) => ({
    name: row.ruleName,
    description: row.description,
    points: row.pts,
  }));

  const points = checks.reduce((acc, check) => acc + check.points, 0);

  return {
    checks,
    isSpam: points >= 5.0,
    points,
  };
}

export const checkSpamBodySchema = z.object({
  html: z.string(),
  plainText: z.string(),
});

/**
 * What `POST /api/check-spam` answers to a request with the body given. Like
 * React Email's, it isn't rate limited: `email build` checks every email of a
 * project in a row.
 */
export async function checkSpamRequest(
  body: unknown,
  { spamd }: { spamd: SpamdOptions },
): Promise<{ status: number; body: SpamCheckingResult | { error: string } }> {
  const parsedBody = checkSpamBodySchema.safeParse(body);
  if (!parsedBody.success) {
    return { status: 400, body: { error: parsedBody.error.message } };
  }

  try {
    const { html, plainText } = parsedBody.data;
    return { status: 200, body: await checkSpam(html, plainText, spamd) };
  } catch (exception) {
    return {
      status: 500,
      body: {
        error:
          exception instanceof Error
            ? exception.message
            : 'Something went wrong',
      },
    };
  }
}
