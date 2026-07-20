import AdminService from '../adminService';

/**
 * Tests pour AdminService - Foreign Keys
 * Valide les méthodes d'appel API
 */
describe('AdminService', () => {
  let adminService: AdminService;
  let mockAxios: any;

  beforeEach(() => {
    mockAxios = {
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
    };
    adminService = new AdminService(mockAxios);
  });

  describe('getForeignKeyInfo', () => {
    it('should call the correct endpoint', async () => {
      // Arrange
      const tableName = 'livre';
      const mockResponse = {
        data: {
          success: true,
          foreignKeys: [
            {
              columnName: 'auteur_id',
              referencedTable: 'auteur',
              labelColumn: 'nom',
              options: [{ id: 1, label: 'Isaac Asimov' }]
            }
          ]
        }
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      // Act
      const result = await adminService.getForeignKeyInfo(tableName);

      // Assert
      expect(mockAxios.get).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      mockAxios.get.mockRejectedValue(new Error('Network error'));

      // Act
      const result = await adminService.getForeignKeyInfo('livre');

      // Assert
      expect(result.success).toBe(true);
      expect(result.foreignKeys).toEqual([]);
    });
  });

  describe('getTableSchema', () => {
    it('should fetch table schema', async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          schema: [
            { COLUMN_NAME: 'id', COLUMN_TYPE: 'bigint' },
            { COLUMN_NAME: 'titre', COLUMN_TYPE: 'varchar' }
          ]
        }
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      // Act
      const result = await adminService.getTableSchema('livre');

      // Assert
      expect(mockAxios.get).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  describe('insertIntoTable', () => {
    it('should insert data with correct format', async () => {
      // Arrange
      const mockResponse = {
        data: { success: true, message: 'Data inserted' }
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const data = { titre: 'Test', auteur_id: 1 };

      // Act
      const result = await adminService.insertIntoTable('livre', data);

      // Assert
      expect(mockAxios.post).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });
});
