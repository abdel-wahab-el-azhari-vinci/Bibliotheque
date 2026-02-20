export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    nom: string;
    prenom: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
}
