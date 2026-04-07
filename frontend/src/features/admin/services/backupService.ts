import { AxiosInstance } from 'axios';
import CONFIG from '../../../shared/config/env';

export interface Backup {
  id: string;
  name: string;
  date: string;
  size: number;
}

export class BackupService {
  private axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  /**
   * Crée un backup de la base de données
   */
  async createBackup(): Promise<{ backupId: string; message: string }> {
    const response = await this.axios.post(
      `${CONFIG.API_URL}/admin/backup/create`
    );
    return response.data;
  }

  /**
   * Récupère la liste de tous les backups
   */
  async listBackups(): Promise<Backup[]> {
    const response = await this.axios.get(
      `${CONFIG.API_URL}/admin/backup/list`
    );
    return response.data.backups || [];
  }

  /**
   * Restaure une base de données à partir d'un backup
   */
  async restoreBackup(backupId: string): Promise<{ message: string }> {
    const response = await this.axios.post(
      `${CONFIG.API_URL}/admin/backup/restore/${backupId}`
    );
    return response.data;
  }
}

export default BackupService;
