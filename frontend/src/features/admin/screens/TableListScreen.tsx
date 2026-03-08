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
 * Écran listant toutes les tables de la base de données
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
      console.log('Tables chargées:', data);
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
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Gestion des Tables</Text>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Chargement des tables...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Gestion des Tables</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadTables}>
            <Text style={styles.buttonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
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
          <Text style={styles.tableName}>{table}</Text>
          <Text style={styles.tableAction}>Gérer</Text>
        </TouchableOpacity>
      ))}
      {item.length === 1 && <View style={[styles.tableCard, styles.tableCardRight, styles.emptyCard]} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des Tables</Text>
      </View>

      {tables.length === 0 ? (
        <ScrollView style={styles.emptyContent} contentContainerStyle={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucune table disponible</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadTables}>
            <Text style={styles.buttonText}>Recharger</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <FlatList
          data={groupedTables}
          renderItem={renderTableItem}
          keyExtractor={(_, index) => `group-${index}`}
          scrollEnabled={true}
          contentContainerStyle={styles.listContent}
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backupButton}
          onPress={() => {
            if (onBackupClick) {
              onBackupClick();
            } else {
              Alert.alert('Erreur', 'Fonction backup non disponible');
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.backupButtonText}>Backup DB</Text>
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
    padding: 15,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContent: {
    padding: 15,
  },
  emptyContent: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
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
