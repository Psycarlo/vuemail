import { beforeEach, describe, expect, it, vi } from 'vitest';

const { resendSendMock, resendApiKeys } = vi.hoisted(() => ({
  resendSendMock: vi.fn(),
  resendApiKeys: [] as string[],
}));

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: resendSendMock };

    constructor(apiKey: string) {
      resendApiKeys.push(apiKey);
    }
  },
}));

// Imported after vi.mock declarations so the mocks apply.
import { createRateLimiter, type RateLimiter } from './rate-limiter';
import { sendTestEmail } from './send-test';

const limiter = (allowed = true) => {
  const consume = vi.fn<RateLimiter['consume']>(() => ({
    allowed,
    retryAfter: allowed ? 0 : 60,
  }));
  return { consume };
};

const validBody = {
  to: 'felipe@example.com',
  subject: 'hello',
  html: '<p>hi</p>',
};

describe('sendTestEmail()', () => {
  let ipLimiter: ReturnType<typeof limiter>;
  let recipientLimiter: ReturnType<typeof limiter>;

  const send = (body: unknown) =>
    sendTestEmail(body, {
      ip: '127.0.0.1',
      resendApiKey: 'fake-resend-key',
      ipLimiter,
      recipientLimiter,
    });

  beforeEach(() => {
    vi.clearAllMocks();
    resendApiKeys.length = 0;
    ipLimiter = limiter();
    recipientLimiter = limiter();
    resendSendMock.mockResolvedValue({ data: { id: 'fake-id' }, error: null });
  });

  it('sends the email when both limiters pass', async () => {
    const response = await send(validBody);

    expect(response).toEqual({
      status: 200,
      body: { message: 'Test email sent' },
    });
    expect(resendApiKeys).toEqual(['fake-resend-key']);
    expect(resendSendMock).toHaveBeenCalledWith({
      from: 'Vuemail <preview@vuemail.dev>',
      to: ['felipe@example.com'],
      subject: 'hello',
      html: '<p>hi</p>',
    });
  });

  it('returns 400 when the body is not a valid email', async () => {
    const response = await send({ ...validBody, to: 'not-an-email' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(ipLimiter.consume).not.toHaveBeenCalled();
    expect(recipientLimiter.consume).not.toHaveBeenCalled();
    expect(resendSendMock).not.toHaveBeenCalled();
  });

  it('returns 400 when a required body field is missing', async () => {
    const response = await send({ to: 'felipe@example.com' });

    expect(response.status).toBe(400);
    expect(resendSendMock).not.toHaveBeenCalled();
  });

  it('returns 400 when there is no body to read', async () => {
    const response = await send(undefined);

    expect(response.status).toBe(400);
    expect(resendSendMock).not.toHaveBeenCalled();
  });

  it('returns 429 when the per-IP limiter denies', async () => {
    ipLimiter = limiter(false);

    const response = await send(validBody);

    expect(response).toEqual({
      status: 429,
      body: { error: 'Rate limit exceeded' },
    });
    expect(resendSendMock).not.toHaveBeenCalled();
  });

  it('returns 429 when the per-recipient limiter denies', async () => {
    recipientLimiter = limiter(false);

    const response = await send(validBody);

    expect(response.status).toBe(429);
    expect(resendSendMock).not.toHaveBeenCalled();
  });

  it('returns 429 when both limiters deny', async () => {
    ipLimiter = limiter(false);
    recipientLimiter = limiter(false);

    const response = await send(validBody);

    expect(response.status).toBe(429);
    expect(resendSendMock).not.toHaveBeenCalled();
  });

  it('keys the recipient limiter on the lowercased address', async () => {
    await send({ ...validBody, to: 'Felipe@Example.COM' });

    expect(recipientLimiter.consume).toHaveBeenCalledWith('felipe@example.com');
  });

  it('keys the ip limiter on the request IP', async () => {
    await send(validBody);

    expect(ipLimiter.consume).toHaveBeenCalledWith('127.0.0.1');
  });

  it('returns 500 when the underlying send throws', async () => {
    resendSendMock.mockRejectedValue(new Error('Resend down'));

    const response = await send(validBody);

    expect(response).toEqual({ status: 500, body: { error: 'Resend down' } });
  });

  it('returns 500 when Resend answers with an error', async () => {
    resendSendMock.mockResolvedValue({
      data: null,
      error: { name: 'validation_error', message: 'Invalid `from` field.' },
    });

    const response = await send(validBody);

    expect(response).toEqual({
      status: 500,
      body: { error: 'Invalid `from` field.' },
    });
  });

  it('allows three emails a minute to the same recipient', async () => {
    const recipientRatelimit = createRateLimiter({ points: 3, duration: 60 });
    recipientLimiter.consume.mockImplementation(recipientRatelimit.consume);

    const statuses: number[] = [];
    for (let i = 0; i < 4; i++) {
      statuses.push((await send(validBody)).status);
    }

    expect(statuses).toEqual([200, 200, 200, 429]);
    expect(resendSendMock).toHaveBeenCalledTimes(3);
  });
});
