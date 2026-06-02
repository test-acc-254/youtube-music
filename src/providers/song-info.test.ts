import { describe, it, expect } from 'vitest';
import { cleanupName } from './song-info';

describe('cleanupName', () => {
  it('should remove "- Topic" suffix from artist names', () => {
    expect(cleanupName('Artist Name - Topic')).toBe('Artist Name');
  });

  it('should remove "vevo" suffix from artist names', () => {
    expect(cleanupName('ArtistVevo')).toBe('Artist');
  });

  it('should remove VEVO suffix case-insensitively', () => {
    expect(cleanupName('Artist VEVO')).toBe('Artist');
  });

  it('should remove official markers from video titles', () => {
    expect(cleanupName('Song Name (Official Music Video)')).toBe('Song Name');
    expect(cleanupName('Song Name [Official Audio]')).toBe('Song Name');
    expect(cleanupName('Song Name (Official Visualizer)')).toBe('Song Name');
    expect(cleanupName('Song Name [Official Lyric Video]')).toBe('Song Name');
  });

  it('should remove lyrics/visualizer/audio markers', () => {
    expect(cleanupName('Song Name (Lyrics)')).toBe('Song Name');
    expect(cleanupName('Song Name [Lyric Video]')).toBe('Song Name');
    expect(cleanupName('Song Name (Visualizer)')).toBe('Song Name');
    expect(cleanupName('Song Name (Audio)')).toBe('Song Name');
    expect(cleanupName('Song Name (Audio Video)')).toBe('Song Name');
  });

  it('should remove performance video markers', () => {
    expect(cleanupName('Song Name (Performance Video)')).toBe('Song Name');
  });

  it('should remove clip official markers', () => {
    expect(cleanupName('Song Name (Clip Official)')).toBe('Song Name');
  });

  it('should remove video version markers', () => {
    expect(cleanupName('Song Name (Video Version)')).toBe('Song Name');
  });

  it('should remove HD/HQ quality markers', () => {
    expect(cleanupName('Song Name (HD)')).toBe('Song Name');
    expect(cleanupName('Song Name [HQ Audio]')).toBe('Song Name');
    expect(cleanupName('Song Name (HD Audio)')).toBe('Song Name');
  });

  it('should remove live markers', () => {
    expect(cleanupName('Song Name (Live)')).toBe('Song Name');
    expect(cleanupName('Song Name [Live]')).toBe('Song Name');
  });

  it('should remove 4K markers', () => {
    expect(cleanupName('Song Name (4K)')).toBe('Song Name');
    expect(cleanupName('Song Name [4K Upgrade]')).toBe('Song Name');
  });

  it('should return empty string for empty input', () => {
    expect(cleanupName('')).toBe('');
  });

  it('should handle null-ish input', () => {
    expect(cleanupName(undefined as unknown as string)).toBeUndefined();
    expect(cleanupName(null as unknown as string)).toBeNull();
  });

  it('should return unmodified name when no suffix matches', () => {
    expect(cleanupName('Normal Song Name')).toBe('Normal Song Name');
  });

  it('should handle multiple nested removals', () => {
    const result = cleanupName('Artist - Topic (Official Music Video)');
    expect(result).toBe('Artist');
  });
});