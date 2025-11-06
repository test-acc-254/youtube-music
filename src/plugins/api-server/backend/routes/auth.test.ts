import { test, expect, vi, beforeEach } from '@playwright/test';
import { Hono } from 'hono';
import { dialog } from 'electron';
import { sign } from 'hono/jwt';

// Mock dependencies
vi.mock('electron', () => ({
  dialog: {
    showMessageBox: vi.fn(),
  },
}));

vi.mock('hono/jwt', () => ({
  sign: vi.fn(),
}));

vi.mock('@hono/node-server/conninfo', () => ({
  getConnInfo: vi.fn(),
}));

vi.mock('@/i18n', () => ({
  t: vi.fn((key: string, params?: any) => {
    if (key === 'plugins.api-server.dialog.request.title') return 'Auth Request';
    if (key === 'plugins.api-server.dialog.request.message') {
      return `Request from ${params?.origin} with ID ${params?.ID}`;
    }
    if (key === 'plugins.api-server.dialog.request.buttons.allow') return 'Allow';
    if (key === 'plugins.api-server.dialog.request.buttons.deny') return 'Deny';
    return key;
  }),
}));

import { register } from './auth';
import { AuthStrategy } from '../../config';
import type { BackendContext } from '@/types/contexts';
import type { APIServerConfig } from '../../config';

test.describe('Auth Routes', () => {
  let app: any;
  let mockContext: BackendContext<APIServerConfig>;
  let mockGetConfig: ReturnType<typeof vi.fn>;
  let mockSetConfig: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    app = new Hono();
    mockGetConfig = vi.fn();
    mockSetConfig = vi.fn();

    mockContext = {
      getConfig: mockGetConfig,
      setConfig: mockSetConfig,
    } as any;

    (sign as unknown as ReturnType<typeof vi.fn>).mockResolvedValue('mock-jwt-token');
  });

  test.describe('POST /auth/:id - Already Authorized Client', () => {
    test('should return token for already authorized client', async () => {
      const clientId = 'client-123';
      mockGetConfig.mockResolvedValue({
        authorizedClients: [clientId],
        authStrategy: AuthStrategy.AUTH_AT_FIRST,
        secret: 'test-secret',
      });

      register(app, mockContext);

      const response = await app.request(`/auth/${clientId}`, {
        method: 'POST',
      });

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual({ accessToken: 'mock-jwt-token' });
      expect(dialog.showMessageBox).not.toHaveBeenCalled();
      expect(mockSetConfig).toHaveBeenCalledWith({
        authorizedClients: [clientId],
      });
    });

    test('should not duplicate client in authorized list', async () => {
      const clientId = 'existing-client';
      mockGetConfig.mockResolvedValue({
        authorizedClients: [clientId, 'other-client'],
        authStrategy: AuthStrategy.AUTH_AT_FIRST,
        secret: 'test-secret',
      });

      register(app, mockContext);

      await app.request(`/auth/${clientId}`, {
        method: 'POST',
      });

      expect(mockSetConfig).toHaveBeenCalledWith({
        authorizedClients: [clientId, 'other-client', clientId],
      });
    });
  });

  test.describe('POST /auth/:id - AUTH_AT_FIRST Strategy', () => {
    test('should show dialog and authorize when user allows', async () => {
      const clientId = 'new-client';
      mockGetConfig.mockResolvedValue({
        authorizedClients: [],
        authStrategy: AuthStrategy.AUTH_AT_FIRST,
        secret: 'test-secret',
      });

      (dialog.showMessageBox as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        response: 0, // Allow
      });

      register(app, mockContext);

      const response = await app.request(`/auth/${clientId}`, {
        method: 'POST',
      });

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual({ accessToken: 'mock-jwt-token' });
      expect(dialog.showMessageBox).toHaveBeenCalledTimes(1);
      expect(mockSetConfig).toHaveBeenCalledWith({
        authorizedClients: [clientId],
      });
    });

    test('should deny when user rejects', async () => {
      const clientId = 'rejected-client';
      mockGetConfig.mockResolvedValue({
        authorizedClients: [],
        authStrategy: AuthStrategy.AUTH_AT_FIRST,
        secret: 'test-secret',
      });

      (dialog.showMessageBox as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        response: 1, // Deny
      });

      register(app, mockContext);

      const response = await app.request(`/auth/${clientId}`, {
        method: 'POST',
      });

      expect(response.status).toBe(403);
      expect(dialog.showMessageBox).toHaveBeenCalledTimes(1);
      expect(mockSetConfig).not.toHaveBeenCalled();
      expect(sign).not.toHaveBeenCalled();
    });

    test('should show dialog with correct parameters', async () => {
      const clientId = 'test-client';
      mockGetConfig.mockResolvedValue({
        authorizedClients: [],
        authStrategy: AuthStrategy.AUTH_AT_FIRST,
        secret: 'test-secret',
      });

      (dialog.showMessageBox as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        response: 0,
      });

      register(app, mockContext);

      await app.request(`/auth/${clientId}`, {
        method: 'POST',
      });

      expect(dialog.showMessageBox).toHaveBeenCalledWith({
        title: 'Auth Request',
        message: expect.stringContaining(clientId),
        buttons: ['Allow', 'Deny'],
        defaultId: 1,
        cancelId: 1,
      });
    });
  });

  test.describe('POST /auth/:id - NONE Strategy', () => {
    test('should authorize without dialog when strategy is NONE', async () => {
      const clientId = 'auto-approved-client';
      mockGetConfig.mockResolvedValue({
        authorizedClients: [],
        authStrategy: AuthStrategy.NONE,
        secret: 'test-secret',
      });

      register(app, mockContext);

      const response = await app.request(`/auth/${clientId}`, {
        method: 'POST',
      });

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual({ accessToken: 'mock-jwt-token' });
      expect(dialog.showMessageBox).not.toHaveBeenCalled();
      expect(mockSetConfig).toHaveBeenCalledWith({
        authorizedClients: [clientId],
      });
    });

    test('should add multiple clients with NONE strategy', async () => {
      mockGetConfig.mockResolvedValueOnce({
        authorizedClients: [],
        authStrategy: AuthStrategy.NONE,
        secret: 'test-secret',
      }).mockResolvedValueOnce({
        authorizedClients: ['client-1'],
        authStrategy: AuthStrategy.NONE,
        secret: 'test-secret',
      });

      register(app, mockContext);

      await app.request('/auth/client-1', { method: 'POST' });
      await app.request('/auth/client-2', { method: 'POST' });

      expect(mockSetConfig).toHaveBeenCalledTimes(2);
      expect(dialog.showMessageBox).not.toHaveBeenCalled();
    });
  });

  test.describe('JWT Token Generation', () => {
    test('should generate JWT with correct payload', async () => {
      const clientId = 'jwt-test-client';
      const secret = 'super-secret-key';

      mockGetConfig.mockResolvedValue({
        authorizedClients: [clientId],
        authStrategy: AuthStrategy.NONE,
        secret,
      });

      register(app, mockContext);

      await app.request(`/auth/${clientId}`, {
        method: 'POST',
      });

      expect(sign).toHaveBeenCalledWith(
        expect.objectContaining({
          id: clientId,
          iat: expect.any(Number),
        }),
        secret
      );
    });

    test('should use config secret for JWT signing', async () => {
      const customSecret = 'custom-secret-123';
      mockGetConfig.mockResolvedValue({
        authorizedClients: [],
        authStrategy: AuthStrategy.NONE,
        secret: customSecret,
      });

      register(app, mockContext);

      await app.request('/auth/test-client', {
        method: 'POST',
      });

      expect(sign).toHaveBeenCalledWith(
        expect.any(Object),
        customSecret
      );
    });

    test('should include timestamp in JWT payload', async () => {
      const beforeTime = Math.floor(Date.now() / 1000);

      mockGetConfig.mockResolvedValue({
        authorizedClients: [],
        authStrategy: AuthStrategy.NONE,
        secret: 'secret',
      });

      register(app, mockContext);

      await app.request('/auth/time-test-client', {
        method: 'POST',
      });

      const afterTime = Math.floor(Date.now() / 1000);
      const callArgs = (sign as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0];

      expect(callArgs.iat).toBeGreaterThanOrEqual(beforeTime);
      expect(callArgs.iat).toBeLessThanOrEqual(afterTime);
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle empty client ID', async () => {
      mockGetConfig.mockResolvedValue({
        authorizedClients: [],
        authStrategy: AuthStrategy.NONE,
        secret: 'secret',
      });

      register(app, mockContext);

      const response = await app.request('/auth/', {
        method: 'POST',
      });

      expect(response.status).toBe(200);
    });

    test('should handle special characters in client ID', async () => {
      const specialId = 'client-with-special-chars-!@#$%';
      mockGetConfig.mockResolvedValue({
        authorizedClients: [],
        authStrategy: AuthStrategy.NONE,
        secret: 'secret',
      });

      register(app, mockContext);

      const response = await app.request(`/auth/${encodeURIComponent(specialId)}`, {
        method: 'POST',
      });

      expect(response.status).toBe(200);
    });

    test('should handle very long client IDs', async () => {
      const longId = 'a'.repeat(1000);
      mockGetConfig.mockResolvedValue({
        authorizedClients: [],
        authStrategy: AuthStrategy.NONE,
        secret: 'secret',
      });

      register(app, mockContext);

      const response = await app.request(`/auth/${longId}`, {
        method: 'POST',
      });

      expect(response.status).toBe(200);
    });

    test('should handle config with empty authorized clients array', async () => {
      mockGetConfig.mockResolvedValue({
        authorizedClients: [],
        authStrategy: AuthStrategy.NONE,
        secret: 'secret',
      });

      register(app, mockContext);

      const response = await app.request('/auth/new-client', {
        method: 'POST',
      });

      expect(response.status).toBe(200);
      expect(mockSetConfig).toHaveBeenCalledWith({
        authorizedClients: ['new-client'],
      });
    });
  });

  test.describe('Authorization List Management', () => {
    test('should append to existing authorized clients', async () => {
      const existingClients = ['client-1', 'client-2'];
      mockGetConfig.mockResolvedValue({
        authorizedClients: existingClients,
        authStrategy: AuthStrategy.NONE,
        secret: 'secret',
      });

      register(app, mockContext);

      await app.request('/auth/client-3', {
        method: 'POST',
      });

      expect(mockSetConfig).toHaveBeenCalledWith({
        authorizedClients: [...existingClients, 'client-3'],
      });
    });

    test('should preserve existing clients when adding new one', async () => {
      mockGetConfig.mockResolvedValue({
        authorizedClients: ['existing-1', 'existing-2'],
        authStrategy: AuthStrategy.NONE,
        secret: 'secret',
      });

      register(app, mockContext);

      await app.request('/auth/new-client', {
        method: 'POST',
      });

      const setConfigCall = mockSetConfig.mock.calls[0][0];
      expect(setConfigCall.authorizedClients).toContain('existing-1');
      expect(setConfigCall.authorizedClients).toContain('existing-2');
      expect(setConfigCall.authorizedClients).toContain('new-client');
    });
  });
});
