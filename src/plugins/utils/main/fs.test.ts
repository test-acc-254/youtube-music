import { test, expect, vi } from '@playwright/test';
import fs from 'node:fs';

// Mock node:fs module
vi.mock('node:fs', () => ({
  default: {
    access: vi.fn(),
    constants: {
      F_OK: 0,
    },
  },
}));

import { fileExists } from './fs';

test.describe('fileExists', () => {
  test.beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should call callbackIfExists when file exists', async () => {
    const mockCallback = vi.fn();
    const mockErrorCallback = vi.fn();
    const testPath = '/path/to/existing/file.txt';

    // Mock fs.access to call the callback with no error
    (fs.access as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (path: fs.PathLike, mode: number, callback: (err: NodeJS.ErrnoException | null) => void) => {
        callback(null);
      }
    );

    fileExists(testPath, mockCallback, mockErrorCallback);

    // Wait for async callback
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(fs.access).toHaveBeenCalledTimes(1);
    expect(fs.access).toHaveBeenCalledWith(
      testPath,
      fs.constants.F_OK,
      expect.any(Function)
    );
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockErrorCallback).not.toHaveBeenCalled();
  });

  test('should call callbackIfError when file does not exist', async () => {
    const mockCallback = vi.fn();
    const mockErrorCallback = vi.fn();
    const testPath = '/path/to/nonexistent/file.txt';

    // Mock fs.access to call the callback with an error
    const error = new Error('ENOENT: no such file or directory') as NodeJS.ErrnoException;
    error.code = 'ENOENT';
    (fs.access as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (path: fs.PathLike, mode: number, callback: (err: NodeJS.ErrnoException | null) => void) => {
        callback(error);
      }
    );

    fileExists(testPath, mockCallback, mockErrorCallback);

    // Wait for async callback
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(fs.access).toHaveBeenCalledTimes(1);
    expect(mockCallback).not.toHaveBeenCalled();
    expect(mockErrorCallback).toHaveBeenCalledTimes(1);
  });

  test('should not throw when callbackIfError is undefined and file does not exist', async () => {
    const mockCallback = vi.fn();
    const testPath = '/path/to/nonexistent/file.txt';

    const error = new Error('ENOENT: no such file or directory') as NodeJS.ErrnoException;
    error.code = 'ENOENT';
    (fs.access as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (path: fs.PathLike, mode: number, callback: (err: NodeJS.ErrnoException | null) => void) => {
        callback(error);
      }
    );

    // Should not throw
    expect(() => {
      fileExists(testPath, mockCallback);
    }).not.toThrow();

    // Wait for async callback
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('should handle permission errors', async () => {
    const mockCallback = vi.fn();
    const mockErrorCallback = vi.fn();
    const testPath = '/path/to/restricted/file.txt';

    const error = new Error('EACCES: permission denied') as NodeJS.ErrnoException;
    error.code = 'EACCES';
    (fs.access as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (path: fs.PathLike, mode: number, callback: (err: NodeJS.ErrnoException | null) => void) => {
        callback(error);
      }
    );

    fileExists(testPath, mockCallback, mockErrorCallback);

    // Wait for async callback
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(mockCallback).not.toHaveBeenCalled();
    expect(mockErrorCallback).toHaveBeenCalledTimes(1);
  });

  test('should work with multiple sequential calls', async () => {
    const mockCallback1 = vi.fn();
    const mockCallback2 = vi.fn();
    const mockErrorCallback = vi.fn();

    // First call - file exists
    (fs.access as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(
      (path: fs.PathLike, mode: number, callback: (err: NodeJS.ErrnoException | null) => void) => {
        callback(null);
      }
    );

    fileExists('/path/to/file1.txt', mockCallback1, mockErrorCallback);

    // Second call - file doesn't exist
    const error = new Error('ENOENT') as NodeJS.ErrnoException;
    (fs.access as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(
      (path: fs.PathLike, mode: number, callback: (err: NodeJS.ErrnoException | null) => void) => {
        callback(error);
      }
    );

    fileExists('/path/to/file2.txt', mockCallback2, mockErrorCallback);

    // Wait for async callbacks
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(mockCallback1).toHaveBeenCalledTimes(1);
    expect(mockCallback2).not.toHaveBeenCalled();
    expect(mockErrorCallback).toHaveBeenCalledTimes(1);
  });

  test('should handle different path types', async () => {
    const mockCallback = vi.fn();

    (fs.access as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (path: fs.PathLike, mode: number, callback: (err: NodeJS.ErrnoException | null) => void) => {
        callback(null);
      }
    );

    // Test with string path
    fileExists('/path/to/file.txt', mockCallback);
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(mockCallback).toHaveBeenCalledTimes(1);

    // Test with Buffer path
    mockCallback.mockClear();
    fileExists(Buffer.from('/path/to/file.txt'), mockCallback);
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(mockCallback).toHaveBeenCalledTimes(1);

    // Test with URL path
    mockCallback.mockClear();
    fileExists(new URL('file:///path/to/file.txt'), mockCallback);
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test('should handle edge case with empty callbacks', async () => {
    const testPath = '/path/to/file.txt';

    (fs.access as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (path: fs.PathLike, mode: number, callback: (err: NodeJS.ErrnoException | null) => void) => {
        callback(null);
      }
    );

    // Empty callback should not throw
    expect(() => {
      fileExists(testPath, () => {});
    }).not.toThrow();
  });
});
