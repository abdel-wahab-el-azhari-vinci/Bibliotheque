import { httpClient } from '../../../shared/api/httpClient';
import type { Livre, LivreRequest, Auteur, Genre, Langue } from '../types';

export const livresApi = {
  getAll: async (): Promise<Livre[]> => {
    const response = await httpClient.get<Livre[]>('/livres');
    return response.data;
  },

  getById: async (id: number): Promise<Livre> => {
    const response = await httpClient.get<Livre>(`/livres/${id}`);
    return response.data;
  },

  search: async (titre: string): Promise<Livre[]> => {
    const response = await httpClient.get<Livre[]>('/livres/search', {
      params: { titre },
    });
    return response.data;
  },

  create: async (data: LivreRequest): Promise<Livre> => {
    const response = await httpClient.post<Livre>('/livres', data);
    return response.data;
  },

  update: async (id: number, data: Partial<LivreRequest>): Promise<Livre> => {
    const response = await httpClient.patch<Livre>(`/livres/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`/livres/${id}`);
  },
};

export const auteursApi = {
  getAll: async (): Promise<Auteur[]> => {
    const response = await httpClient.get<Auteur[]>('/auteurs');
    return response.data;
  },

  getById: async (id: number): Promise<Auteur> => {
    const response = await httpClient.get<Auteur>(`/auteurs/${id}`);
    return response.data;
  },

  search: async (nom: string): Promise<Auteur[]> => {
    const response = await httpClient.get<Auteur[]>('/auteurs/search', {
      params: { nom },
    });
    return response.data;
  },
};

export const genresApi = {
  getAll: async (): Promise<Genre[]> => {
    const response = await httpClient.get<Genre[]>('/genres');
    return response.data;
  },

  getById: async (id: number): Promise<Genre> => {
    const response = await httpClient.get<Genre>(`/genres/${id}`);
    return response.data;
  },
};

export const languesApi = {
  getAll: async (): Promise<Langue[]> => {
    const response = await httpClient.get<Langue[]>('/langues');
    return response.data;
  },

  getById: async (id: number): Promise<Langue> => {
    const response = await httpClient.get<Langue>(`/langues/${id}`);
    return response.data;
  },
};
