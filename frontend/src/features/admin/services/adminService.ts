import CONFIG from '../../../shared/config/env';
import { AxiosInstance } from 'axios';

// L'axios instance sera injectée par le composant
export class AdminService {
  private axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  /**
   * Récupère la liste de toutes les tables
   */
  async getTables() {
    const response = await this.axios.get(
      `${CONFIG.API_URL}/admin/database/tables`
    );
    // La réponse est { success: true, tables: [...], count: N }
    return response.data.tables || [];
  }

  /**
   * Récupère le schéma d'une table spécifique
   */
  async getTableSchema(tableName: string) {
    const response = await this.axios.get(
      `${CONFIG.API_URL}/admin/database/tables/${tableName}/schema`
    );
    return response.data;
  }

  /**
   * Récupère les informations des clés étrangères d'une table
   * Inclut les options avec labels lisibles
   */
  async getForeignKeyInfo(tableName: string) {
    try {
      const response = await this.axios.get(
        `${CONFIG.API_URL}/admin/database/tables/${tableName}/foreign-keys`
      );
      return response.data;
    } catch (error) {
      // Retourner une liste vide si l'endpoint n'existe pas ou erreur
      return { success: true, foreignKeys: [], count: 0 };
    }
  }

  /**
   * Insère des données dans une table
   */
  async insertIntoTable(tableName: string, data: Record<string, any>) {
    const response = await this.axios.post(
      `${CONFIG.API_URL}/admin/database/tables/${tableName}/insert`,
      data
    );
    return response.data;
  }

  /**
   * Récupère les données d'une table
   */
  async getTableData(tableName: string) {
    const response = await this.axios.get(
      `${CONFIG.API_URL}/admin/database/tables/${tableName}/data`
    );
    return response.data;
  }

  /**
   * Récupère les colonnes d'une table
   */
  async getTableColumns(tableName: string) {
    const response = await this.axios.get(
      `${CONFIG.API_URL}/admin/database/tables/${tableName}/columns`
    );
    return response.data;
  }

  /**
   * Récupère les tables qui dépendent de cette table
   */
  async getDependentTables(tableName: string): Promise<{ dependents: string[], count: number }> {
    const response = await this.axios.get(
      `${CONFIG.API_URL}/admin/database/tables/${tableName}/dependents`
    );
    return {
      dependents: response.data.dependents || [],
      count: response.data.count || 0
    };
  }

  /**
   * Vide une table et ses dépendants
   */
  async clearTable(tableName: string): Promise<{ clearedTables: string[], count: number, message: string }> {
    const response = await this.axios.delete(
      `${CONFIG.API_URL}/admin/database/tables/${tableName}/clear`
    );
    return {
      clearedTables: response.data.clearedTables || [],
      count: response.data.count || 0,
      message: response.data.message || 'Table cleared'
    };
  }
}

export default AdminService;
