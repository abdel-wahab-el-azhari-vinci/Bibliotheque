import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import HttpClientManager from '../httpClient';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store');

describe('HttpClientManager', () => {
  let httpClientManager: HttpClientManager;
  let mockAxios: MockAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    httpClientManager = new (HttpClientManager as any)();
    mockAxios = new MockAdapter(httpClientManager['client']);
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);
    (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('Token Management', () => {
    it('should store and retrieve access token', async () => {
      const token = 'test-access-token';
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(token);

      const retrieved = await httpClientManager['getAccessToken']();
      expect(retrieved).toBe(token);
    });

    it('should store refresh token', async () => {
      const refreshToken = 'test-refresh-token';
      await httpClientManager['storeRefreshToken'](refreshToken);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('refreshToken', refreshToken);
    });

    it('should clear tokens on logout', async () => {
      await httpClientManager['clearTokens']();
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('accessToken');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('Request Interceptor', () => {
    it('should inject Bearer token in Authorization header', async () => {
      const token = 'jwt-token-123';
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(token);
      mockAxios.onGet('/api/books').reply(200, { data: [] });

      await httpClientManager['client'].get('/api/books');

      expect(mockAxios.history.get[0].headers.Authorization).toBe(`Bearer ${token}`);
    });

    it('should not inject header if token is not available', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
      mockAxios.onGet('/api/books').reply(200, { data: [] });

      await httpClientManager['client'].get('/api/books');

      expect(mockAxios.history.get[0].headers.Authorization).toBeUndefined();
    });
  });

  describe('Response Interceptor - Token Refresh', () => {
    it('should refresh token on 401 response', async () => {
      const oldToken = 'old-token';
      const newToken = 'new-token';
      (SecureStore.getItemAsync as jest.Mock)
        .mockResolvedValueOnce(oldToken)
        .mockResolvedValueOnce(newToken);

      mockAxios.onPost('/api/auth/refresh').reply(200, { accessToken: newToken });
      mockAxios.onGet('/api/books').replyOnce(401).replyOnce(200, { data: [] });

      try {
        await httpClientManager['client'].get('/api/books');
      } catch (e) {
        // Expected to fail on first attempt
      }

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('accessToken', newToken);
    });

    it('should handle refresh token failure', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('old-token');
      mockAxios.onGet('/api/books').reply(401);
      mockAxios.onPost('/api/auth/refresh').reply(401);

      await expect(httpClientManager['client'].get('/api/books')).rejects.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mockAxios.onGet('/api/books').networkError();

      await expect(httpClientManager['client'].get('/api/books')).rejects.toThrow();
    });

    it('should handle timeout errors', async () => {
      mockAxios.onGet('/api/books').timeoutOnce();

      await expect(httpClientManager['client'].get('/api/books')).rejects.toThrow();
    });

    it('should pass through 5xx errors without retry', async () => {
      mockAxios.onGet('/api/books').reply(500);

      await expect(httpClientManager['client'].get('/api/books')).rejects.toThrow();
      expect(mockAxios.history.get.length).toBe(1);
    });
  });
});
