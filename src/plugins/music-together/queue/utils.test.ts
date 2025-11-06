import { test, expect } from '@playwright/test';

// Import types from the source
import type {
  ItemPlaylistPanelVideoRenderer,
  PlaylistPanelVideoWrapperRenderer,
  QueueItem,
} from '@/types/datahost-get-state';

import { mapQueueItem } from './utils';

test.describe('mapQueueItem', () => {
  test('should map playlistPanelVideoRenderer items', () => {
    const mockRenderer: ItemPlaylistPanelVideoRenderer = {
      videoId: 'video123',
      title: { runs: [{ text: 'Test Video' }] },
    } as any;

    const queueItems: QueueItem[] = [
      { playlistPanelVideoRenderer: mockRenderer },
    ];

    const result = mapQueueItem((item) => item?.videoId, queueItems);

    expect(result).toEqual(['video123']);
  });

  test('should map playlistPanelVideoWrapperRenderer items', () => {
    const mockRenderer: ItemPlaylistPanelVideoRenderer = {
      videoId: 'wrapped-video',
      title: { runs: [{ text: 'Wrapped Video' }] },
    } as any;

    const queueItems: QueueItem[] = [
      {
        playlistPanelVideoWrapperRenderer: {
          primaryRenderer: {
            playlistPanelVideoRenderer: mockRenderer,
          },
        } as any,
      },
    ];

    const result = mapQueueItem((item) => item?.videoId, queueItems);

    expect(result).toEqual(['wrapped-video']);
  });

  test('should handle mixed queue item types', () => {
    const renderer1: ItemPlaylistPanelVideoRenderer = {
      videoId: 'video1',
      title: { runs: [{ text: 'Video 1' }] },
    } as any;

    const renderer2: ItemPlaylistPanelVideoRenderer = {
      videoId: 'video2',
      title: { runs: [{ text: 'Video 2' }] },
    } as any;

    const queueItems: QueueItem[] = [
      { playlistPanelVideoRenderer: renderer1 },
      {
        playlistPanelVideoWrapperRenderer: {
          primaryRenderer: {
            playlistPanelVideoRenderer: renderer2,
          },
        } as any,
      },
    ];

    const result = mapQueueItem((item) => item?.videoId, queueItems);

    expect(result).toEqual(['video1', 'video2']);
  });

  test('should handle empty queue', () => {
    const queueItems: QueueItem[] = [];

    const result = mapQueueItem((item) => item?.videoId, queueItems);

    expect(result).toEqual([]);
  });

  test('should handle complex mapping functions', () => {
    const renderer1: ItemPlaylistPanelVideoRenderer = {
      videoId: 'video1',
      title: { runs: [{ text: 'Song 1' }] },
      lengthText: { runs: [{ text: '3:45' }] },
    } as any;

    const renderer2: ItemPlaylistPanelVideoRenderer = {
      videoId: 'video2',
      title: { runs: [{ text: 'Song 2' }] },
      lengthText: { runs: [{ text: '4:20' }] },
    } as any;

    const queueItems: QueueItem[] = [
      { playlistPanelVideoRenderer: renderer1 },
      { playlistPanelVideoRenderer: renderer2 },
    ];

    const result = mapQueueItem(
      (item) => ({
        id: item?.videoId,
        title: item?.title?.runs?.[0]?.text,
        duration: item?.lengthText?.runs?.[0]?.text,
      }),
      queueItems
    );

    expect(result).toEqual([
      { id: 'video1', title: 'Song 1', duration: '3:45' },
      { id: 'video2', title: 'Song 2', duration: '4:20' },
    ]);
  });

  test('should handle undefined items gracefully', () => {
    const renderer: ItemPlaylistPanelVideoRenderer = {
      videoId: 'valid-video',
    } as any;

    const queueItems: QueueItem[] = [
      { playlistPanelVideoRenderer: renderer },
      {} as any, // Unknown item
    ];

    const result = mapQueueItem(
      (item) => item?.videoId ?? 'unknown',
      queueItems
    );

    expect(result).toEqual(['valid-video', 'unknown']);
  });

  test('should extract from wrapper renderer with different primary renderer types', () => {
    const mockRenderer: ItemPlaylistPanelVideoRenderer = {
      videoId: 'wrapped123',
      title: { runs: [{ text: 'Wrapped Song' }] },
    } as any;

    const queueItems: QueueItem[] = [
      {
        playlistPanelVideoWrapperRenderer: {
          primaryRenderer: {
            playlistPanelVideoRenderer: mockRenderer,
          },
        } as any,
      },
    ];

    const result = mapQueueItem(
      (item) => item?.title?.runs?.[0]?.text,
      queueItems
    );

    expect(result).toEqual(['Wrapped Song']);
  });

  test('should handle null/undefined values in mapping function', () => {
    const renderer: ItemPlaylistPanelVideoRenderer = {
      videoId: 'video123',
    } as any;

    const queueItems: QueueItem[] = [
      { playlistPanelVideoRenderer: renderer },
    ];

    const result = mapQueueItem((item) => item?.title?.runs?.[0]?.text, queueItems);

    expect(result).toEqual([undefined]);
  });

  test('should map to boolean values', () => {
    const renderer1: ItemPlaylistPanelVideoRenderer = {
      videoId: 'video1',
      title: { runs: [{ text: 'Has Title' }] },
    } as any;

    const renderer2: ItemPlaylistPanelVideoRenderer = {
      videoId: 'video2',
    } as any;

    const queueItems: QueueItem[] = [
      { playlistPanelVideoRenderer: renderer1 },
      { playlistPanelVideoRenderer: renderer2 },
    ];

    const result = mapQueueItem(
      (item) => !!item?.title?.runs?.[0]?.text,
      queueItems
    );

    expect(result).toEqual([true, false]);
  });

  test('should map to numbers', () => {
    const queueItems: QueueItem[] = [
      {
        playlistPanelVideoRenderer: {
          videoId: 'v1',
          lengthText: { runs: [{ text: '180' }] },
        } as any,
      },
      {
        playlistPanelVideoRenderer: {
          videoId: 'v2',
          lengthText: { runs: [{ text: '240' }] },
        } as any,
      },
    ];

    const result = mapQueueItem(
      (item) => parseInt(item?.lengthText?.runs?.[0]?.text || '0', 10),
      queueItems
    );

    expect(result).toEqual([180, 240]);
  });

  test('should preserve array order', () => {
    const renderers = Array.from({ length: 10 }, (_, i) => ({
      videoId: `video${i}`,
      title: { runs: [{ text: `Song ${i}` }] },
    } as any));

    const queueItems: QueueItem[] = renderers.map((renderer) => ({
      playlistPanelVideoRenderer: renderer,
    }));

    const result = mapQueueItem((item) => item?.videoId, queueItems);

    expect(result).toEqual(renderers.map((r) => r.videoId));
  });

  test('should handle large queues efficiently', () => {
    const largeQueue: QueueItem[] = Array.from({ length: 1000 }, (_, i) => ({
      playlistPanelVideoRenderer: {
        videoId: `video${i}`,
      } as any,
    }));

    const result = mapQueueItem((item) => item?.videoId, largeQueue);

    expect(result).toHaveLength(1000);
    expect(result[0]).toBe('video0');
    expect(result[999]).toBe('video999');
  });

  test('should handle wrapper renderer with null primaryRenderer', () => {
    const queueItems: QueueItem[] = [
      {
        playlistPanelVideoWrapperRenderer: {
          primaryRenderer: {} as any,
        } as any,
      },
    ];

    const result = mapQueueItem((item) => item?.videoId, queueItems);

    expect(result).toHaveLength(1);
  });

  test('should handle items with additional properties', () => {
    const renderer: ItemPlaylistPanelVideoRenderer = {
      videoId: 'video123',
      title: { runs: [{ text: 'Test' }] },
      thumbnail: { thumbnails: [] },
      lengthText: { runs: [{ text: '3:00' }] },
    } as any;

    const queueItems: QueueItem[] = [
      { playlistPanelVideoRenderer: renderer },
    ];

    const result = mapQueueItem(
      (item) => ({
        id: item?.videoId,
        hasThumb: !!item?.thumbnail,
      }),
      queueItems
    );

    expect(result).toEqual([{ id: 'video123', hasThumb: true }]);
  });

  test('should allow filtering via map function', () => {
    const queueItems: QueueItem[] = [
      {
        playlistPanelVideoRenderer: {
          videoId: 'video1',
          title: { runs: [{ text: 'Music Video' }] },
        } as any,
      },
      {
        playlistPanelVideoRenderer: {
          videoId: 'video2',
          title: { runs: [{ text: 'Ad' }] },
        } as any,
      },
    ];

    const result = mapQueueItem(
      (item) => item?.title?.runs?.[0]?.text,
      queueItems
    ).filter((title) => title && !title.includes('Ad'));

    expect(result).toEqual(['Music Video']);
  });
});
