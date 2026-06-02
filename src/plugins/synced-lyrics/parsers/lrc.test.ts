import { describe, it, expect } from 'vitest';
import { LRC } from './lrc';

describe('LRC.parse', () => {
  it('should parse basic LRC format', () => {
    const result = LRC.parse('[00:01.00]Line 1\n[00:02.50]Line 2\n[00:04.00]Line 3');
    expect(result.lines).toHaveLength(3);
    expect(result.lines[0].text).toBe('Line 1');
    expect(result.lines[0].timeInMs).toBe(1000);
    expect(result.lines[1].text).toBe('Line 2');
    expect(result.lines[1].timeInMs).toBe(2500);
    expect(result.lines[2].text).toBe('Line 3');
    expect(result.lines[2].timeInMs).toBe(4000);
  });

  it('should calculate duration between consecutive lines', () => {
    const result = LRC.parse('[00:01.00]First\n[00:03.50]Second\n[00:06.00]Third');
    expect(result.lines[0].duration).toBe(2500);
    expect(result.lines[1].duration).toBe(2500);
    expect(result.lines[2].duration).toBe(Infinity);
  });

  it('should parse tag metadata', () => {
    const result = LRC.parse('[ti:Song Title]\n[ar:Artist Name]\n[al:Album Name]\n[00:01.00]Line');
    expect(result.tags).toHaveLength(3);
    expect(result.tags[0]).toEqual({ tag: 'ti', value: 'Song Title' });
    expect(result.tags[1]).toEqual({ tag: 'ar', value: 'Artist Name' });
    expect(result.tags[2]).toEqual({ tag: 'al', value: 'Album Name' });
  });

  it('should handle offset tag', () => {
    const result = LRC.parse('[offset:500]\n[00:01.00]Line');
    expect(result.lines[0].timeInMs).toBe(1500);
  });

  it('should add leading empty line when first line offset > 300ms', () => {
    const result = LRC.parse('[00:02.00]Late start');
    expect(result.lines).toHaveLength(2);
    expect(result.lines[0].text).toBe('');
    expect(result.lines[0].timeInMs).toBe(0);
    expect(result.lines[0].duration).toBe(2000);
    expect(result.lines[1].text).toBe('Late start');
    expect(result.lines[1].timeInMs).toBe(2000);
  });

  it('should NOT add leading empty line when first line offset <= 300ms', () => {
    const result = LRC.parse('[00:00.50]Early line');
    expect(result.lines).toHaveLength(1);
    expect(result.lines[0].text).toBe('Early line');
  });

  it('should skip non-matching lines', () => {
    const result = LRC.parse('This is not an LRC line\n[00:01.00]Valid line');
    expect(result.lines).toHaveLength(1);
    expect(result.lines[0].text).toBe('Valid line');
  });

  it('should handle empty text', () => {
    const result = LRC.parse('');
    expect(result.lines).toHaveLength(0);
    expect(result.tags).toHaveLength(0);
  });

  it('should handle lines with extra whitespace in text', () => {
    const result = LRC.parse('[00:01.00]  Text with spaces  ');
    expect(result.lines[0].text).toBe('Text with spaces');
  });

  it('should parse milliseconds correctly as 3 digits', () => {
    const result = LRC.parse('[00:01.99]Line');
    expect(result.lines[0].timeInMs).toBe(1999);
  });
});