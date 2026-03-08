import React, { useState } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import httpClientManager from '../../../shared/api/httpClient';
import AdminService from '../services/adminService';
import TableListScreen from './TableListScreen';
import DynamicFormScreen from './DynamicFormScreen';

type ScreenType = 'list' | 'form';

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

  const handleSelectTable = (tableName: string) => {
    setSelectedTable(tableName);
    setCurrentScreen('form');
  };

  const handleBackToList = () => {
    setSelectedTable(null);
    setCurrentScreen('list');
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'list' ? (
        <TableListScreen
          adminService={adminService}
          onSelectTable={handleSelectTable}
        />
      ) : (
        <DynamicFormScreen
          tableName={selectedTable!}
          adminService={adminService}
          onBack={handleBackToList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default AdminDashboard;
