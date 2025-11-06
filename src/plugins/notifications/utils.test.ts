import { test, expect, vi, beforeEach } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';
import { app, NativeImage } from 'electron';

// Mock dependencies
vi.mock('node:fs', () => ({
  default: {
    writeFileSync: vi.fn(),
  },
}));

vi.mock('electron', () => ({
  app: {
    getPath: vi.fn(),
  },
  NativeImage: class MockNativeImage {
    resize = vi.fn().mockReturnThis();
    getSize = vi.fn();
    crop = vi.fn().mockReturnThis();
    toPNG = vi.fn();
  },
}));

vi.mock('@assets/youtube-music.png?asset&asarUnpack', () => ({
  default: '/path/to/youtube-music.png',
}));

import {
  ToastStyles,
  urgencyLevels,
  notificationImage,
  saveImage,
  snakeToCamel,
  secondsToMinutes,
} from './utils';

test.describe('Notification Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (app.getPath as unknown as ReturnType<typeof vi.fn>).mockReturnValue('/mock/user/data');
  });

  test.describe('ToastStyles', () => {
    test('should have correct toast style values', () => {
      expect(ToastStyles.logo).toBe(1);
      expect(ToastStyles.banner_centered_top).toBe(2);
      expect(ToastStyles.hero).toBe(3);
      expect(ToastStyles.banner_top_custom).toBe(4);
      expect(ToastStyles.banner_centered_bottom).toBe(5);
      expect(ToastStyles.banner_bottom).toBe(6);
      expect(ToastStyles.legacy).toBe(7);
    });
  });

  test.describe('urgencyLevels', () => {
    test('should have correct urgency levels', () => {
      expect(urgencyLevels).toHaveLength(3);
      expect(urgencyLevels[0]).toEqual({ name: 'Low', value: 'low' });
      expect(urgencyLevels[1]).toEqual({ name: 'Normal', value: 'normal' });
      expect(urgencyLevels[2]).toEqual({ name: 'High', value: 'critical' });
    });
  });

  test.describe('saveImage', () => {
    test('should save image to disk successfully', () => {
      const mockImage = new NativeImage() as unknown as Electron.NativeImage;
      const pngBuffer = Buffer.from('mock-png-data');
      (mockImage.toPNG as unknown as ReturnType<typeof vi.fn>).mockReturnValue(pngBuffer);

      const savePath = '/path/to/save/image.png';
      const result = saveImage(mockImage, savePath);

      expect(fs.writeFileSync).toHaveBeenCalledWith(savePath, pngBuffer);
      expect(result).toBe(savePath);
    });

    test('should return default icon on write error', () => {
      const mockImage = new NativeImage() as unknown as Electron.NativeImage;
      const pngBuffer = Buffer.from('mock-png-data');
      (mockImage.toPNG as unknown as ReturnType<typeof vi.fn>).mockReturnValue(pngBuffer);
      (fs.writeFileSync as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Write error');
      });

      const savePath = '/path/to/save/image.png';
      const result = saveImage(mockImage, savePath);

      expect(result).toBe('/path/to/youtube-music.png');
    });

    test('should handle permission errors', () => {
      const mockImage = new NativeImage() as unknown as Electron.NativeImage;
      (mockImage.toPNG as unknown as ReturnType<typeof vi.fn>).mockReturnValue(Buffer.from('data'));
      (fs.writeFileSync as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
        const error = new Error('EACCES: permission denied');
        (error as NodeJS.ErrnoException).code = 'EACCES';
        throw error;
      });

      const result = saveImage(mockImage, '/restricted/path/image.png');

      expect(result).toBe('/path/to/youtube-music.png');
    });

    test('should handle disk full errors', () => {
      const mockImage = new NativeImage() as unknown as Electron.NativeImage;
      (mockImage.toPNG as unknown as ReturnType<typeof vi.fn>).mockReturnValue(Buffer.from('data'));
      (fs.writeFileSync as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => {
        const error = new Error('ENOSPC: no space left');
        (error as NodeJS.ErrnoException).code = 'ENOSPC';
        throw error;
      });

      const result = saveImage(mockImage, '/path/to/image.png');

      expect(result).toBe('/path/to/youtube-music.png');
    });
  });

  test.describe('snakeToCamel', () => {
    test('should convert snake_case to Camel Case', () => {
      expect(snakeToCamel('hello_world')).toBe('Hello World');
      expect(snakeToCamel('test_case_string')).toBe('Test Case String');
    });

    test('should convert kebab-case to Camel Case', () => {
      expect(snakeToCamel('hello-world')).toBe('Hello World');
      expect(snakeToCamel('test-case-string')).toBe('Test Case String');
    });

    test('should handle mixed separators', () => {
      expect(snakeToCamel('hello-world_test')).toBe('Hello World Test');
    });

    test('should capitalize first letter when starts with lowercase', () => {
      expect(snakeToCamel('hello')).toBe('Hello');
      expect(snakeToCamel('test')).toBe('Test');
    });

    test('should handle empty string', () => {
      expect(snakeToCamel('')).toBe('');
    });

    test('should handle single character', () => {
      expect(snakeToCamel('a')).toBe('A');
    });

    test('should handle strings with no separators', () => {
      expect(snakeToCamel('hello')).toBe('Hello');
      expect(snakeToCamel('world')).toBe('World');
    });

    test('should handle consecutive separators', () => {
      expect(snakeToCamel('hello__world')).toBe('Hello  World');
      expect(snakeToCamel('hello--world')).toBe('Hello  World');
    });

    test('should handle strings starting with separator', () => {
      expect(snakeToCamel('_hello')).toBe(' Hello');
      expect(snakeToCamel('-world')).toBe(' World');
    });

    test('should handle strings ending with separator', () => {
      expect(snakeToCamel('hello_')).toBe('Hello ');
      expect(snakeToCamel('world-')).toBe('World ');
    });
  });

  test.describe('secondsToMinutes', () => {
    test('should convert seconds to MM:SS format', () => {
      expect(secondsToMinutes(0)).toBe('0:00');
      expect(secondsToMinutes(30)).toBe('0:30');
      expect(secondsToMinutes(60)).toBe('1:00');
      expect(secondsToMinutes(90)).toBe('1:30');
      expect(secondsToMinutes(125)).toBe('2:05');
    });

    test('should pad single digit seconds with zero', () => {
      expect(secondsToMinutes(5)).toBe('0:05');
      expect(secondsToMinutes(65)).toBe('1:05');
      expect(secondsToMinutes(305)).toBe('5:05');
    });

    test('should handle large values', () => {
      expect(secondsToMinutes(3600)).toBe('60:00');
      expect(secondsToMinutes(3661)).toBe('61:01');
    });

    test('should handle edge cases', () => {
      expect(secondsToMinutes(59)).toBe('0:59');
      expect(secondsToMinutes(119)).toBe('1:59');
      expect(secondsToMinutes(599)).toBe('9:59');
    });

    test('should handle exact minute boundaries', () => {
      expect(secondsToMinutes(60)).toBe('1:00');
      expect(secondsToMinutes(120)).toBe('2:00');
      expect(secondsToMinutes(180)).toBe('3:00');
    });

    test('should handle typical song durations', () => {
      expect(secondsToMinutes(180)).toBe('3:00'); // 3 minutes
      expect(secondsToMinutes(210)).toBe('3:30'); // 3:30
      expect(secondsToMinutes(240)).toBe('4:00'); // 4 minutes
    });
  });

  test.describe('notificationImage', () => {
    test('should return default icon when no song image', () => {
      const songInfo = { image: null } as any;
      const config = { interactive: false, toastStyle: ToastStyles.logo } as any;

      const result = notificationImage(songInfo, config);

      expect(result).toBe('/path/to/youtube-music.png');
    });

    test('should return logo image for non-interactive mode', () => {
      const mockImage = new NativeImage() as unknown as Electron.NativeImage;
      (mockImage.resize as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockImage);
      (mockImage.getSize as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ width: 300, height: 256 });
      (mockImage.crop as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockImage);

      const songInfo = { image: mockImage } as any;
      const config = { interactive: false, toastStyle: ToastStyles.logo } as any;

      const result = notificationImage(songInfo, config);

      expect(mockImage.resize).toHaveBeenCalledWith({ height: 256 });
      expect(mockImage.crop).toHaveBeenCalled();
    });

    test('should save logo image for interactive logo toast style', () => {
      const mockImage = new NativeImage() as unknown as Electron.NativeImage;
      (mockImage.resize as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockImage);
      (mockImage.getSize as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ width: 256, height: 256 });
      (mockImage.crop as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockImage);
      (mockImage.toPNG as unknown as ReturnType<typeof vi.fn>).mockReturnValue(Buffer.from('png-data'));

      const songInfo = { image: mockImage } as any;
      const config = { interactive: true, toastStyle: ToastStyles.logo } as any;

      const result = notificationImage(songInfo, config);

      expect(fs.writeFileSync).toHaveBeenCalled();
      expect(result).toContain('tempIcon.png');
    });

    test('should save logo image for interactive legacy toast style', () => {
      const mockImage = new NativeImage() as unknown as Electron.NativeImage;
      (mockImage.resize as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockImage);
      (mockImage.getSize as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ width: 256, height: 256 });
      (mockImage.crop as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockImage);
      (mockImage.toPNG as unknown as ReturnType<typeof vi.fn>).mockReturnValue(Buffer.from('png-data'));

      const songInfo = { image: mockImage } as any;
      const config = { interactive: true, toastStyle: ToastStyles.legacy } as any;

      const result = notificationImage(songInfo, config);

      expect(fs.writeFileSync).toHaveBeenCalled();
      expect(result).toContain('tempIcon.png');
    });

    test('should save banner image for other interactive toast styles', () => {
      const mockImage = new NativeImage() as unknown as Electron.NativeImage;
      (mockImage.toPNG as unknown as ReturnType<typeof vi.fn>).mockReturnValue(Buffer.from('png-data'));

      const songInfo = { image: mockImage } as any;
      const config = { interactive: true, toastStyle: ToastStyles.banner_centered_top } as any;

      const result = notificationImage(songInfo, config);

      expect(fs.writeFileSync).toHaveBeenCalled();
      expect(result).toContain('tempBanner.png');
    });

    test('should crop image with correct margins when oversized', () => {
      const mockImage = new NativeImage() as unknown as Electron.NativeImage;
      (mockImage.resize as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockImage);
      (mockImage.getSize as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ width: 300, height: 256 });
      (mockImage.crop as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockImage);

      const songInfo = { image: mockImage } as any;
      const config = { interactive: false, toastStyle: ToastStyles.logo } as any;

      notificationImage(songInfo, config);

      expect(mockImage.crop).toHaveBeenCalledWith({
        x: 22, // (300 - 256) / 2
        y: 0,
        width: 256,
        height: 256,
      });
    });

    test('should not crop when image width is exactly 256', () => {
      const mockImage = new NativeImage() as unknown as Electron.NativeImage;
      (mockImage.resize as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockImage);
      (mockImage.getSize as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ width: 256, height: 256 });
      (mockImage.crop as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockImage);

      const songInfo = { image: mockImage } as any;
      const config = { interactive: false, toastStyle: ToastStyles.logo } as any;

      notificationImage(songInfo, config);

      expect(mockImage.crop).toHaveBeenCalledWith({
        x: 0, // No margin needed
        y: 0,
        width: 256,
        height: 256,
      });
    });
  });
});
