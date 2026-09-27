import { EventEmitter } from 'node:events';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createConnection } = vi.hoisted(() => ({ createConnection: vi.fn() }));
vi.mock('node:net', () => ({
  default: { createConnection },
  createConnection,
}));

// Imported after vi.mock declarations so the mocks apply.
import { checkSpam, checkSpamRequest } from './check-spam';
import { createRateLimiter } from './rate-limiter';

/** Stands for the TCP connection to spamd */
class FakeSocket extends EventEmitter {
  written = '';
  destroyed = false;
  timeout?: { ms: number; onTimeout: () => void };

  setTimeout(ms: number, onTimeout: () => void) {
    this.timeout = { ms, onTimeout };
    return this;
  }

  write(data: string) {
    this.written += data;
    return true;
  }

  destroy() {
    this.destroyed = true;
    return this;
  }
}

/** Makes spamd answer the next connection with the response given. */
const spamdAnswers = (response: string) => {
  const socket = new FakeSocket();
  createConnection.mockImplementationOnce(() => {
    queueMicrotask(() => {
      socket.emit('connect');
      // In two chunks, like TCP can deliver it
      const buffer = Buffer.from(response);
      socket.emit('data', buffer.subarray(0, 10));
      socket.emit('data', buffer.subarray(10));
      socket.emit('close', false);
    });
    return socket;
  });
  return socket;
};

const spamdResponse = (rows: string[]) => `SPAMD/1.1 0 EX_OK
Content-length: 1234
Spam: True ; 10.2 / 5.0

Content analysis details:   (10.2 points, 5.0 required)

 pts rule name              description
---- ---------------------- --------------------------------------------------
${rows.join('\n')}

The original message was not completely plain text, and may be unsafe to
open with some email clients.
`;

const spammyResponse = spamdResponse([
  ' 1.8 MISSING_SUBJECT        Missing Subject: header',
  ' 2.5 MONEY_BACK             BODY: Money back guarantee',
  '-0.0 NO_RECEIVED            Informational: message has no Received headers',
  ' 1.2 MISSING_HEADERS        Missing To: header',
  ' 0.0 HTML_MESSAGE           BODY: HTML included in message',
  ' 0.1 FAKE_HEADER_RULE       Something about the envelope',
  ' 2.5 DRUGS_ERECTILE         Refers to an erectile drug',
]);

const spamd = { host: 'spamd.internal', port: '783' };

describe('checkSpam()', () => {
  beforeEach(() => {
    createConnection.mockReset();
  });

  it('scores the email with the rules that are not about headers', async () => {
    spamdAnswers(spammyResponse);

    expect(await checkSpam('<p>Hi</p>', 'Hi', spamd)).toEqual({
      checks: [
        {
          name: 'MONEY_BACK',
          description: 'BODY: Money back guarantee',
          points: 2.5,
        },
        {
          name: 'DRUGS_ERECTILE',
          description: 'Refers to an erectile drug',
          points: 2.5,
        },
      ],
      isSpam: true,
      points: 5,
    });
  });

  it('is not spam under 5 points', async () => {
    spamdAnswers(
      spamdResponse([
        ' 0.7 MPART_ALT_DIFF         BODY: HTML and text parts are different',
        ' 0.0 HTML_MESSAGE           BODY: HTML included in message',
      ]),
    );

    expect(await checkSpam('<p>Hi</p>', 'Bye', spamd)).toEqual({
      checks: [
        {
          name: 'MPART_ALT_DIFF',
          description: 'BODY: HTML and text parts are different',
          points: 0.7,
        },
      ],
      isSpam: false,
      points: 0.7,
    });
  });

  it('sends a PROCESS command with the HTML and plain text parts to spamd', async () => {
    const socket = spamdAnswers(spammyResponse);

    await checkSpam('  <p>Olá</p>\n', '\nOlá  ', spamd);

    expect(createConnection).toHaveBeenCalledWith({
      host: 'spamd.internal',
      port: 783,
    });
    const headerEnd = socket.written.indexOf('\r\n\r\n') + '\r\n\r\n'.length;
    const header = socket.written.slice(0, headerEnd);
    const message = socket.written.slice(headerEnd);
    expect(header).toBe(
      `PROCESS SPAMC/1.5\r\nContent-length: ${Buffer.byteLength(message)}\r\n\r\n`,
    );
    const boundary = message.match(/boundary="(?<boundary>[^"]+)"/)?.groups
      ?.boundary;
    expect(boundary).toMatch(/^Part_[0-9a-f]{32}$/);
    // The lengths are in bytes, `á` taking two
    expect(message).toBe(
      [
        'MIME-Version: 1.0',
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        '',
        `--${boundary}`,
        'Content-Type: text/html; charset="UTF-8"',
        'Content-Length: 11',
        '',
        '<p>Olá</p>',
        '',
        `--${boundary}`,
        'Content-Type: text/plain; charset="UTF-8"',
        'Content-Length: 4',
        '',
        'Olá',
        '',
        `--${boundary}--`,
        '',
      ].join('\r\n'),
    );
  });

  it('requires the host and port of spamd', async () => {
    await expect(
      checkSpam('<p>Hi</p>', 'Hi', { host: '', port: '783' }),
    ).rejects.toThrow('Host and port for spam assassin must be specified');
    expect(createConnection).not.toHaveBeenCalled();
  });

  it('fails when the connection to spamd fails', async () => {
    const socket = new FakeSocket();
    createConnection.mockImplementationOnce(() => {
      queueMicrotask(() => {
        socket.emit('error', new Error('connect ECONNREFUSED'));
        socket.emit('close', true);
      });
      return socket;
    });

    await expect(checkSpam('<p>Hi</p>', 'Hi', spamd)).rejects.toThrow(
      'connect ECONNREFUSED',
    );
  });

  it('gives up on spamd after the timeout', async () => {
    const socket = new FakeSocket();
    createConnection.mockImplementationOnce(() => socket);

    const result = checkSpam('<p>Hi</p>', 'Hi', { ...spamd, timeout: 500 });
    expect(socket.timeout?.ms).toBe(500);
    socket.timeout?.onTimeout();

    await expect(result).rejects.toThrow(
      'Timed out trying to connect to spamc',
    );
    expect(socket.destroyed).toBe(true);
  });

  it('fails when spamd answers without the table of points', async () => {
    spamdAnswers('SPAMD/1.0 76 Bad header line: (EOF)\r\n');

    await expect(checkSpam('<p>Hi</p>', 'Hi', spamd)).rejects.toThrow(
      'Could not find spam checking points table',
    );
  });
});

describe('checkSpamRequest()', () => {
  beforeEach(() => {
    createConnection.mockReset();
  });

  const allowAll = () => createRateLimiter({ points: 100, duration: 60 });

  it('answers with the result of the check', async () => {
    spamdAnswers(spammyResponse);

    const response = await checkSpamRequest(
      { html: '<p>Hi</p>', plainText: 'Hi' },
      { ip: '127.0.0.1', limiter: allowAll(), spamd },
    );

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ isSpam: true, points: 5 });
  });

  it('answers with 400 when the body is not valid', async () => {
    const response = await checkSpamRequest(
      { html: '<p>Hi</p>' },
      { ip: '127.0.0.1', limiter: allowAll(), spamd },
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(createConnection).not.toHaveBeenCalled();
  });

  it('answers with 400 when there is no body', async () => {
    const response = await checkSpamRequest(undefined, {
      ip: '127.0.0.1',
      limiter: allowAll(),
      spamd,
    });

    expect(response.status).toBe(400);
  });

  it('answers with 500 when spamd is not configured', async () => {
    const response = await checkSpamRequest(
      { html: '<p>Hi</p>', plainText: 'Hi' },
      { ip: '127.0.0.1', limiter: allowAll(), spamd: {} },
    );

    expect(response).toEqual({
      status: 500,
      body: { error: 'Host and port for spam assassin must be specified' },
    });
  });

  it('answers with 429 once the IP checked too many emails', async () => {
    const limiter = createRateLimiter({ points: 1, duration: 60 });
    spamdAnswers(spammyResponse);
    const body = { html: '<p>Hi</p>', plainText: 'Hi' };

    const first = await checkSpamRequest(body, {
      ip: '10.0.0.1',
      limiter,
      spamd,
    });
    const second = await checkSpamRequest(body, {
      ip: '10.0.0.1',
      limiter,
      spamd,
    });

    expect(first.status).toBe(200);
    expect(second).toEqual({
      status: 429,
      body: { error: 'Rate limit exceeded' },
    });
    expect(createConnection).toHaveBeenCalledTimes(1);
  });
});
