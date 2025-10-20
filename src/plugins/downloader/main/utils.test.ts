import { test, expect, vi } from '@playwright/test';
import { app, BrowserWindow, nativeImage } from 'electron';
import { getFolder, sendFeedback, cropMaxWidth, setBadge } from './utils';

// Mock electron modules
vi.mock('electron', () => ({
  app: {
    getPath: vi.fn(),
    setBadgeCount: vi.fn(),
  },
  BrowserWindow: vi.fn(),
  nativeImage: {},
}));

vi.mock('electron-is', () => ({
  default: {
    linux: vi.fn(),
    macOS: vi.fn(),
  },
}));

test.describe('downloader/main/utils', () => {
  test.describe('getFolder', () => {
    test('should return custom folder when provided', () => {
      const customFolder = '/custom/path';
      const result = getFolder(customFolder);
      expect(result).toBe(customFolder);
    });

    test('should return downloads path when no custom folder provided', () => {
      const downloadsPath = '/home/user/downloads';
      vi.mocked(app.getPath).mockReturnValue(downloadsPath);

      const result = getFolder();

      expect(app.getPath).toHaveBeenCalledWith('downloads');
      expect(result).toBe(downloadsPath);
    });

    test('should handle undefined custom folder', () => {
      const downloadsPath = '/home/user/downloads';
      vi.mocked(app.getPath).mockReturnValue(downloadsPath);

      const result = getFolder(undefined);

      expect(result).toBe(downloadsPath);
    });
  });

  test.describe('sendFeedback', () => {
    test('should send downloader-feedback event to window', () => {
      const mockWebContents = {
        send: vi.fn(),
      };
      const mockWindow = {
        webContents: mockWebContents,
      } as unknown as BrowserWindow;
      const message = { status: 'success', progress: 100 };

      sendFeedback(mockWindow, message);

      expect(mockWebContents.send).toHaveBeenCalledWith('downloader-feedback', message);
    });

    test('should handle undefined message', () => {
      const mockWebContents = {
        send: vi.fn(),
      };
      const mockWindow = {
        webContents: mockWebContents,
      } as unknown as BrowserWindow;

      sendFeedback(mockWindow);

      expect(mockWebContents.send).toHaveBeenCalledWith('downloader-feedback', undefined);
    });

    test('should handle various message types', () => {
      const mockWebContents = {
        send: vi.fn(),
      };
      const mockWindow = {
        webContents: mockWebContents,
      } as unknown as BrowserWindow;

      // Test with string
      sendFeedback(mockWindow, 'test message');
      expect(mockWebContents.send).toHaveBeenLastCalledWith('downloader-feedback', 'test message');

      // Test with number
      sendFeedback(mockWindow, 42);
      expect(mockWebContents.send).toHaveBeenLastCalledWith('downloader-feedback', 42);

      // Test with null
      sendFeedback(mockWindow, null);
      expect(mockWebContents.send).toHaveBeenLastCalledWith('downloader-feedback', null);
    });
  });

  test.describe('cropMaxWidth', () => {
    test('should crop image with standard YouTube dimensions (1280x720)', () => {
      const mockCrop = vi.fn().mockReturnValue('cropped-image');
      const mockImage = {
        getSize: vi.fn().mockReturnValue({ width: 1280, height: 720 }),
        crop: mockCrop,
      } as unknown as Electron.NativeImage;

      const result = cropMaxWidth(mockImage);

      expect(mockImage.getSize).toHaveBeenCalled();
      expect(mockCrop).toHaveBeenCalledWith({
        x: 280,
        y: 0,
        width: 720,
        height: 720,
      });
      expect(result).toBe('cropped-image');
    });

    test('should return original image if dimensions do not match', () => {
      const mockImage = {
        getSize: vi.fn().mockReturnValue({ width: 1920, height: 1080 }),
        crop: vi.fn(),
      } as unknown as Electron.NativeImage;

      const result = cropMaxWidth(mockImage);

      expect(mockImage.getSize).toHaveBeenCalled();
      expect(mockImage.crop).not.toHaveBeenCalled();
      expect(result).toBe(mockImage);
    });

    test('should return original image for square dimensions', () => {
      const mockImage = {
        getSize: vi.fn().mockReturnValue({ width: 720, height: 720 }),
        crop: vi.fn(),
      } as unknown as Electron.NativeImage;

      const result = cropMaxWidth(mockImage);

      expect(mockImage.crop).not.toHaveBeenCalled();
      expect(result).toBe(mockImage);
    });

    test('should return original image for small dimensions', () => {
      const mockImage = {
        getSize: vi.fn().mockReturnValue({ width: 100, height: 100 }),
        crop: vi.fn(),
      } as unknown as Electron.NativeImage;

      const result = cropMaxWidth(mockImage);

      expect(mockImage.crop).not.toHaveBeenCalled();
      expect(result).toBe(mockImage);
    });
  });

  test.describe('setBadge', () => {
    const is = require('electron-is').default;

    test('should set badge count on Linux', () => {
      is.linux.mockReturnValue(true);
      is.macOS.mockReturnValue(false);

      setBadge(5);

      expect(app.setBadgeCount).toHaveBeenCalledWith(5);
    });

    test('should set badge count on macOS', () => {
      is.linux.mockReturnValue(false);
      is.macOS.mockReturnValue(true);

      setBadge(10);

      expect(app.setBadgeCount).toHaveBeenCalledWith(10);
    });

    test('should not set badge count on Windows', () => {
      is.linux.mockReturnValue(false);
      is.macOS.mockReturnValue(false);
      vi.mocked(app.setBadgeCount).mockClear();

      setBadge(3);

      expect(app.setBadgeCount).not.toHaveBeenCalled();
    });

    test('should handle zero badge count', () => {
      is.linux.mockReturnValue(true);
      is.macOS.mockReturnValue(false);

      setBadge(0);

      expect(app.setBadgeCount).toHaveBeenCalledWith(0);
    });

    test('should handle large badge count', () => {
      is.linux.mockReturnValue(false);
      is.macOS.mockReturnValue(true);

      setBadge(999);

      expect(app.setBadgeCount).toHaveBeenCalledWith(999);
    });
  });
});
