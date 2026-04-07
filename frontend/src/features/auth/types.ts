/** ✅ Types pour l'authentification - Alignés avec backend Spring Boot */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  userId: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  expiresIn: number; // en secondes (3600)
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface RefreshTokenRequest {
  token: string;
}

export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
}
