import { httpClient } from '../../../shared/api/httpClient';

export interface BorrowRequest {
  livreId: number;
}

export interface BorrowResponse {
  id: number;
  livreId: number;
  utilisateurId: number;
  dateEmprunt: string;
  dateRetourPrevu: string;
  dateRetourEffectif?: string;
  statut: 'EN_COURS' | 'RETOURNE' | 'PERDU';
  titre: string;
  auteur: string;
}

export const possessionApi = {
  // Emprunter un livre
  borrow: async (livreId: number): Promise<BorrowResponse> => {
    const response = await httpClient.post<BorrowResponse>('/possessions/borrow', {
      livreId,
    });
    return response.data;
  },

  // Retourner un livre emprunté
  returnBook: async (possessionId: number): Promise<BorrowResponse> => {
    const response = await httpClient.patch<BorrowResponse>(`/possessions/${possessionId}/return`);
    return response.data;
  },

  // Récupérer mes emprunts
  getMyBorrows: async (): Promise<BorrowResponse[]> => {
    const response = await httpClient.get<BorrowResponse[]>('/possessions/me');
    return response.data;
  },

  // Récupérer un emprunt par ID
  getById: async (id: number): Promise<BorrowResponse> => {
    const response = await httpClient.get<BorrowResponse>(`/possessions/${id}`);
    return response.data;
  },

  // Récupérer l'historique des emprunts
  getHistory: async (): Promise<BorrowResponse[]> => {
    const response = await httpClient.get<BorrowResponse[]>('/possessions/history');
    return response.data;
  },
};
