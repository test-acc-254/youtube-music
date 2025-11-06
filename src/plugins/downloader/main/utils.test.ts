import { test, expect, vi, beforeEach } from '@playwright/test';
import { app, BrowserWindow, NativeImage } from 'electron';
import is from 'electron-is';

// Mock dependencies
vi.mock('electron', () => ({
  app: {
    getPath: vi.fn(),
    setBadgeCount: vi.fn(),
  },
  BrowserWindow: class {
    webContents = {
      send: vi.fn(),
    };
  },
  NativeImage: class {
    getSize = vi.fn();
    crop = vi.fn().mockReturnThis();
  },
}));

vi.mock('electron-is', () => ({
  default: {
    linux: vi.fn(),
    macOS: vi.fn(),
  },
}));

import { getFolder, sendFeedback, cropMaxWidth, setBadge } from './utils';

test.describe('Downloader Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test.describe('getFolder', () => {
    test('should return custom folder when provided', () => {
      const customFolder = '/custom/download/path';
      const result = getFolder(customFolder);

      expect(result).toBe(customFolder);
      expect(app.getPath).not.toHaveBeenCalled();
    });

    test('should return default downloads folder when no custom folder', () => {
      (app.getPath as unknown as ReturnType<typeof vi.fn>).mockReturnValue('/default/downloads');

      const result = getFolder();

      expect(app.getPath).toHaveBeenCalledWith('downloads');
      expect(result).toBe('/default/downloads');
    });

    test('should return default folder when custom folder is undefined', () => {
      (app.getPath as unknown as ReturnType<typeof vi.fn>).mockReturnValue('/default/downloads');

      const result = getFolder(undefined);

      expect(app.getPath).toHaveBeenCalledWith('downloads');
      expect(result).toBe('/default/downloads');
    });

    test('should handle empty string as custom folder', () => {
      const result = getFolder('');

      expect(result).toBe('');
      expect(app.getPath).not.toHaveBeenCalled();
    });

    test('should handle various custom folder paths', () => {
      expect(getFolder('/path/to/folder')).toBe('/path/to/folder');
      expect(getFolder('C:\\Windows\\Downloads')).toBe('C:\\Windows\\Downloads');
      expect(getFolder('~/Downloads')).toBe('~/Downloads');
      expect(getFolder('./relative/path')).toBe('./relative/path');
    });
  });

  test.describe('sendFeedback', () => {
    test('should send feedback message through webContents', () => {
      const mockWin = new BrowserWindow() as unknown as Electron.BrowserWindow;
      const message = { status: 'success', progress: 50 };

      sendFeedback(mockWin, message);

      expect(mockWin.webContents.send).toHaveBeenCalledWith('downloader-feedback', message);
      expect(mockWin.webContents.send).toHaveBeenCalledTimes(1);
    });

    test('should send undefined message', () => {
      const mockWin = new BrowserWindow() as unknown as Electron.BrowserWindow;

      sendFeedback(mockWin, undefined);

      expect(mockWin.webContents.send).toHaveBeenCalledWith('downloader-feedback', undefined);
    });

    test('should send null message', () => {
      const mockWin = new BrowserWindow() as unknown as Electron.BrowserWindow;

      sendFeedback(mockWin, null);

      expect(mockWin.webContents.send).toHaveBeenCalledWith('downloader-feedback', null);
    });

    test('should send string message', () => {
      const mockWin = new BrowserWindow() as unknown as Electron.BrowserWindow;
      const message = 'Download complete';

      sendFeedback(mockWin, message);

      expect(mockWin.webContents.send).toHaveBeenCalledWith('downloader-feedback', message);
    });

    test('should send object message with various properties', () => {
      const mockWin = new BrowserWindow() as unknown as Electron.BrowserWindow;
      const message = {
        id: '123',
        filename: 'song.mp3',
        progress: 75,
        status: 'downloading',
        error: null,
      };

      sendFeedback(mockWin, message);

      expect(mockWin.webContents.send).toHaveBeenCalledWith('downloader-feedback', message);
    });

    test('should handle error messages', () => {
      const mockWin = new BrowserWindow() as unknown as Electron.BrowserWindow;
      const errorMessage = {
        status: 'error',
        message: 'Download failed',
        code: 'NETWORK_ERROR',
      };

      sendFeedback(mockWin, errorMessage);

      expect(mockWin.webContents.send).toHaveBeenCalledWith('downloader-feedback', errorMessage);
    });
  });

  test.describe('cropMaxWidth', () => {
    test('should crop standard YouTube artwork (1280x720) to square', () => {
      const mockImage = new NativeImage() as unknown as Electron.NativeImage;
      (mockImage.getSize as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        width: 1280,
        height: 720,
      });

      const result = cropMaxWidth(mockImage);

      expect(mockImage.crop).toHaveBeenCalledWith({
        x: 280,
        y: 0,
        width: 720,
        height: 720,
      });
      expect(result).toBe(mockImage);
    });

    test('should not crop non-standard dimensions', () => {
      const mockImage = new NativeImage() as unknown as Electron.NativeImage;
      (mockImage.getSize as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        width: 1000,
        height: 1000,
      });

      const result = cropMaxWidth(mockImage);

      expect(mockImage.crop).not.toHaveBeenCalled();
      expect(result).toBe(mockImage);
    });

    test('should return original image for square images', () => {
      const mockImage = new NativeImage() as unknown as Electron.NativeImage;
      (mockImage.getSize as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        width: 500,
        height: 500,
      });

      const result = cropMaxWidth(mockImage);

      expect(mockImage.crop).not.toHaveBeenCalled();
      expect(result).toBe(mockImage);
    });

    test('should return original image for different aspect ratios', () => {
      const mockImage = new NativeImage() as unknown as Electron.NativeImage;
      (mockImage.getSize as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        width: 1920,
        height: 1080,
      });

      const result = cropMaxWidth(mockImage);

      expect(mockImage.crop).not.toHaveBeenCalled();
      expect(result).toBe(mockImage);
    });

    test('should return original image for small images', () => {
      const mockImage = new NativeImage() as unknown as Electron.NativeImage;
      (mockImage.getSize as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        width: 100,
        height: 100,
      });

      const result = cropMaxWidth(mockImage);

      expect(mockImage.crop).not.toHaveBeenCalled();
      expect(result).toBe(mockImage);
    });

    test('should only crop exact 1280x720 dimensions', () => {
      const mockImage1 = new NativeImage() as unknown as Electron.NativeImage;
      (mockImage1.getSize as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        width: 1280,
        height: 719, // Off by 1
      });

      const result1 = cropMaxWidth(mockImage1);
      expect(mockImage1.crop).not.toHaveBeenCalled();

      const mockImage2 = new NativeImage() as unknown as Electron.NativeImage;
      (mockImage2.getSize as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        width: 1281, // Off by 1
        height: 720,
      });

      const result2 = cropMaxWidth(mockImage2);
      expect(mockImage2.crop).not.toHaveBeenCalled();
    });

    test('should handle portrait orientation images', () => {
      const mockImage = new NativeImage() as unknown as Electron.NativeImage;
      (mockImage.getSize as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        width: 720,
        height: 1280,
      });

      const result = cropMaxWidth(mockImage);

      expect(mockImage.crop).not.toHaveBeenCalled();
      expect(result).toBe(mockImage);
    });
  });

  test.describe('setBadge', () => {
    beforeEach(() => {
      (is.linux as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false);
      (is.macOS as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false);
    });

    test('should set badge on Linux', () => {
      (is.linux as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);

      setBadge(5);

      expect(app.setBadgeCount).toHaveBeenCalledWith(5);
      expect(app.setBadgeCount).toHaveBeenCalledTimes(1);
    });

    test('should set badge on macOS', () => {
      (is.macOS as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);

      setBadge(3);

      expect(app.setBadgeCount).toHaveBeenCalledWith(3);
      expect(app.setBadgeCount).toHaveBeenCalledTimes(1);
    });

    test('should not set badge on Windows', () => {
      (is.linux as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false);
      (is.macOS as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false);

      setBadge(5);

      expect(app.setBadgeCount).not.toHaveBeenCalled();
    });

    test('should handle zero badge count', () => {
      (is.linux as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);

      setBadge(0);

      expect(app.setBadgeCount).toHaveBeenCalledWith(0);
    });

    test('should handle large badge numbers', () => {
      (is.macOS as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);

      setBadge(999);

      expect(app.setBadgeCount).toHaveBeenCalledWith(999);
    });

    test('should handle negative numbers', () => {
      (is.linux as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);

      setBadge(-1);

      expect(app.setBadgeCount).toHaveBeenCalledWith(-1);
    });

    test('should work on both Linux and macOS', () => {
      (is.linux as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);
      (is.macOS as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);

      setBadge(10);

      // Should still be called because either condition is true
      expect(app.setBadgeCount).toHaveBeenCalledWith(10);
    });
  });
});
