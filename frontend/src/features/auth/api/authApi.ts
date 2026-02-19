import { httpClient, TOKEN_KEY, USER_KEY } from '../../../shared/api/httpClient';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  UserInfo,
  ApiError,
} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * ============================================================================
 * AUTH API
 * ============================================================================
 *
 * Responsabilités :
 * - TOUS les appels au backend pour l'auth
 * - Utiliser le httpClient global (UN SEUL!)
 * - Stocker/récupérer le token et les infos user
 * - Gérer les erreurs
 *
 * Règle AI_RULES.md : 
 * - Les screens ne font JAMAIS d'axios/fetch
 * - Tous les appels passent par ici
 * - Jamais de logique métier dans les screens
 *
 * UTILISÉ PAR : RegisterScreen.tsx, LoginScreen.tsx, etc...
 */

class AuthApi {
  /**
   * REGISTER - Créer un compte
   *
   * @param data Données d'inscription (email, password, nom, prenom)
   * @returns Réponse du backend avec token + infos user
   * @throws ApiError si email déjà utilisé ou validation échouée
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      console.log('��� Envoi requête REGISTER:', { email: data.email });

      // Appel au backend POST /auth/register
      const response = await httpClient.post<RegisterResponse>(
        '/auth/register',
        data
      );

      // Étape 1 : Stocker le token
      await AsyncStorage.setItem(TOKEN_KEY, response.token);
      console.log('✅ Token stocké');

      // Étape 2 : Stocker les infos utilisateur
      const userInfo: UserInfo = {
        id: response.id,
        email: response.email,
        nom: response.nom,
        prenom: response.prenom,
        role: response.role,
        status: response.status,
      };
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userInfo));
      console.log('✅ Infos utilisateur stockées');

      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.messages?.email ||
        error.response?.data?.error ||
        'Erreur lors de l\'inscription';

      console.error('❌ Erreur REGISTER:', message);
      throw {
        error: message,
        messages: error.response?.data?.messages || {},
      } as ApiError;
    }
  }

  /**
   * LOGIN - Authentifier un utilisateur
   *
   * @param data Données de login (email, password)
   * @returns Réponse du backend avec token + infos user
   * @throws ApiError si credentials invalides
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('��� Envoi requête LOGIN:', { email: data.email });

      // Appel au backend POST /auth/login
      const response = await httpClient.post<LoginResponse>('/auth/login', data);

      // Étape 1 : Stocker le token
      await AsyncStorage.setItem(TOKEN_KEY, response.token);
      console.log('✅ Token stocké');

      // Étape 2 : Stocker les infos utilisateur
      const userInfo: UserInfo = {
        id: response.id,
        email: response.email,
        nom: response.nom,
        prenom: response.prenom,
        role: response.role,
        status: response.status,
      };
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userInfo));
      console.log('✅ Infos utilisateur stockées');

      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.messages?.email ||
        error.response?.data?.error ||
        'Erreur lors de la connexion';

      console.error('❌ Erreur LOGIN:', message);
      throw {
        error: message,
        messages: error.response?.data?.messages || {},
      } as ApiError;
    }
  }

  /**
   * LOGOUT - Déconnecter l'utilisateur
   * Supprimer le token et les infos utilisateur
   */
  async logout(): Promise<void> {
    try {
      console.log('��� Déconnexion');
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
      console.log('✅ Déconnecté');
    } catch (error) {
      console.error('❌ Erreur LOGOUT:', error);
      throw error;
    }
  }

  /**
   * GET STORED USER INFO - Récupérer les infos utilisateur stockées
   * Utilisé pour vérifier si l'utilisateur est connecté
   */
  async getStoredUserInfo(): Promise<UserInfo | null> {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      if (!userJson) return null;
      return JSON.parse(userJson) as UserInfo;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des infos user:', error);
      return null;
    }
  }

  /**
   * IS AUTHENTICATED - Vérifier si l'utilisateur est connecté
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return !!token;
    } catch {
      return false;
    }
  }

  /**
   * CLEAR - Nettoyer toutes les données d'auth (en cas d'erreur système)
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage:', error);
    }
  }
}

// Exporter l'instance unique globale
export const authApi = new AuthApi();
