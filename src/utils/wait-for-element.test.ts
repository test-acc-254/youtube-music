import { test, expect } from '@playwright/test';
import { JSDOM } from 'jsdom';

// Mock document for testing
const setupDOM = () => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.document = dom.window.document as unknown as Document;
  return dom;
};

const waitForElement = <T extends Element>(
  selector: string,
): Promise<T> => {
  return new Promise<T>((resolve) => {
    const interval = setInterval(() => {
      const elem = document.querySelector<T>(selector);
      if (!elem) return;

      clearInterval(interval);
      resolve(elem);
    }, 100 /* ms */);
  });
};

test.describe('waitForElement', () => {
  test('should resolve when element is found', async () => {
    const dom = setupDOM();

    // Add element after 200ms
    setTimeout(() => {
      const div = dom.window.document.createElement('div');
      div.id = 'test-element';
      dom.window.document.body.appendChild(div);
    }, 200);

    const element = await waitForElement<HTMLDivElement>('#test-element');

    expect(element).toBeDefined();
    expect(element.id).toBe('test-element');
  });

  test('should resolve with correct element type', async () => {
    const dom = setupDOM();

    const button = dom.window.document.createElement('button');
    button.className = 'test-button';
    button.textContent = 'Click me';
    dom.window.document.body.appendChild(button);

    const element = await waitForElement<HTMLButtonElement>('.test-button');

    expect(element).toBeDefined();
    expect(element.tagName).toBe('BUTTON');
    expect(element.textContent).toBe('Click me');
  });

  test('should wait and resolve for delayed elements', async () => {
    const dom = setupDOM();
    const startTime = Date.now();

    setTimeout(() => {
      const span = dom.window.document.createElement('span');
      span.id = 'delayed-element';
      dom.window.document.body.appendChild(span);
    }, 300);

    const element = await waitForElement<HTMLSpanElement>('#delayed-element');
    const endTime = Date.now();

    expect(element).toBeDefined();
    expect(element.id).toBe('delayed-element');
    expect(endTime - startTime).toBeGreaterThanOrEqual(300);
  });

  test('should resolve immediately if element already exists', async () => {
    const dom = setupDOM();

    const div = dom.window.document.createElement('div');
    div.id = 'existing-element';
    dom.window.document.body.appendChild(div);

    const startTime = Date.now();
    const element = await waitForElement<HTMLDivElement>('#existing-element');
    const endTime = Date.now();

    expect(element).toBeDefined();
    expect(element.id).toBe('existing-element');
    // Should resolve quickly (within first check interval)
    expect(endTime - startTime).toBeLessThan(150);
  });

  test('should work with complex selectors', async () => {
    const dom = setupDOM();

    const container = dom.window.document.createElement('div');
    container.className = 'container';
    const innerDiv = dom.window.document.createElement('div');
    innerDiv.className = 'inner';
    innerDiv.setAttribute('data-testid', 'complex-element');
    container.appendChild(innerDiv);
    dom.window.document.body.appendChild(container);

    const element = await waitForElement<HTMLDivElement>('.container .inner[data-testid="complex-element"]');

    expect(element).toBeDefined();
    expect(element.className).toBe('inner');
    expect(element.getAttribute('data-testid')).toBe('complex-element');
  });

  test('should handle multiple elements and return first match', async () => {
    const dom = setupDOM();

    const div1 = dom.window.document.createElement('div');
    div1.className = 'multiple';
    div1.id = 'first';
    const div2 = dom.window.document.createElement('div');
    div2.className = 'multiple';
    div2.id = 'second';

    dom.window.document.body.appendChild(div1);
    dom.window.document.body.appendChild(div2);

    const element = await waitForElement<HTMLDivElement>('.multiple');

    expect(element).toBeDefined();
    expect(element.id).toBe('first');
  });
});
