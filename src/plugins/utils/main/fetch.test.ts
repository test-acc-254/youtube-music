import { test, expect, vi } from '@playwright/test';
import { net } from 'electron';
import { getNetFetchAsFetch } from './fetch';

// Mock electron net module
vi.mock('electron', () => ({
  net: {
    fetch: vi.fn(),
  },
}));

test.describe('plugins/utils/main/fetch', () => {
  test.describe('getNetFetchAsFetch', () => {
    test('should handle string URL input', async () => {
      const mockResponse = new Response('test');
      vi.mocked(net.fetch).mockResolvedValue(mockResponse);

      const fetchFn = getNetFetchAsFetch();
      const result = await fetchFn('https://example.com');

      expect(net.fetch).toHaveBeenCalled();
      const callArgs = vi.mocked(net.fetch).mock.calls[0];
      expect(callArgs[0]).toBeInstanceOf(Request);
      expect(result).toBe(mockResponse);
    });

    test('should handle URL object input', async () => {
      const mockResponse = new Response('test');
      vi.mocked(net.fetch).mockResolvedValue(mockResponse);

      const fetchFn = getNetFetchAsFetch();
      const url = new URL('https://example.com/path');
      const result = await fetchFn(url);

      expect(net.fetch).toHaveBeenCalled();
      expect(result).toBe(mockResponse);
    });

    test('should handle Request object input', async () => {
      const mockResponse = new Response('test');
      vi.mocked(net.fetch).mockResolvedValue(mockResponse);

      const fetchFn = getNetFetchAsFetch();
      const request = new Request('https://example.com', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await fetchFn(request);

      expect(net.fetch).toHaveBeenCalled();
      expect(result).toBe(mockResponse);
    });

    test('should set method to POST when body is provided without method', async () => {
      const mockResponse = new Response('test');
      vi.mocked(net.fetch).mockResolvedValue(mockResponse);

      const fetchFn = getNetFetchAsFetch();
      await fetchFn('https://example.com', {
        body: JSON.stringify({ key: 'value' }),
      });

      const callArgs = vi.mocked(net.fetch).mock.calls[0];
      expect(callArgs[1]?.method).toBe('POST');
    });

    test('should preserve explicit method even with body', async () => {
      const mockResponse = new Response('test');
      vi.mocked(net.fetch).mockResolvedValue(mockResponse);

      const fetchFn = getNetFetchAsFetch();
      await fetchFn('https://example.com', {
        method: 'PUT',
        body: JSON.stringify({ key: 'value' }),
      });

      const callArgs = vi.mocked(net.fetch).mock.calls[0];
      expect(callArgs[1]?.method).toBe('PUT');
    });

    test('should not set method to POST when no body provided', async () => {
      const mockResponse = new Response('test');
      vi.mocked(net.fetch).mockResolvedValue(mockResponse);

      const fetchFn = getNetFetchAsFetch();
      await fetchFn('https://example.com', {
        headers: { 'Content-Type': 'application/json' },
      });

      const callArgs = vi.mocked(net.fetch).mock.calls[0];
      expect(callArgs[1]?.method).toBeUndefined();
    });

    test('should pass init options to net.fetch', async () => {
      const mockResponse = new Response('test');
      vi.mocked(net.fetch).mockResolvedValue(mockResponse);

      const fetchFn = getNetFetchAsFetch();
      const initOptions = {
        method: 'GET',
        headers: { 'Authorization': 'Bearer token' },
        credentials: 'include' as RequestCredentials,
      };

      await fetchFn('https://api.example.com', initOptions);

      const callArgs = vi.mocked(net.fetch).mock.calls[0];
      expect(callArgs[1]).toMatchObject(initOptions);
    });

    test('should handle URLs with query parameters', async () => {
      const mockResponse = new Response('test');
      vi.mocked(net.fetch).mockResolvedValue(mockResponse);

      const fetchFn = getNetFetchAsFetch();
      await fetchFn('https://example.com/path?key=value&foo=bar');

      expect(net.fetch).toHaveBeenCalled();
      const callArgs = vi.mocked(net.fetch).mock.calls[0];
      expect(callArgs[0]).toBeInstanceOf(Request);
    });

    test('should handle URLs with hash fragments', async () => {
      const mockResponse = new Response('test');
      vi.mocked(net.fetch).mockResolvedValue(mockResponse);

      const fetchFn = getNetFetchAsFetch();
      await fetchFn('https://example.com/path#section');

      expect(net.fetch).toHaveBeenCalled();
    });

    test('should handle complex Request objects', async () => {
      const mockResponse = new Response('test');
      vi.mocked(net.fetch).mockResolvedValue(mockResponse);

      const fetchFn = getNetFetchAsFetch();
      const request = new Request('https://example.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token',
        },
        body: JSON.stringify({ data: 'test' }),
      });

      await fetchFn(request);

      expect(net.fetch).toHaveBeenCalled();
    });

    test('should handle fetch without init parameter', async () => {
      const mockResponse = new Response('test');
      vi.mocked(net.fetch).mockResolvedValue(mockResponse);

      const fetchFn = getNetFetchAsFetch();
      const result = await fetchFn('https://example.com');

      expect(net.fetch).toHaveBeenCalled();
      expect(result).toBe(mockResponse);
    });

    test('should handle various HTTP methods', async () => {
      const mockResponse = new Response('test');
      vi.mocked(net.fetch).mockResolvedValue(mockResponse);

      const fetchFn = getNetFetchAsFetch();
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

      for (const method of methods) {
        vi.mocked(net.fetch).mockClear();
        await fetchFn('https://example.com', { method });

        const callArgs = vi.mocked(net.fetch).mock.calls[0];
        expect(callArgs[1]?.method).toBe(method);
      }
    });

    test('should create new Request from URL object', async () => {
      const mockResponse = new Response('test');
      vi.mocked(net.fetch).mockResolvedValue(mockResponse);

      const fetchFn = getNetFetchAsFetch();
      const url = new URL('https://example.com/api/endpoint');
      await fetchFn(url, { method: 'GET' });

      const callArgs = vi.mocked(net.fetch).mock.calls[0];
      expect(callArgs[0]).toBeInstanceOf(Request);
    });

    test('should handle empty init object', async () => {
      const mockResponse = new Response('test');
      vi.mocked(net.fetch).mockResolvedValue(mockResponse);

      const fetchFn = getNetFetchAsFetch();
      await fetchFn('https://example.com', {});

      expect(net.fetch).toHaveBeenCalled();
    });

    test('should handle FormData body', async () => {
      const mockResponse = new Response('test');
      vi.mocked(net.fetch).mockResolvedValue(mockResponse);

      const fetchFn = getNetFetchAsFetch();
      const formData = new FormData();
      formData.append('key', 'value');

      await fetchFn('https://example.com', {
        body: formData,
      });

      const callArgs = vi.mocked(net.fetch).mock.calls[0];
      expect(callArgs[1]?.method).toBe('POST');
      expect(callArgs[1]?.body).toBe(formData);
    });
  });
});
