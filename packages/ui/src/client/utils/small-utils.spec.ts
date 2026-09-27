import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cn } from './cn';
import { debounce } from './debounce';
import { getPreviewPath } from './get-preview-path';
import { isChangeForEmail } from './is-change-for-email';
import { getSearchParam } from './search-params';

describe('cn()', () => {
  it('lets the last of conflicting Tailwind classes win', () => {
    expect(cn('mt-2 mb-2', 'm-0')).toBe('m-0');
    expect(
      cn(
        'h-[calc(100%-3.5rem-2.375rem)]',
        true && 'h-[calc(100%-3.5rem-13rem)]',
      ),
    ).toBe('h-[calc(100%-3.5rem-13rem)]');
    expect(cn('text-slate-11', { 'text-green-11': true })).toBe(
      'text-green-11',
    );
  });

  it('joins classes like class bindings do', () => {
    expect(cn('a', false, undefined, ['b', { c: true, d: false }])).toBe(
      'a b c',
    );
  });
});

describe('debounce()', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls back once calls stop, with the last arguments', () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 300);

    debounced(1);
    vi.advanceTimersByTime(200);
    debounced(2);
    vi.advanceTimersByTime(200);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(2);
  });

  it('can be cancelled and flushed', () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 300);

    debounced('cancelled');
    expect(debounced.isPending()).toBe(true);
    debounced.cancel();
    vi.advanceTimersByTime(300);
    expect(callback).not.toHaveBeenCalled();

    debounced('flushed');
    debounced.flush();
    expect(callback).toHaveBeenCalledWith('flushed');
    expect(debounced.isPending()).toBe(false);
  });
});

describe('getPreviewPath()', () => {
  it('keeps the directories of the slug', () => {
    expect(getPreviewPath('01-Barebone/activation')).toBe(
      '/preview/01-Barebone/activation',
    );
  });

  it('escapes characters with a meaning in URLs', () => {
    expect(getPreviewPath('promos/50%-off#1?')).toBe(
      '/preview/promos/50%25-off%231%3F',
    );
  });
});

describe('isChangeForEmail()', () => {
  it('matches the file of the email, whatever its extension', () => {
    expect(
      isChangeForEmail(
        { event: 'unlink', filename: '01-Barebone/welcome.vue' },
        '01-Barebone/welcome',
      ),
    ).toBe(true);
    expect(
      isChangeForEmail(
        { event: 'change', filename: 'welcome.html' },
        'welcome.html',
      ),
    ).toBe(true);
  });

  it('does not match emails whose names only start the same', () => {
    expect(
      isChangeForEmail(
        { event: 'unlink', filename: '01-Barebone/welcome-bullet-cell.vue' },
        '01-Barebone/welcome',
      ),
    ).toBe(false);
    expect(
      isChangeForEmail(
        { event: 'unlink', filename: '01-Barebone/theme.ts' },
        '01-Barebone/welcome',
      ),
    ).toBe(false);
  });
});

describe('getSearchParam()', () => {
  it('reads query parameters like URLSearchParams does', () => {
    const query = {
      view: 'source',
      dark: '',
      empty: null,
      lang: ['html', 'vue'],
    };

    expect(getSearchParam(query, 'view')).toBe('source');
    expect(getSearchParam(query, 'dark')).toBe('');
    expect(getSearchParam(query, 'empty')).toBe('');
    expect(getSearchParam(query, 'lang')).toBe('html');
    expect(getSearchParam(query, 'missing')).toBeNull();
  });
});
