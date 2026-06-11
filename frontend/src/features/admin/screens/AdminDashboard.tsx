import styles from '../../../styles/screens/admin/AdminDashboard.styles';
import React, { useState } from 'react';
import { View } from 'react-native';
import httpClientManager from '../../../shared/api/httpClient';
import AdminService from '../services/adminService';
import BackupService from '../services/backupService';
import TableListScreen from './TableListScreen';
import DynamicFormScreen from './DynamicFormScreen';
import BackupScreen from './BackupScreen';

type ScreenType = 'list' | 'form' | 'backups';

/**
 * Écran d'administration principal
 * Affiche les tables et permet l'insertion de données
 */
const AdminDashboard: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('list');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  
  // Utiliser httpClientManager qui gère les tokens JWT automatiquement
  const [adminService] = useState(
    () => new AdminService(httpClientManager.getClient())
  );

  const [backupService] = useState(
    () => new BackupService(httpClientManager.getClient())
  );

  const handleSelectTable = (tableName: string) => {
    setSelectedTable(tableName);
    setCurrentScreen('form');
  };

  const handleBackToList = () => {
    setSelectedTable(null);
    setCurrentScreen('list');
  };

  const handleBackupClick = () => {
    setCurrentScreen('backups');
  };

  const handleBackupBack = () => {
    setCurrentScreen('list');
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'list' ? (
        <TableListScreen
          adminService={adminService}
          onSelectTable={handleSelectTable}
          onBackupClick={handleBackupClick}
        />
      ) : currentScreen === 'form' ? (
        <DynamicFormScreen
          tableName={selectedTable!}
          adminService={adminService}
          onBack={handleBackToList}
        />
      ) : (
        <BackupScreen
          backupService={backupService}
          onBack={handleBackupBack}
        />
      )}
    </View>
  );
};


export default AdminDashboard;
