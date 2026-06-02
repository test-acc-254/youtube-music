import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { waitForElement } from './wait-for-element';

describe('waitForElement', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should resolve when element appears in DOM', async () => {
    const promise = waitForElement<HTMLDivElement>('#target');

    setTimeout(() => {
      const el = document.createElement('div');
      el.id = 'target';
      document.body.appendChild(el);
    }, 200);

    vi.advanceTimersByTime(300);

    const element = await promise;
    expect(element).toBeInstanceOf(HTMLDivElement);
    expect(element.id).toBe('target');
  });

  it('should not resolve when element never appears (timeout safety)', async () => {
    const promise = waitForElement('#nonexistent');

    let resolved = false;
    promise.then(() => { resolved = true; });

    vi.advanceTimersByTime(1000);
    await vi.runAllTimersAsync();

    expect(resolved).toBe(false);
  });

  it('should resolve with correct element type', async () => {
    const promise = waitForElement<HTMLSpanElement>('span.test-class');

    setTimeout(() => {
      const el = document.createElement('span');
      el.className = 'test-class';
      document.body.appendChild(el);
    }, 50);

    vi.advanceTimersByTime(100);

    const element = await promise;
    expect(element.tagName).toBe('SPAN');
  });
});