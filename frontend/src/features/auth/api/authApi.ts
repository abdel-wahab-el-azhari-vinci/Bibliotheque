import { httpClient } from '../../../shared/api/httpClient';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  User,
} from '../types';

/** ✅ Tous les appels API passent par ici (jamais de fetch/axios direct dans les screens) */
export const authApi = {
  /** POST /auth/login - Se connecter */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await httpClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  /** POST /auth/register - S'inscrire */
  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await httpClient.post<LoginResponse>('/auth/register', data);
    return response.data;
  },

  /** POST /auth/refresh - Rafraîchir le token */
  refreshToken: async (data: RefreshTokenRequest): Promise<LoginResponse> => {
    const response = await httpClient.post<LoginResponse>('/auth/refresh', data);
    return response.data;
  },

  /** GET /auth/me - Obtenir info utilisateur courant (nécessite JWT valide) */
  getCurrentUser: async (): Promise<User> => {
    const response = await httpClient.get<User>('/auth/me');
    return response.data;
  },

  /** POST /auth/logout - Logout (côté frontend) */
  logout: async (): Promise<void> => {
    // Optionnel : notifier le backend (stateless, donc pas obligatoire)
    try {
      await httpClient.post('/auth/logout', {});
    } catch (error) {
      console.warn('Logout notification échouée (ignoré):', error);
    }
  },
};
