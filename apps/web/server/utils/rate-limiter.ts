export interface RateLimiter {
  /** Takes a point from the key's allowance, if any is left. */
  consume: (key: string) => { allowed: boolean; retryAfter: number };
}

/**
 * A fixed window rate limiter kept in memory: each key gets `points` points to
 * consume in the `duration` seconds that follow its first consumption.
 *
 * It's per server instance, where React Email's website shares a Redis store
 * between all of them.
 */
export function createRateLimiter({
  points,
  duration,
  now = Date.now,
}: {
  points: number;
  /** In seconds */
  duration: number;
  now?: () => number;
}): RateLimiter {
  const windows = new Map<string, { consumed: number; resetsAt: number }>();
  let lastSweep = now();

  // Forgets the keys whose windows ended, so the map doesn't grow forever
  const sweep = (time: number) => {
    if (time - lastSweep < duration * 1000) return;
    lastSweep = time;
    for (const [key, window] of windows) {
      if (window.resetsAt <= time) windows.delete(key);
    }
  };

  return {
    consume(key) {
      const time = now();
      sweep(time);

      const window = windows.get(key);
      if (!window || window.resetsAt <= time) {
        windows.set(key, { consumed: 1, resetsAt: time + duration * 1000 });
        return { allowed: points > 0, retryAfter: 0 };
      }

      if (window.consumed >= points) {
        return {
          allowed: false,
          retryAfter: Math.ceil((window.resetsAt - time) / 1000),
        };
      }

      window.consumed += 1;
      return { allowed: true, retryAfter: 0 };
    },
  };
}

export const sendTestIpRatelimit = createRateLimiter({
  points: 3,
  duration: 60,
});

export const sendTestRecipientRatelimit = createRateLimiter({
  points: 3,
  duration: 60,
});
