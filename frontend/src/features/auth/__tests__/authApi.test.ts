import { HttpClientManager } from '../api/authApi';
import MockAdapter from 'axios-mock-adapter';

describe('AuthApi', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter((HttpClientManager as any).getInstance()['client']);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('Login', () => {
    it('should successfully login with valid credentials', async () => {
      const credentials = {
        email: 'user@example.com',
        password: 'password123',
      };

      const response = {
        accessToken: 'jwt-token-123',
        refreshToken: 'refresh-token-123',
        user: {
          id: 1,
          email: 'user@example.com',
          role: 'USER',
        },
      };

      mockAxios.onPost('/api/auth/login', credentials).reply(200, response);

      const result = await (HttpClientManager as any).login(credentials);
      expect(result.accessToken).toBe('jwt-token-123');
      expect(result.user.email).toBe('user@example.com');
    });

    it('should handle invalid credentials', async () => {
      const credentials = {
        email: 'user@example.com',
        password: 'wrongpassword',
      };

      mockAxios.onPost('/api/auth/login', credentials).reply(401, {
        error: 'Invalid credentials',
      });

      await expect((HttpClientManager as any).login(credentials)).rejects.toThrow();
    });

    it('should handle server errors', async () => {
      const credentials = {
        email: 'user@example.com',
        password: 'password123',
      };

      mockAxios.onPost('/api/auth/login').reply(500, {
        error: 'Server error',
      });

      await expect((HttpClientManager as any).login(credentials)).rejects.toThrow();
    });
  });

  describe('Register', () => {
    it('should successfully register new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const response = {
        user: {
          id: 1,
          email: 'newuser@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
        accessToken: 'jwt-token-123',
      };

      mockAxios.onPost('/api/auth/register', userData).reply(201, response);

      const result = await (HttpClientManager as any).register(userData);
      expect(result.user.email).toBe('newuser@example.com');
      expect(result.accessToken).toBeDefined();
    });

    it('should handle duplicate email', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockAxios.onPost('/api/auth/register').reply(409, {
        error: 'Email already exists',
      });

      await expect((HttpClientManager as any).register(userData)).rejects.toThrow();
    });

    it('should validate input data', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123',
      };

      mockAxios.onPost('/api/auth/register').reply(400, {
        error: 'Validation failed',
      });

      await expect((HttpClientManager as any).register(invalidData)).rejects.toThrow();
    });
  });

  describe('Token Refresh', () => {
    it('should refresh access token', async () => {
      const refreshToken = 'refresh-token-123';
      const newAccessToken = 'new-jwt-token';

      mockAxios.onPost('/api/auth/refresh').reply(200, {
        accessToken: newAccessToken,
      });

      const result = await (HttpClientManager as any).refreshToken(refreshToken);
      expect(result.accessToken).toBe(newAccessToken);
    });

    it('should handle invalid refresh token', async () => {
      mockAxios.onPost('/api/auth/refresh').reply(401, {
        error: 'Invalid refresh token',
      });

      await expect((HttpClientManager as any).refreshToken('invalid')).rejects.toThrow();
    });
  });

  describe('Logout', () => {
    it('should successfully logout', async () => {
      mockAxios.onPost('/api/auth/logout').reply(200, { message: 'Logged out' });

      const result = await (HttpClientManager as any).logout();
      expect(result).toBeDefined();
    });

    it('should handle logout errors gracefully', async () => {
      mockAxios.onPost('/api/auth/logout').reply(500);

      await expect((HttpClientManager as any).logout()).rejects.toThrow();
    });
  });
});
