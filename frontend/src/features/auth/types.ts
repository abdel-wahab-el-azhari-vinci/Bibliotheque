/**
 * ============================================================================
 * TYPES & DTOs - Authentification
 * ============================================================================
 *
 * Correspondance EXACTE avec le backend Spring Boot :
 * - RegisterRequest (envoyé au backend)
 * - RegisterResponse (reçu du backend)
 * - UserInfo (stocké localement)
 *
 * TypeScript strict : aucun 'any' !
 */

/**
 * Requête d'inscription (envoyée au backend)
 * Correspond à : com.bibliotheque.auth.dto.RegisterRequest.java
 */
export interface RegisterRequest {
  email: string;          // Format email valide
  password: string;       // Min 6 caractères
  nom: string;           // 2-100 caractères
  prenom: string;        // 2-100 caractères
}

/**
 * Réponse après inscription (reçue du backend)
 * Correspond à : com.bibliotheque.auth.dto.RegisterResponse.java
 */
export interface RegisterResponse {
  id: number;             // ID utilisateur créé
  email: string;
  nom: string;
  prenom: string;
  role: string;           // "USER" après inscription
  status: string;         // "ACTIF" après inscription
  token: string;          // JWT token - stocker localement
  message: string;        // Message de confirmation
}

/**
 * Informations utilisateur stockées localement
 * Utilisé par le frontend pour afficher les infos de l'utilisateur connecté
 */
export interface UserInfo {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  status: string;
}

/**
 * Requête de login (pour future utilisation)
 * Correspond à : com.bibliotheque.auth.dto.LoginRequest.java
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Réponse après login (pour future utilisation)
 * Correspond à : com.bibliotheque.auth.dto.LoginResponse.java
 */
export interface LoginResponse {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  status: string;
  token: string;
}

/**
 * Format d'erreur standardisé du backend
 */
export interface ApiError {
  error: string;
  messages?: {
    [key: string]: string;  // { "email": "message d'erreur" }
  };
  timestamp?: string;
  status?: number;
}
