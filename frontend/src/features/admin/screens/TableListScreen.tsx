import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import AdminService from '../services/adminService';

interface Props {
  adminService: AdminService;
  onSelectTable: (tableName: string) => void;
  onBackupClick?: () => void;
}

/**
 * Ã‰cran listant toutes les tables de la base de donnÃ©es
 * Affichage en grille 2x2
 */
const TableListScreen: React.FC<Props> = ({ 
  adminService, 
  onSelectTable,
  onBackupClick 
}) => {
  const [tables, setTables] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getTables();
      setTables(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des tables:', err);
      setError('Impossible de charger les tables');
      Alert.alert('Erreur', 'Impossible de charger les tables');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement des tables...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadTables}>
          <Text style={styles.buttonText}>RÃ©essayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Grouper les tables par 2 pour affichage en grille
  const groupedTables = [];
  for (let i = 0; i < tables.length; i += 2) {
    groupedTables.push(tables.slice(i, i + 2));
  }

  const renderTableItem = ({ item }: { item: string[] }) => (
    <View style={styles.rowContainer}>
      {item.map((table, index) => (
        <TouchableOpacity
          key={table}
          style={[
            styles.tableCard,
            index === 1 && styles.tableCardRight,
          ]}
          onPress={() => onSelectTable(table)}
          activeOpacity={0.7}
        >
          <Text style={styles.tableIcon}>í³‹</Text>
          <Text style={styles.tableName}>{table}</Text>
          <Text style={styles.tableAction}>GÃ©rer â†’</Text>
        </TouchableOpacity>
      ))}
      {item.length === 1 && <View style={[styles.tableCard, styles.tableCardRight, styles.emptyCard]} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des Tables</Text>
        <Text style={styles.subtitle}>SÃ©lectionnez une table pour la modifier</Text>
      </View>

      <FlatList
        data={groupedTables}
        renderItem={renderTableItem}
        keyExtractor={(_, index) => `group-${index}`}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backupButton}
          onPress={onBackupClick}
          activeOpacity={0.7}
        >
          <Text style={styles.backupButtonText}>í²¾ Backup DB</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  listContent: {
    padding: 15,
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  tableCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
    marginRight: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableCardRight: {
    marginRight: 0,
    marginLeft: 7,
  },
  emptyCard: {
    opacity: 0,
  },
  tableIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  tableName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  tableAction: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  backupButton: {
    backgroundColor: '#34C759',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  backupButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default TableListScreen;
