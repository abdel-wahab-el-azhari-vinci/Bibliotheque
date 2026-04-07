import { httpClient } from '../../../shared/api/httpClient';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  User,
} from '../types';

/** ‚úÖ Tous les appels API passent par ici (jamais de fetch/axios direct dans les screens) */
export const authApi = {
  /** POST /auth/login - Se connecter */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await httpClient.post<LoginResponse>('/auth/login', data);
    console.log('Ì≥± RAW RESPONSE from backend:', response.data);
    return response.data;
  },

  /** POST /auth/register - S'inscrire */
  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await httpClient.post<LoginResponse>('/auth/register', data);
    console.log('Ì≥± RAW RESPONSE from backend:', response.data);
    return response.data;
  },

  /** POST /auth/refresh - Rafra√Æchir le token */
  refreshToken: async (data: RefreshTokenRequest): Promise<LoginResponse> => {
    const response = await httpClient.post<LoginResponse>('/auth/refresh', data);
    return response.data;
  },

  /** GET /auth/me - Obtenir info utilisateur courant (n√©cessite JWT valide) */
  getCurrentUser: async (): Promise<User> => {
    const response = await httpClient.get<User>('/auth/me');
    return response.data;
  },

  /** POST /auth/logout - Logout (c√¥t√© frontend) */
  logout: async (): Promise<void> => {
    // Optionnel : notifier le backend (stateless, donc pas obligatoire)
    try {
      await httpClient.post('/auth/logout', {});
    } catch (error) {
      console.warn('Logout notification √©chou√©e (ignor√©):', error);
    }
  },
};
