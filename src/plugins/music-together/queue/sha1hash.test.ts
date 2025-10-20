import { test, expect } from '@playwright/test';
import { SHA1Hash } from './sha1hash';

test.describe('music-together/queue/sha1hash', () => {
  test.describe('SHA1Hash', () => {
    test('should hash a simple string correctly', async () => {
      const result = await SHA1Hash('hello');
      // Expected SHA1 hash of 'hello'
      expect(result).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
    });

    test('should hash empty string', async () => {
      const result = await SHA1Hash('');
      // Expected SHA1 hash of empty string
      expect(result).toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709');
    });

    test('should produce different hashes for different strings', async () => {
      const hash1 = await SHA1Hash('test1');
      const hash2 = await SHA1Hash('test2');

      expect(hash1).not.toBe(hash2);
    });

    test('should produce consistent hashes for same input', async () => {
      const input = 'consistent-test';
      const hash1 = await SHA1Hash(input);
      const hash2 = await SHA1Hash(input);

      expect(hash1).toBe(hash2);
    });

    test('should hash unicode characters', async () => {
      const result = await SHA1Hash('hello 世界 🌍');
      // Should produce a valid hex string
      expect(result).toMatch(/^[a-f0-9]{40}$/);
      expect(result.length).toBe(40);
    });

    test('should hash special characters', async () => {
      const result = await SHA1Hash('!@#$%^&*()_+-=[]{}|;:,.<>?');
      expect(result).toMatch(/^[a-f0-9]{40}$/);
      expect(result.length).toBe(40);
    });

    test('should hash multiline string', async () => {
      const multiline = `line1
line2
line3`;
      const result = await SHA1Hash(multiline);
      expect(result).toMatch(/^[a-f0-9]{40}$/);
      expect(result.length).toBe(40);
    });

    test('should hash long string', async () => {
      const longString = 'a'.repeat(10000);
      const result = await SHA1Hash(longString);
      expect(result).toMatch(/^[a-f0-9]{40}$/);
      expect(result.length).toBe(40);
    });

    test('should return lowercase hex string', async () => {
      const result = await SHA1Hash('TEST');
      expect(result).toBe(result.toLowerCase());
      expect(result).not.toMatch(/[A-F]/);
    });

    test('should handle JSON string', async () => {
      const jsonString = JSON.stringify({ key: 'value', nested: { prop: 123 } });
      const result = await SHA1Hash(jsonString);
      expect(result).toMatch(/^[a-f0-9]{40}$/);
    });

    test('should be case sensitive', async () => {
      const hash1 = await SHA1Hash('Test');
      const hash2 = await SHA1Hash('test');

      expect(hash1).not.toBe(hash2);
    });

    test('should pad hex values correctly', async () => {
      // Test that single-digit hex values are padded with 0
      const result = await SHA1Hash('test');
      expect(result).toMatch(/^[a-f0-9]{40}$/);
      expect(result.length).toBe(40);
      // Each byte should be represented by exactly 2 hex characters
    });

    test('should handle whitespace differences', async () => {
      const hash1 = await SHA1Hash('test');
      const hash2 = await SHA1Hash('test ');
      const hash3 = await SHA1Hash(' test');

      expect(hash1).not.toBe(hash2);
      expect(hash1).not.toBe(hash3);
      expect(hash2).not.toBe(hash3);
    });

    test('should hash numbers as strings', async () => {
      const result = await SHA1Hash('12345');
      expect(result).toMatch(/^[a-f0-9]{40}$/);
      expect(result.length).toBe(40);
    });

    test('should handle very short strings', async () => {
      const resultA = await SHA1Hash('a');
      const resultB = await SHA1Hash('b');

      expect(resultA).toBe('86f7e437faa5a7fce15d1ddcb9eaeaea377667b8');
      expect(resultB).toBe('e9d71f5ee7c92d6dc9e92ffdad17b8bd49418f98');
      expect(resultA).not.toBe(resultB);
    });
  });
});
