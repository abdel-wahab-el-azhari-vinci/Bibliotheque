import axios from 'axios';
import { API_BASE_URL } from '../../../config/env';

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
  datePayement?: string;
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

export interface PayPenaltyRequest {
  penaltyId: number;
  paymentMethod: string;
}

class PenaltiesApi {
  private baseUrl = `${API_BASE_URL}/api/penalties`;

  /**
   * Get all penalties for the authenticated user
   */
  async getMyPenalties(token: string): Promise<Penalty[]> {
    try {
      const response = await axios.get<Penalty[]>(
        `${this.baseUrl}/my-penalties`,
        this.getHeaders(token)
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user penalties:', error);
      throw error;
    }
  }

  /**
   * Get pending penalties only
   */
  async getPendingPenalties(token: string): Promise<Penalty[]> {
    try {
      const response = await axios.get<Penalty[]>(
        `${this.baseUrl}/pending`,
        this.getHeaders(token)
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pending penalties:', error);
      throw error;
    }
  }

  /**
   * Get penalty summary (includes canBorrow flag for blocking logic)
   */
  async getPenaltySummary(token: string): Promise<UserPenaltySummary> {
    try {
      const response = await axios.get<UserPenaltySummary>(
        `${this.baseUrl}/summary`,
        this.getHeaders(token)
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch penalty summary:', error);
      throw error;
    }
  }

  /**
   * Get details of a specific penalty
   */
  async getPenaltyDetails(penaltyId: number, token: string): Promise<Penalty> {
    try {
      const response = await axios.get<Penalty>(
        `${this.baseUrl}/${penaltyId}`,
        this.getHeaders(token)
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch penalty ${penaltyId}:`, error);
      throw error;
    }
  }

  /**
   * Pay a penalty
   */
  async payPenalty(
    penaltyId: number,
    paymentMethod: string,
    token: string
  ): Promise<Penalty> {
    try {
      const response = await axios.post<Penalty>(
        `${this.baseUrl}/${penaltyId}/pay`,
        { penaltyId, paymentMethod },
        this.getHeaders(token)
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to pay penalty ${penaltyId}:`, error);
      throw error;
    }
  }

  /**
   * Cancel a penalty (admin only)
   */
  async cancelPenalty(
    penaltyId: number,
    reason: string,
    token: string
  ): Promise<Penalty> {
    try {
      const response = await axios.post<Penalty>(
        `${this.baseUrl}/${penaltyId}/cancel?reason=${encodeURIComponent(reason)}`,
        {},
        this.getHeaders(token)
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to cancel penalty ${penaltyId}:`, error);
      throw error;
    }
  }

  /**
   * Waive a penalty (admin only)
   */
  async waivePenalty(
    penaltyId: number,
    reason: string,
    token: string
  ): Promise<Penalty> {
    try {
      const response = await axios.post<Penalty>(
        `${this.baseUrl}/${penaltyId}/waive?reason=${encodeURIComponent(reason)}`,
        {},
        this.getHeaders(token)
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to waive penalty ${penaltyId}:`, error);
      throw error;
    }
  }

  /**
   * Helper: Get authorization headers
   */
  private getHeaders(token: string) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }
}

export const penaltiesApi = new PenaltiesApi();
