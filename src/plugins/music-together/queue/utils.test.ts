import { test, expect } from '@playwright/test';
import { mapQueueItem } from './utils';
import type { QueueItem } from '@/types/datahost-get-state';

test.describe('music-together/queue/utils', () => {
  test.describe('mapQueueItem', () => {
    test('should map playlistPanelVideoRenderer items', () => {
      const queueItems: QueueItem[] = [
        {
          playlistPanelVideoRenderer: {
            videoId: 'video1',
            title: { runs: [{ text: 'Song 1' }] },
          },
        },
        {
          playlistPanelVideoRenderer: {
            videoId: 'video2',
            title: { runs: [{ text: 'Song 2' }] },
          },
        },
      ] as QueueItem[];

      const result = mapQueueItem(
        (item) => item?.videoId,
        queueItems
      );

      expect(result).toEqual(['video1', 'video2']);
    });

    test('should map playlistPanelVideoWrapperRenderer items', () => {
      const queueItems: QueueItem[] = [
        {
          playlistPanelVideoWrapperRenderer: {
            primaryRenderer: {
              playlistPanelVideoRenderer: {
                videoId: 'wrapped-video1',
                title: { runs: [{ text: 'Wrapped Song 1' }] },
              },
            },
          },
        },
      ] as unknown as QueueItem[];

      const result = mapQueueItem(
        (item) => item?.videoId,
        queueItems
      );

      expect(result).toEqual(['wrapped-video1']);
    });

    test('should handle mixed item types', () => {
      const queueItems: QueueItem[] = [
        {
          playlistPanelVideoRenderer: {
            videoId: 'video1',
          },
        },
        {
          playlistPanelVideoWrapperRenderer: {
            primaryRenderer: {
              playlistPanelVideoRenderer: {
                videoId: 'wrapped-video2',
              },
            },
          },
        },
        {
          playlistPanelVideoRenderer: {
            videoId: 'video3',
          },
        },
      ] as unknown as QueueItem[];

      const result = mapQueueItem(
        (item) => item?.videoId,
        queueItems
      );

      expect(result).toEqual(['video1', 'wrapped-video2', 'video3']);
    });

    test('should handle empty array', () => {
      const result = mapQueueItem(
        (item) => item?.videoId,
        []
      );

      expect(result).toEqual([]);
    });

    test('should handle undefined items gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const queueItems = [
        {
          unknownType: 'invalid',
        },
      ] as unknown as QueueItem[];

      const result = mapQueueItem(
        (item) => item?.videoId ?? 'default',
        queueItems
      );

      expect(consoleSpy).toHaveBeenCalledWith('Music Together: Unknown item', queueItems[0]);
      expect(result).toEqual(['default']);

      consoleSpy.mockRestore();
    });

    test('should apply custom mapping function', () => {
      const queueItems: QueueItem[] = [
        {
          playlistPanelVideoRenderer: {
            videoId: 'video1',
            title: { runs: [{ text: 'Song Title' }] },
          },
        },
      ] as QueueItem[];

      const result = mapQueueItem(
        (item) => ({
          id: item?.videoId,
          name: item?.title?.runs?.[0]?.text,
        }),
        queueItems
      );

      expect(result).toEqual([
        { id: 'video1', name: 'Song Title' },
      ]);
    });

    test('should handle null/undefined in mapping function', () => {
      const queueItems: QueueItem[] = [
        {
          playlistPanelVideoRenderer: {
            videoId: 'video1',
          },
        },
      ] as QueueItem[];

      const result = mapQueueItem(
        (item) => item ? 'exists' : 'missing',
        queueItems
      );

      expect(result).toEqual(['exists']);
    });

    test('should handle complex wrapper renderer structures', () => {
      const queueItems = [
        {
          playlistPanelVideoWrapperRenderer: {
            primaryRenderer: {
              playlistPanelVideoRenderer: {
                videoId: 'complex-video',
                title: { runs: [{ text: 'Complex Title' }] },
                lengthText: { runs: [{ text: '3:45' }] },
              },
            },
          },
        },
      ] as unknown as QueueItem[];

      const result = mapQueueItem(
        (item) => ({
          videoId: item?.videoId,
          duration: item?.lengthText?.runs?.[0]?.text,
        }),
        queueItems
      );

      expect(result).toEqual([
        { videoId: 'complex-video', duration: '3:45' },
      ]);
    });

    test('should preserve array order', () => {
      const queueItems: QueueItem[] = [
        { playlistPanelVideoRenderer: { videoId: 'first' } },
        { playlistPanelVideoRenderer: { videoId: 'second' } },
        { playlistPanelVideoRenderer: { videoId: 'third' } },
        { playlistPanelVideoRenderer: { videoId: 'fourth' } },
      ] as QueueItem[];

      const result = mapQueueItem(
        (item) => item?.videoId,
        queueItems
      );

      expect(result).toEqual(['first', 'second', 'third', 'fourth']);
    });
  });
});
