import axios, { AxiosError, AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** Configuration */
const API_URL = 'http://localhost:8082/api';

/** Types pour token storage */
interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/** Classe de gestion du httpClient avec JWT */
class HttpClientManager {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // ✅ INTERCEPTEUR REQUEST : Injecter le JWT automatiquement
    this.client.interceptors.request.use(
      async (config) => {
        const token = await this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ✅ INTERCEPTEUR RESPONSE : Gérer refreshToken sur 401
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (this.isRefreshing) {
            // Attendre que le refresh se termine
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.client(originalRequest));
              });
            });
          }

          this.isRefreshing = true;

          try {
            const newToken = await this.refreshAccessToken();
            this.isRefreshing = false;
            this.onRefreshed(newToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            this.isRefreshing = false;
            // ❌ Refresh échoué → nettoyer et rediriger vers login
            await this.clearTokens();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /** ✅ Stocker les tokens après login/register */
  async saveTokens(data: TokenData): Promise<void> {
    try {
      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      await AsyncStorage.setItem('tokenExpiration', String(Date.now() + data.expiresIn * 1000));
    } catch (error) {
      console.error('Erreur sauvegarde tokens:', error);
    }
  }

  /** ✅ Récupérer le token d'accès */
  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('accessToken');
    } catch (error) {
      console.error('Erreur lecture accessToken:', error);
      return null;
    }
  }

  /** ✅ Récupérer le token de rafraîchissement */
  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('refreshToken');
    } catch (error) {
      console.error('Erreur lecture refreshToken:', error);
      return null;
    }
  }

  /** ✅ Rafraîchir le token automatiquement */
  private async refreshAccessToken(): Promise<string> {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post<TokenData>(
        `${API_URL}/auth/refresh`,
        { token: refreshToken }
      );

      const { accessToken, expiresIn } = response.data;
      await this.saveTokens({
        accessToken,
        refreshToken,
        expiresIn,
      });

      return accessToken;
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  }

  /** ✅ Nettoyage des tokens (logout) */
  async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('tokenExpiration');
    } catch (error) {
      console.error('Erreur suppression tokens:', error);
    }
  }

  /** ✅ Vérifier si utilisateur est authentifié */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token;
  }

  /** ✅ Callback appelé après refresh token réussi */
  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  /** ✅ Retourner l'instance axios */
  getClient(): AxiosInstance {
    return this.client;
  }
}

// ✅ Instance singleton (un seul httpClient dans toute l'app)
const httpClientManager = new HttpClientManager();
export const httpClient = httpClientManager.getClient();
export default httpClientManager;
