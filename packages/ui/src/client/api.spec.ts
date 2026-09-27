import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { HotReloadChange } from '../shared/types';
import { ApiError, renderEmail, subscribeToHotReload } from './api';

class FakeEventSource {
  static instances: FakeEventSource[] = [];
  listeners = new Map<string, (event: MessageEvent<string>) => void>();
  closed = false;

  constructor(readonly url: string) {
    FakeEventSource.instances.push(this);
  }

  addEventListener(
    type: string,
    listener: (event: MessageEvent<string>) => void,
  ) {
    this.listeners.set(type, listener);
  }

  close() {
    this.closed = true;
  }

  emit(type: string, data: unknown) {
    this.listeners.get(type)?.({
      data: JSON.stringify(data),
    } as MessageEvent<string>);
  }
}

describe('subscribeToHotReload()', () => {
  beforeEach(() => {
    FakeEventSource.instances = [];
    vi.stubGlobal('EventSource', FakeEventSource);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shares a single event stream between subscribers', () => {
    const first = vi.fn();
    const second = vi.fn();

    const unsubscribeFirst = subscribeToHotReload(first);
    const unsubscribeSecond = subscribeToHotReload(second);

    expect(FakeEventSource.instances).toHaveLength(1);
    const source = FakeEventSource.instances[0]!;
    expect(source.url).toBe('/api/events');

    const changes: HotReloadChange[] = [
      { event: 'change', filename: 'welcome.vue' },
    ];
    source.emit('reload', changes);
    expect(first).toHaveBeenCalledWith(changes);
    expect(second).toHaveBeenCalledWith(changes);

    unsubscribeFirst();
    expect(source.closed).toBe(false);
    source.emit('reload', changes);
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(2);

    unsubscribeSecond();
    expect(source.closed).toBe(true);
  });

  it('opens a new stream for subscribers that come after all left', () => {
    subscribeToHotReload(() => {})();
    const unsubscribe = subscribeToHotReload(() => {});

    expect(FakeEventSource.instances).toHaveLength(2);
    expect(FakeEventSource.instances[1]!.closed).toBe(false);
    unsubscribe();
  });
});

describe('renderEmail()', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('posts the slug and the props to render with', async () => {
    const fetch = vi.fn(
      async () =>
        new Response(JSON.stringify({ markup: '<p>Hi</p>' }), { status: 200 }),
    );
    vi.stubGlobal('fetch', fetch);

    await renderEmail('01-Barebone/welcome', { name: 'Carlos' });

    expect(fetch).toHaveBeenCalledWith('/api/render', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: '01-Barebone/welcome',
        props: { name: 'Carlos' },
      }),
    });
  });

  it('rejects with the status of failed requests', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ error: 'No email found for nope.' }), {
            status: 404,
          }),
      ),
    );

    const rejection = renderEmail('nope');
    await expect(rejection).rejects.toBeInstanceOf(ApiError);
    await expect(rejection).rejects.toMatchObject({
      status: 404,
      message: 'No email found for nope.',
    });
  });

  it('rejects failed requests that answer with HTML', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('<!doctype html>', { status: 404 })),
    );

    await expect(renderEmail('nope')).rejects.toMatchObject({ status: 404 });
  });
});
