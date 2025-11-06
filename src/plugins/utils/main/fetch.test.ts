import { test, expect, vi } from '@playwright/test';

// Mock electron module
const mockNetFetch = vi.fn();
vi.mock('electron', () => ({
  net: {
    fetch: mockNetFetch,
  },
}));

import { getNetFetchAsFetch } from './fetch';

test.describe('getNetFetchAsFetch', () => {
  test.beforeEach(() => {
    mockNetFetch.mockClear();
  });

  test('should convert string URL to URL object and call net.fetch', async () => {
    const mockResponse = new Response('test response');
    mockNetFetch.mockResolvedValue(mockResponse);

    const netFetch = getNetFetchAsFetch();
    const result = await netFetch('https://example.com/api');

    expect(mockNetFetch).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockResponse);
  });

  test('should handle URL object input', async () => {
    const mockResponse = new Response('test response');
    mockNetFetch.mockResolvedValue(mockResponse);

    const netFetch = getNetFetchAsFetch();
    const url = new URL('https://example.com/api');
    const result = await netFetch(url);

    expect(mockNetFetch).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockResponse);
  });

  test('should handle Request object input', async () => {
    const mockResponse = new Response('test response');
    mockNetFetch.mockResolvedValue(mockResponse);

    const netFetch = getNetFetchAsFetch();
    const request = new Request('https://example.com/api');
    const result = await netFetch(request);

    expect(mockNetFetch).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockResponse);
  });

  test('should default to POST method when body is provided without method', async () => {
    const mockResponse = new Response('test response');
    mockNetFetch.mockResolvedValue(mockResponse);

    const netFetch = getNetFetchAsFetch();
    await netFetch('https://example.com/api', { body: 'test data' });

    expect(mockNetFetch).toHaveBeenCalledTimes(1);
    const callArgs = mockNetFetch.mock.calls[0];
    expect(callArgs[1]).toMatchObject({ method: 'POST', body: 'test data' });
  });

  test('should preserve explicit method when body is provided', async () => {
    const mockResponse = new Response('test response');
    mockNetFetch.mockResolvedValue(mockResponse);

    const netFetch = getNetFetchAsFetch();
    await netFetch('https://example.com/api', {
      method: 'PUT',
      body: 'test data'
    });

    expect(mockNetFetch).toHaveBeenCalledTimes(1);
    const callArgs = mockNetFetch.mock.calls[0];
    expect(callArgs[1]).toMatchObject({ method: 'PUT', body: 'test data' });
  });

  test('should not modify method when no body is provided', async () => {
    const mockResponse = new Response('test response');
    mockNetFetch.mockResolvedValue(mockResponse);

    const netFetch = getNetFetchAsFetch();
    await netFetch('https://example.com/api', { method: 'GET' });

    expect(mockNetFetch).toHaveBeenCalledTimes(1);
    const callArgs = mockNetFetch.mock.calls[0];
    expect(callArgs[1]).toMatchObject({ method: 'GET' });
  });

  test('should handle requests without init options', async () => {
    const mockResponse = new Response('test response');
    mockNetFetch.mockResolvedValue(mockResponse);

    const netFetch = getNetFetchAsFetch();
    await netFetch('https://example.com/api');

    expect(mockNetFetch).toHaveBeenCalledTimes(1);
  });

  test('should pass through all init options', async () => {
    const mockResponse = new Response('test response');
    mockNetFetch.mockResolvedValue(mockResponse);

    const netFetch = getNetFetchAsFetch();
    const headers = { 'Content-Type': 'application/json' };
    await netFetch('https://example.com/api', {
      method: 'POST',
      headers,
      body: JSON.stringify({ test: 'data' }),
    });

    expect(mockNetFetch).toHaveBeenCalledTimes(1);
    const callArgs = mockNetFetch.mock.calls[0];
    expect(callArgs[1]).toMatchObject({
      method: 'POST',
      headers,
      body: JSON.stringify({ test: 'data' }),
    });
  });

  test('should handle network errors', async () => {
    const mockError = new Error('Network error');
    mockNetFetch.mockRejectedValue(mockError);

    const netFetch = getNetFetchAsFetch();

    await expect(netFetch('https://example.com/api')).rejects.toThrow('Network error');
  });

  test('should properly construct Request with URL', async () => {
    const mockResponse = new Response('test response');
    mockNetFetch.mockResolvedValue(mockResponse);

    const netFetch = getNetFetchAsFetch();
    const url = new URL('https://example.com/api?param=value');
    await netFetch(url);

    expect(mockNetFetch).toHaveBeenCalledTimes(1);
    const callArgs = mockNetFetch.mock.calls[0];
    expect(callArgs[0]).toBeInstanceOf(Request);
  });

  test('should handle Request object with custom properties', async () => {
    const mockResponse = new Response('test response');
    mockNetFetch.mockResolvedValue(mockResponse);

    const netFetch = getNetFetchAsFetch();
    const request = new Request('https://example.com/api', {
      method: 'POST',
      headers: { 'X-Custom-Header': 'value' },
    });
    await netFetch(request);

    expect(mockNetFetch).toHaveBeenCalledTimes(1);
  });
});
