import { test, expect, vi, beforeEach } from '@playwright/test';
import fs from 'node:fs';
import { EventEmitter } from 'events';

// Mock fs module
vi.mock('node:fs', () => ({
  default: {
    readFileSync: vi.fn(),
  },
}));

// Mock WebContents
class MockWebContents extends EventEmitter {
  insertCSS = vi.fn();
  removeInsertedCSS = vi.fn();

  constructor() {
    super();
  }
}

import { injectCSS, injectCSSAsFile } from './css';

test.describe('CSS Injection Utils', () => {
  let mockWebContents: MockWebContents;

  beforeEach(() => {
    mockWebContents = new MockWebContents();
    vi.clearAllMocks();
  });

  test.describe('injectCSS', () => {
    test('should inject CSS when page is already loaded', async () => {
      const cssContent = '.test { color: red; }';
      const cssKey = 'test-key-123';

      mockWebContents.insertCSS.mockResolvedValue(cssKey);
      mockWebContents.removeInsertedCSS.mockResolvedValue(undefined);

      // Simulate page already loaded
      mockWebContents.emit('did-finish-load');

      const unregister = await injectCSS(mockWebContents as unknown as Electron.WebContents, cssContent);

      expect(mockWebContents.insertCSS).toHaveBeenCalledWith(cssContent);
      expect(mockWebContents.insertCSS).toHaveBeenCalledTimes(1);

      // Test unregister function
      await unregister();
      expect(mockWebContents.removeInsertedCSS).toHaveBeenCalledWith(cssKey);
    });

    test('should queue CSS injection when page is not loaded', async () => {
      const cssContent = '.test { color: blue; }';
      const cssKey = 'test-key-456';

      mockWebContents.insertCSS.mockResolvedValue(cssKey);

      const injectionPromise = injectCSS(mockWebContents as unknown as Electron.WebContents, cssContent);

      // CSS should not be inserted yet
      expect(mockWebContents.insertCSS).not.toHaveBeenCalled();

      // Trigger did-finish-load event
      mockWebContents.emit('did-finish-load');

      const unregister = await injectionPromise;

      expect(mockWebContents.insertCSS).toHaveBeenCalledWith(cssContent);
      expect(typeof unregister).toBe('function');
    });

    test('should handle multiple CSS injections', async () => {
      const css1 = '.test1 { color: red; }';
      const css2 = '.test2 { color: blue; }';
      const key1 = 'key-1';
      const key2 = 'key-2';

      mockWebContents.insertCSS
        .mockResolvedValueOnce(key1)
        .mockResolvedValueOnce(key2);

      // Simulate page already loaded
      mockWebContents.emit('did-finish-load');

      const unregister1 = await injectCSS(mockWebContents as unknown as Electron.WebContents, css1);
      const unregister2 = await injectCSS(mockWebContents as unknown as Electron.WebContents, css2);

      expect(mockWebContents.insertCSS).toHaveBeenCalledTimes(2);
      expect(mockWebContents.insertCSS).toHaveBeenCalledWith(css1);
      expect(mockWebContents.insertCSS).toHaveBeenCalledWith(css2);

      // Test both unregister functions
      await unregister1();
      await unregister2();

      expect(mockWebContents.removeInsertedCSS).toHaveBeenCalledWith(key1);
      expect(mockWebContents.removeInsertedCSS).toHaveBeenCalledWith(key2);
    });

    test('should inject queued CSS on did-finish-load event', async () => {
      const css1 = '.queued1 { color: green; }';
      const css2 = '.queued2 { color: yellow; }';

      mockWebContents.insertCSS
        .mockResolvedValueOnce('key1')
        .mockResolvedValueOnce('key2');

      const promise1 = injectCSS(mockWebContents as unknown as Electron.WebContents, css1);
      const promise2 = injectCSS(mockWebContents as unknown as Electron.WebContents, css2);

      // Not loaded yet
      expect(mockWebContents.insertCSS).not.toHaveBeenCalled();

      // Trigger load
      mockWebContents.emit('did-finish-load');

      await Promise.all([promise1, promise2]);

      expect(mockWebContents.insertCSS).toHaveBeenCalledTimes(2);
    });

    test('should handle empty CSS string', async () => {
      const cssKey = 'empty-key';
      mockWebContents.insertCSS.mockResolvedValue(cssKey);
      mockWebContents.emit('did-finish-load');

      const unregister = await injectCSS(mockWebContents as unknown as Electron.WebContents, '');

      expect(mockWebContents.insertCSS).toHaveBeenCalledWith('');
      expect(typeof unregister).toBe('function');
    });
  });

  test.describe('injectCSSAsFile', () => {
    test('should read file and inject CSS when page is loaded', async () => {
      const filepath = '/path/to/style.css';
      const cssContent = '.file-test { margin: 10px; }';
      const cssKey = 'file-key-123';

      (fs.readFileSync as unknown as ReturnType<typeof vi.fn>).mockReturnValue(cssContent);
      mockWebContents.insertCSS.mockResolvedValue(cssKey);
      mockWebContents.removeInsertedCSS.mockResolvedValue(undefined);

      // Simulate page already loaded
      mockWebContents.emit('did-finish-load');

      const unregister = await injectCSSAsFile(mockWebContents as unknown as Electron.WebContents, filepath);

      expect(fs.readFileSync).toHaveBeenCalledWith(filepath, 'utf-8');
      expect(mockWebContents.insertCSS).toHaveBeenCalledWith(cssContent);

      // Test unregister
      await unregister();
      expect(mockWebContents.removeInsertedCSS).toHaveBeenCalledWith(cssKey);
    });

    test('should queue file CSS injection when page is not loaded', async () => {
      const filepath = '/path/to/queued.css';
      const cssContent = '.queued-file { padding: 5px; }';
      const cssKey = 'queued-file-key';

      (fs.readFileSync as unknown as ReturnType<typeof vi.fn>).mockReturnValue(cssContent);
      mockWebContents.insertCSS.mockResolvedValue(cssKey);

      const injectionPromise = injectCSSAsFile(mockWebContents as unknown as Electron.WebContents, filepath);

      // Should not read file or inject yet
      expect(mockWebContents.insertCSS).not.toHaveBeenCalled();

      // Trigger load
      mockWebContents.emit('did-finish-load');

      const unregister = await injectionPromise;

      expect(fs.readFileSync).toHaveBeenCalledWith(filepath, 'utf-8');
      expect(mockWebContents.insertCSS).toHaveBeenCalledWith(cssContent);
      expect(typeof unregister).toBe('function');
    });

    test('should handle multiple file injections', async () => {
      const file1 = '/path/to/file1.css';
      const file2 = '/path/to/file2.css';
      const css1 = '.file1 {}';
      const css2 = '.file2 {}';

      (fs.readFileSync as unknown as ReturnType<typeof vi.fn>)
        .mockReturnValueOnce(css1)
        .mockReturnValueOnce(css2);

      mockWebContents.insertCSS
        .mockResolvedValueOnce('key1')
        .mockResolvedValueOnce('key2');

      // Simulate page already loaded
      mockWebContents.emit('did-finish-load');

      await injectCSSAsFile(mockWebContents as unknown as Electron.WebContents, file1);
      await injectCSSAsFile(mockWebContents as unknown as Electron.WebContents, file2);

      expect(fs.readFileSync).toHaveBeenCalledTimes(2);
      expect(mockWebContents.insertCSS).toHaveBeenCalledTimes(2);
    });

    test('should handle file read errors gracefully', async () => {
      const filepath = '/nonexistent/file.css';

      (fs.readFileSync as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('File not found');
      });

      // Simulate page already loaded
      mockWebContents.emit('did-finish-load');

      await expect(
        injectCSSAsFile(mockWebContents as unknown as Electron.WebContents, filepath)
      ).rejects.toThrow('File not found');
    });

    test('should handle mixed CSS and file injections', async () => {
      const cssContent = '.inline { color: red; }';
      const filepath = '/path/to/external.css';
      const fileContent = '.external { color: blue; }';

      (fs.readFileSync as unknown as ReturnType<typeof vi.fn>).mockReturnValue(fileContent);
      mockWebContents.insertCSS
        .mockResolvedValueOnce('inline-key')
        .mockResolvedValueOnce('file-key');

      const promise1 = injectCSS(mockWebContents as unknown as Electron.WebContents, cssContent);
      const promise2 = injectCSSAsFile(mockWebContents as unknown as Electron.WebContents, filepath);

      // Trigger load
      mockWebContents.emit('did-finish-load');

      await Promise.all([promise1, promise2]);

      expect(mockWebContents.insertCSS).toHaveBeenCalledTimes(2);
      expect(mockWebContents.insertCSS).toHaveBeenCalledWith(cssContent);
      expect(mockWebContents.insertCSS).toHaveBeenCalledWith(fileContent);
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle rapid consecutive injections', async () => {
      mockWebContents.insertCSS.mockResolvedValue('key');

      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(injectCSS(mockWebContents as unknown as Electron.WebContents, `.test${i} {}`));
      }

      mockWebContents.emit('did-finish-load');

      await Promise.all(promises);

      expect(mockWebContents.insertCSS).toHaveBeenCalledTimes(10);
    });

    test('should handle injection with special characters in CSS', async () => {
      const specialCSS = `.test { content: "Special \\"chars\\" & symbols"; }`;
      mockWebContents.insertCSS.mockResolvedValue('special-key');
      mockWebContents.emit('did-finish-load');

      await injectCSS(mockWebContents as unknown as Electron.WebContents, specialCSS);

      expect(mockWebContents.insertCSS).toHaveBeenCalledWith(specialCSS);
    });
  });
});
