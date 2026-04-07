export interface Livre {
  id: number;
  titre: string;
  isbn: string;
  resume: string;
  datePublication: string;
  auteurNom: string;
  genreLibelle: string;
  langueLibelle: string;
  statusStock: string;
  nbExemplairesDisponibles: number;
}

export interface LivreRequest {
  titre: string;
  auteurId: number;
  genreId: number;
  langueId: number;
  isbn?: string;
  resume?: string;
  datePublication?: string;
}

export interface Auteur {
  id: number;
  nom: string;
  prenom?: string;
  biographie?: string;
  dateNaissance?: string;
}

export interface Genre {
  id: number;
  libelle: string;
  description?: string;
}

export interface Langue {
  id: number;
  libelle: string;
  code?: string;
}
