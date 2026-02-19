import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * ============================================================================
 * HTTP CLIENT GLOBAL
 * ============================================================================
 *
 * Responsabilités :
 * - Un SEUL client HTTP pour toute l'app
 * - Gérer les tokens JWT automatiquement
 * - Injecter le token dans TOUS les headers
 * - Gérer les erreurs 401 (token expiré)
 * - Gérer les erreurs réseau
 *
 * Règle AI_RULES.md : UN SEUL httpClient global, partagé partout
 * Pas d'axios/fetch dans les components !
 *
 * UTILISÉ PAR : authApi.ts, productsApi.ts, etc...
 */

// Configuration globale
const API_BASE_URL = 'http://localhost:8080/api';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_info';

interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
}

class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(config: HttpClientConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur REQUEST : ajouter le token à CHAQUE requête
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          const token = await AsyncStorage.getItem(TOKEN_KEY);
          if (token) {
            // Format : Bearer <token>
            config.headers.Authorization = `Bearer ${token}`;
            console.log('��� Token injecté dans les headers');
          }
        } catch (error) {
          console.error('❌ Erreur lors de la récupération du token:', error);
        }
        return config;
      }
    );

    // Intercepteur RESPONSE : gérer les erreurs 401
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expiré ou invalide
          console.warn('⚠️ Token expiré (401) - Nettoyer et rediriger vers login');
          
          // Supprimer le token + user infos
          await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
          
          // TODO : Rediriger vers LoginScreen (avec Navigation)
          // navigation.navigate('Login');
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * GET - Récupérer des données
   */
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.get<T>(url, config).then((res) => res.data);
  }

  /**
   * POST - Envoyer des données (CREATE)
   */
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.post<T>(url, data, config).then((res) => res.data);
  }

  /**
   * PUT - Modifier des données (UPDATE)
   */
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.put<T>(url, data, config).then((res) => res.data);
  }

  /**
   * DELETE - Supprimer des données
   */
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.delete<T>(url, config).then((res) => res.data);
  }

  /**
   * Récupérer l'instance axios brute (en cas de besoin spécial)
   */
  getAxios(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Créer et exporter l'unique instance globale
export const httpClient = new HttpClient({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Exporter les clés de stockage
export { TOKEN_KEY, USER_KEY };
