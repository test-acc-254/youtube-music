import { describe, it, expect, vi } from 'vitest';
import {
  singleton,
  debounce,
  cache,
  cacheNoArgs,
  throttle,
  memoize,
  retry,
} from './decorators';

describe('singleton', () => {
  it('should call the wrapped function only once', () => {
    const fn = vi.fn(() => 42);
    const wrapped = singleton(fn);

    expect(wrapped()).toBe(42);
    expect(wrapped()).toBeUndefined();
    expect(wrapped()).toBeUndefined();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should return undefined on subsequent calls', () => {
    const wrapped = singleton(() => 'value');
    wrapped();
    expect(wrapped()).toBeUndefined();
  });

  it('should work with different argument types', () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const wrapped = singleton(fn);

    expect(wrapped(1, 2)).toBe(3);
    expect(wrapped(3, 4)).toBeUndefined();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1, 2);
  });
});

describe('debounce', () => {
  it('should debounce function calls', async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced();
    debounced();

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('should call with the latest arguments', async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('a');
    debounced('b');
    debounced('c');

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith('c');

    vi.useRealTimers();
  });

  it('should reset timer on each call', async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    vi.advanceTimersByTime(50);
    debounced();
    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});

describe('cache', () => {
  it('should cache the result for identical arguments', () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const cached = cache(fn);

    expect(cached(1, 2)).toBe(3);
    expect(cached(1, 2)).toBe(3);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should recompute when arguments change', () => {
    const fn = vi.fn((a: number) => a * 2);
    const cached = cache(fn);

    expect(cached(1)).toBe(2);
    expect(cached(2)).toBe(4);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should handle single argument', () => {
    const fn = vi.fn((x: number) => x * x);
    const cached = cache(fn);

    expect(cached(5)).toBe(25);
    expect(cached(5)).toBe(25);
    expect(cached(6)).toBe(36);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('cacheNoArgs', () => {
  it('should cache the result of a no-arg function', () => {
    const fn = vi.fn(() => ({ count: 0 }));
    const cached = cacheNoArgs(fn);

    const result1 = cached();
    const result2 = cached();
    expect(result1).toBe(result2);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should return the cached value on subsequent calls', () => {
    let counter = 0;
    const fn = vi.fn(() => ++counter);
    const cached = cacheNoArgs(fn);

    expect(cached()).toBe(1);
    expect(cached()).toBe(1);
    expect(cached()).toBe(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('throttle', () => {
  it('should throttle function calls', async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    vi.runOnlyPendingTimers();
    expect(fn).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  it('should allow trailing call after delay', async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(50);
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(50);
    vi.runOnlyPendingTimers();
    expect(fn).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });
});

describe('memoize', () => {
  it('should memoize results based on arguments', () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const memoized = memoize(fn);

    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should return different results for different arguments', () => {
    const fn = vi.fn((x: number) => x * 2);
    const memoized = memoize(fn);

    expect(memoized(1)).toBe(2);
    expect(memoized(2)).toBe(4);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should handle object arguments via JSON.stringify', () => {
    const fn = vi.fn((obj: { a: number }) => obj.a * 2);
    const memoized = memoize(fn);

    expect(memoized({ a: 1 })).toBe(2);
    expect(memoized({ a: 1 })).toBe(2);
    expect(memoized({ a: 2 })).toBe(4);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('retry', () => {
  it('should retry on failure and succeed', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce('success');

    const wrapped = retry(fn, { retries: 2, delay: 10 });
    await expect(wrapped()).resolves.toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should throw after all retries exhausted', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('persistent failure'));
    const wrapped = retry(fn, { retries: 3, delay: 10 });

    await expect(wrapped()).rejects.toThrow('persistent failure');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should succeed on first try', async () => {
    const fn = vi.fn().mockResolvedValue('immediate');
    const wrapped = retry(fn, { retries: 3, delay: 10 });

    await expect(wrapped()).resolves.toBe('immediate');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should use default options when not specified', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('fail'));
    const wrapped = retry(fn);

    await expect(wrapped()).rejects.toThrow('fail');
    expect(fn).toHaveBeenCalledTimes(3);
  });
});