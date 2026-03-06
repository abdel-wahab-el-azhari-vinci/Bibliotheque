import { httpClient } from '../../../shared/api/httpClient';
import type { Livre, LivreRequest } from '../types';

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
