import { describe, it, expect, beforeEach } from 'vitest';
import { ElementFromHtml, ImageElementFromSrc } from './html';

describe('ElementFromHtml', () => {
  it('should create an element from an HTML string', () => {
    const el = ElementFromHtml('<div class="test">Hello</div>');
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.tagName).toBe('DIV');
    expect(el.className).toBe('test');
    expect(el.textContent).toBe('Hello');
  });

  it('should handle nested HTML', () => {
    const el = ElementFromHtml('<ul><li>Item 1</li><li>Item 2</li></ul>');
    expect(el.tagName).toBe('UL');
    expect(el.children).toHaveLength(2);
    expect(el.children[0].textContent).toBe('Item 1');
    expect(el.children[1].textContent).toBe('Item 2');
  });

  it('should trim whitespace from the HTML string', () => {
    const el = ElementFromHtml('  <span>Trimmed</span>  ');
    expect(el.tagName).toBe('SPAN');
    expect(el.textContent).toBe('Trimmed');
  });

  it('should return the first element child', () => {
    const el = ElementFromHtml('<p>First</p><p>Second</p>');
    expect(el.tagName).toBe('P');
    expect(el.textContent).toBe('First');
  });

  it('should create an element with attributes', () => {
    const el = ElementFromHtml('<a href="https://example.com" target="_blank">Link</a>');
    expect(el.tagName).toBe('A');
    expect(el.getAttribute('href')).toBe('https://example.com');
    expect(el.getAttribute('target')).toBe('_blank');
  });
});

describe('ImageElementFromSrc', () => {
  it('should create an img element with the given src', () => {
    const img = ImageElementFromSrc('https://example.com/image.jpg');
    expect(img).toBeInstanceOf(HTMLImageElement);
    expect(img.src).toBe('https://example.com/image.jpg');
  });

  it('should handle empty src string', () => {
    const img = ImageElementFromSrc('');
    expect(img).toBeInstanceOf(HTMLImageElement);
    expect(img.src).toBe('');
  });

  it('should handle data URIs', () => {
    const img = ImageElementFromSrc('data:image/png;base64,abc123');
    expect(img.src).toBe('data:image/png;base64,abc123');
  });

  it('should create separate instances for each call', () => {
    const img1 = ImageElementFromSrc('src1');
    const img2 = ImageElementFromSrc('src2');
    expect(img1).not.toBe(img2);
    expect(img1.src).toBe('src1');
    expect(img2.src).toBe('src2');
  });
});