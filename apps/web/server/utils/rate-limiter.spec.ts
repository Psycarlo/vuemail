import { describe, expect, it } from 'vitest';
import { createRateLimiter } from './rate-limiter';

const clock = () => {
  let time = 1_000_000;
  return {
    now: () => time,
    advance: (milliseconds: number) => {
      time += milliseconds;
    },
  };
};

describe('createRateLimiter()', () => {
  it('allows as many consumptions as it has points', () => {
    const { now } = clock();
    const limiter = createRateLimiter({ points: 3, duration: 60, now });

    expect(
      Array.from({ length: 4 }, () => limiter.consume('127.0.0.1').allowed),
    ).toEqual([true, true, true, false]);
  });

  it('tells how long until the key has points again', () => {
    const { now, advance } = clock();
    const limiter = createRateLimiter({ points: 1, duration: 60, now });

    limiter.consume('127.0.0.1');
    advance(20_500);

    expect(limiter.consume('127.0.0.1')).toEqual({
      allowed: false,
      retryAfter: 40,
    });
  });

  it('counts the points of each key apart', () => {
    const { now } = clock();
    const limiter = createRateLimiter({ points: 1, duration: 60, now });

    expect(limiter.consume('a@example.com').allowed).toBe(true);
    expect(limiter.consume('b@example.com').allowed).toBe(true);
    expect(limiter.consume('a@example.com').allowed).toBe(false);
  });

  it('gives the points back once the window is over', () => {
    const { now, advance } = clock();
    const limiter = createRateLimiter({ points: 2, duration: 60, now });

    limiter.consume('127.0.0.1');
    limiter.consume('127.0.0.1');
    advance(59_999);
    expect(limiter.consume('127.0.0.1').allowed).toBe(false);

    advance(1);
    expect(limiter.consume('127.0.0.1').allowed).toBe(true);
    expect(limiter.consume('127.0.0.1').allowed).toBe(true);
    expect(limiter.consume('127.0.0.1').allowed).toBe(false);
  });

  it('starts the window of a key at its first consumption', () => {
    const { now, advance } = clock();
    const limiter = createRateLimiter({ points: 1, duration: 60, now });

    limiter.consume('a');
    advance(30_000);
    limiter.consume('b');
    advance(30_000);

    expect(limiter.consume('a').allowed).toBe(true);
    expect(limiter.consume('b').allowed).toBe(false);
  });
});
