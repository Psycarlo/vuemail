import type { EmailClient } from '../../shared/types';

// This module has no Node dependencies: the preview app uses it as well, to
// name the email clients compatibility is checked against.

export const ALL_EMAIL_CLIENTS = [
  'gmail',
  'outlook',
  'yahoo',
  'apple-mail',
  'aol',
  'thunderbird',
  'microsoft',
  'samsung-email',
  'sfr',
  'orange',
  'protonmail',
  'hey',
  'mail-ru',
  'fastmail',
  'laposte',
  't-online-de',
  'free-fr',
  'gmx',
  'web-de',
  'ionos-1and1',
  'rainloop',
  'wp-pl',
] as const satisfies readonly EmailClient[];

export const DEFAULT_RELEVANT_EMAIL_CLIENTS = [
  'gmail',
  'apple-mail',
  'outlook',
  'yahoo',
] as const satisfies readonly EmailClient[];

const isEmailClient = (value: string): value is EmailClient =>
  (ALL_EMAIL_CLIENTS as readonly string[]).includes(value);

/**
 * The email clients compatibility is checked against: the configured ones
 * (`--clients`, or `COMPATIBILITY_EMAIL_CLIENTS`), or the most used ones.
 */
export const getRelevantEmailClients = (
  configuredClients: readonly string[] = [],
): readonly EmailClient[] => {
  const requested = configuredClients
    .map((entry) => entry.trim().toLowerCase())
    .filter(isEmailClient);

  return requested.length > 0 ? requested : DEFAULT_RELEVANT_EMAIL_CLIENTS;
};
