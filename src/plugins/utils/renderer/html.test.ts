import { test, expect, vi } from '@playwright/test';
import { ElementFromHtml, ImageElementFromSrc } from './html';

// Mock the trusted-types utility
vi.mock('@/utils/trusted-types', () => ({
  defaultTrustedTypePolicy: {
    createHTML: vi.fn((html: string) => html),
  },
}));

test.describe('plugins/utils/renderer/html', () => {
  test.describe('ElementFromHtml', () => {
    test('should create a simple div element from HTML string', () => {
      const html = '<div class="test">Hello World</div>';
      const element = ElementFromHtml(html);

      expect(element.tagName).toBe('DIV');
      expect(element.className).toBe('test');
      expect(element.textContent).toBe('Hello World');
    });

    test('should create element with nested children', () => {
      const html = '<div><span>Nested</span><p>Content</p></div>';
      const element = ElementFromHtml(html);

      expect(element.tagName).toBe('DIV');
      expect(element.children.length).toBe(2);
      expect(element.querySelector('span')?.textContent).toBe('Nested');
      expect(element.querySelector('p')?.textContent).toBe('Content');
    });

    test('should trim whitespace from HTML string', () => {
      const html = '   <div>Test</div>   ';
      const element = ElementFromHtml(html);

      expect(element.tagName).toBe('DIV');
      expect(element.textContent).toBe('Test');
    });

    test('should create element with attributes', () => {
      const html = '<button id="btn-1" data-action="click" disabled>Click Me</button>';
      const element = ElementFromHtml(html) as HTMLButtonElement;

      expect(element.tagName).toBe('BUTTON');
      expect(element.id).toBe('btn-1');
      expect(element.getAttribute('data-action')).toBe('click');
      expect(element.disabled).toBe(true);
      expect(element.textContent).toBe('Click Me');
    });

    test('should create element with inline styles', () => {
      const html = '<div style="color: red; font-size: 16px;">Styled</div>';
      const element = ElementFromHtml(html) as HTMLDivElement;

      expect(element.tagName).toBe('DIV');
      expect(element.style.color).toBe('red');
      expect(element.style.fontSize).toBe('16px');
    });

    test('should handle self-closing elements', () => {
      const html = '<img src="test.jpg" alt="test" />';
      const element = ElementFromHtml(html) as HTMLImageElement;

      expect(element.tagName).toBe('IMG');
      expect(element.src).toContain('test.jpg');
      expect(element.alt).toBe('test');
    });

    test('should create complex nested structure', () => {
      const html = `
        <div class="container">
          <header>
            <h1>Title</h1>
          </header>
          <main>
            <p>Content</p>
          </main>
        </div>
      `;
      const element = ElementFromHtml(html);

      expect(element.className).toBe('container');
      expect(element.querySelector('h1')?.textContent).toBe('Title');
      expect(element.querySelector('p')?.textContent).toBe('Content');
    });

    test('should handle HTML with data attributes', () => {
      const html = '<div data-id="123" data-name="test" data-active="true">Data</div>';
      const element = ElementFromHtml(html);

      expect(element.getAttribute('data-id')).toBe('123');
      expect(element.getAttribute('data-name')).toBe('test');
      expect(element.getAttribute('data-active')).toBe('true');
    });

    test('should create span element', () => {
      const html = '<span class="label">Label Text</span>';
      const element = ElementFromHtml(html);

      expect(element.tagName).toBe('SPAN');
      expect(element.className).toBe('label');
      expect(element.textContent).toBe('Label Text');
    });

    test('should handle empty element', () => {
      const html = '<div></div>';
      const element = ElementFromHtml(html);

      expect(element.tagName).toBe('DIV');
      expect(element.textContent).toBe('');
      expect(element.children.length).toBe(0);
    });

    test('should handle element with class list', () => {
      const html = '<div class="class1 class2 class3">Multi Class</div>';
      const element = ElementFromHtml(html);

      expect(element.classList.contains('class1')).toBe(true);
      expect(element.classList.contains('class2')).toBe(true);
      expect(element.classList.contains('class3')).toBe(true);
    });

    test('should create button element', () => {
      const html = '<button type="submit">Submit</button>';
      const element = ElementFromHtml(html) as HTMLButtonElement;

      expect(element.tagName).toBe('BUTTON');
      expect(element.type).toBe('submit');
      expect(element.textContent).toBe('Submit');
    });

    test('should create input element', () => {
      const html = '<input type="text" placeholder="Enter text" />';
      const element = ElementFromHtml(html) as HTMLInputElement;

      expect(element.tagName).toBe('INPUT');
      expect(element.type).toBe('text');
      expect(element.placeholder).toBe('Enter text');
    });

    test('should use trusted types policy when available', () => {
      const { defaultTrustedTypePolicy } = require('@/utils/trusted-types');
      const html = '<div>Trusted Content</div>';

      ElementFromHtml(html);

      expect(defaultTrustedTypePolicy.createHTML).toHaveBeenCalledWith(html);
    });
  });

  test.describe('ImageElementFromSrc', () => {
    test('should create image element with src', () => {
      const src = 'https://example.com/image.jpg';
      const img = ImageElementFromSrc(src);

      expect(img.tagName).toBe('IMG');
      expect(img.src).toBe(src);
    });

    test('should create image element with relative path', () => {
      const src = '/images/logo.png';
      const img = ImageElementFromSrc(src);

      expect(img.tagName).toBe('IMG');
      expect(img.src).toContain('logo.png');
    });

    test('should create image element with data URI', () => {
      const src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const img = ImageElementFromSrc(src);

      expect(img.tagName).toBe('IMG');
      expect(img.src).toBe(src);
    });

    test('should create image element with empty src', () => {
      const src = '';
      const img = ImageElementFromSrc(src);

      expect(img.tagName).toBe('IMG');
      expect(img.src).toBeTruthy(); // Will be current page URL
    });

    test('should create multiple distinct image elements', () => {
      const src1 = 'image1.jpg';
      const src2 = 'image2.jpg';
      const img1 = ImageElementFromSrc(src1);
      const img2 = ImageElementFromSrc(src2);

      expect(img1).not.toBe(img2);
      expect(img1.src).toContain(src1);
      expect(img2.src).toContain(src2);
    });

    test('should return HTMLImageElement instance', () => {
      const img = ImageElementFromSrc('test.jpg');

      expect(img).toBeInstanceOf(HTMLImageElement);
    });

    test('should handle special characters in src', () => {
      const src = 'https://example.com/image?query=value&foo=bar#section';
      const img = ImageElementFromSrc(src);

      expect(img.tagName).toBe('IMG');
      expect(img.src).toBe(src);
    });

    test('should handle blob URLs', () => {
      const src = 'blob:https://example.com/12345678-1234-1234-1234-123456789abc';
      const img = ImageElementFromSrc(src);

      expect(img.tagName).toBe('IMG');
      expect(img.src).toBe(src);
    });

    test('should create image that can be appended to DOM', () => {
      const src = 'test-image.jpg';
      const img = ImageElementFromSrc(src);
      const container = document.createElement('div');

      container.appendChild(img);

      expect(container.children.length).toBe(1);
      expect(container.children[0]).toBe(img);
    });
  });
});
