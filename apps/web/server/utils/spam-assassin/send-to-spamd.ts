import crypto from 'node:crypto';
import net from 'node:net';

export interface SpamdOptions {
  host?: string;
  port?: string | number;
  /** How long to wait for spamd, in milliseconds. */
  timeout?: number;
}

/**
 * Asks spamd, SpamAssassin's daemon, to process an email made of the HTML and
 * plain text given, resolving with its raw response.
 */
export const sendToSpamd = (
  html: string,
  plainText: string,
  { host, port, timeout = 10_000 }: SpamdOptions,
) => {
  return new Promise<string>((resolve, reject) => {
    if (!host || !port) {
      reject(
        new Error('Host and port for spam assassin must be specified', {
          cause: { host, port },
        }),
      );
      return;
    }

    const connection = net.createConnection({
      host,
      port: Number.parseInt(String(port), 10),
    });
    connection.setTimeout(timeout, () => {
      reject(
        new Error('Timed out trying to connect to spamc', {
          cause: { port, host },
        }),
      );
      connection.destroy();
    });

    connection.on('connect', () => {
      const boundary = `Part_${crypto.randomBytes(16).toString('hex')}`;
      const message = [
        'MIME-Version: 1.0',
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        '',
        `--${boundary}`,
        'Content-Type: text/html; charset="UTF-8"',
        `Content-Length: ${Buffer.byteLength(html.trim())}`,
        '',
        html.trim(),
        '',
        `--${boundary}`,
        'Content-Type: text/plain; charset="UTF-8"',
        `Content-Length: ${Buffer.byteLength(plainText.trim())}`,
        '',
        plainText.trim(),
        '',
        `--${boundary}--`,
        '',
      ].join('\r\n');

      const command = [
        'PROCESS SPAMC/1.5',
        `Content-length: ${Buffer.byteLength(message)}`,
        '',
        message,
      ].join('\r\n');

      connection.write(command);
    });

    connection.on('error', (error) => {
      reject(error);
    });

    // Decoded at the end, a character can be split between two chunks
    const chunks: Buffer[] = [];

    connection.on('data', (buffer: Buffer) => {
      chunks.push(buffer);
    });

    connection.on('close', (hadError) => {
      if (hadError) return;

      resolve(Buffer.concat(chunks).toString('utf8'));
    });
  });
};
