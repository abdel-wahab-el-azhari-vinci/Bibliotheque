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
}

export default AdminService;
