import { httpClient } from '../../../shared/api/httpClient';

export interface Penalty {
  id: number;
  userId: number;
  userName: string;
  livreId: number;
  titreLivre: string;
  possessionId: number;
  dateCreation: string;
  dateExpirationEmprunt: string;
  dateRetourActual: string;
  datePaiement?: string;
  nombreJoursRetard: number;
  tarifJournalier: number;
  montantTotal: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'WAIVED';
  notes?: string;
}

export interface UserPenaltySummary {
  userId: number;
  pendingPenaltiesCount: number;
  totalPendingAmount: number;
  canBorrow: boolean;
}

class PenaltiesApi {
  /**
   * Get all penalties, all users (ADMIN only)
   */
  async getAllPenalties(): Promise<Penalty[]> {
    const response = await httpClient.get<Penalty[]>('/penalties');
    return response.data;
  }

  /**
   * Get all penalties for the authenticated user
   */
  async getMyPenalties(): Promise<Penalty[]> {
    const response = await httpClient.get<Penalty[]>('/penalties/my-penalties');
    return response.data;
  }

  /**
   * Get pending penalties only
   */
  async getPendingPenalties(): Promise<Penalty[]> {
    const response = await httpClient.get<Penalty[]>('/penalties/pending');
    return response.data;
  }

  /**
   * Get penalty summary (includes canBorrow flag for blocking logic)
   */
  async getPenaltySummary(): Promise<UserPenaltySummary> {
    const response = await httpClient.get<UserPenaltySummary>('/penalties/summary');
    return response.data;
  }

  /**
   * Get details of a specific penalty
   */
  async getPenaltyDetails(penaltyId: number): Promise<Penalty> {
    const response = await httpClient.get<Penalty>(`/penalties/${penaltyId}`);
    return response.data;
  }

  /**
   * Pay a penalty
   */
  async payPenalty(penaltyId: number, paymentMethod: string): Promise<Penalty> {
    const response = await httpClient.post<Penalty>(`/penalties/${penaltyId}/pay`, {
      penaltyId,
      paymentMethod,
    });
    return response.data;
  }

  /**
   * Cancel a penalty (admin only)
   */
  async cancelPenalty(penaltyId: number, reason: string): Promise<Penalty> {
    const response = await httpClient.post<Penalty>(
      `/penalties/${penaltyId}/cancel?reason=${encodeURIComponent(reason)}`
    );
    return response.data;
  }

  /**
   * Waive a penalty (admin only)
   */
  async waivePenalty(penaltyId: number, reason: string): Promise<Penalty> {
    const response = await httpClient.post<Penalty>(
      `/penalties/${penaltyId}/waive?reason=${encodeURIComponent(reason)}`
    );
    return response.data;
  }
}

export const penaltiesApi = new PenaltiesApi();
