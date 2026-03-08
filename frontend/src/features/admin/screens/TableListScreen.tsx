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
  Modal,
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
  const [resettingTable, setResettingTable] = useState<string | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [selectedForReset, setSelectedForReset] = useState<string | null>(null);
  const [dependents, setDependents] = useState<string[]>([]);
  const [loadingDependents, setLoadingDependents] = useState(false);

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

  const handleResetClick = async (tableName: string) => {
    try {
      setLoadingDependents(true);
      const result = await adminService.getDependentTables(tableName);
      setSelectedForReset(tableName);
      setDependents(result.dependents);
      setShowResetDialog(true);
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de vérifier les dépendances');
    } finally {
      setLoadingDependents(false);
    }
  };

  const confirmReset = async () => {
    if (!selectedForReset) return;

    try {
      setResettingTable(selectedForReset);
      setShowResetDialog(false);
      
      const result = await adminService.clearTable(selectedForReset);
      
      Alert.alert(
        'Succès',
        `Table vidée avec succès!\n\nTables nettoyées:\n${result.clearedTables.join(', ')}`
      );
      
      setSelectedForReset(null);
      setDependents([]);
    } catch (err: any) {
      Alert.alert('Erreur', `Impossible de vider la table: ${err.message}`);
    } finally {
      setResettingTable(null);
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
        <View
          key={table}
          style={[
            styles.tableCardContainer,
            index === 1 && styles.tableCardContainerRight,
          ]}
        >
          <TouchableOpacity
            style={styles.tableCard}
            onPress={() => onSelectTable(table)}
            activeOpacity={0.7}
          >
            <Text style={styles.tableIcon}>⬥ ⬥ ⬥</Text>
            <Text style={styles.tableName}>{table}</Text>
            <Text style={styles.tableAction}>Gérer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.resetButton,
              resettingTable === table && styles.resetButtonDisabled,
            ]}
            onPress={() => handleResetClick(table)}
            disabled={resettingTable === table}
            activeOpacity={0.7}
          >
            {resettingTable === table ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.resetButtonText}>���️</Text>
            )}
          </TouchableOpacity>
        </View>
      ))}
      {item.length === 1 && (
        <View style={[styles.tableCardContainer, styles.tableCardContainerRight, styles.emptyCard]} />
      )}
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
          <Text style={styles.backupButtonText}>��� Backup DB</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de confirmation de reset */}
      <Modal
        visible={showResetDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowResetDialog(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmer le reset</Text>
            
            <Text style={styles.modalText}>
              Veux-tu vider la table <Text style={styles.tableBold}>{selectedForReset}</Text>?
            </Text>

            {loadingDependents ? (
              <ActivityIndicator size="large" color="#007AFF" style={styles.modalLoading} />
            ) : dependents.length > 0 ? (
              <>
                <Text style={styles.warningText}>
                  ⚠️ Attention! {dependents.length} autre(s) table(s) y dépendent:
                </Text>
                <View style={styles.dependentsList}>
                  {dependents.map((dep) => (
                    <Text key={dep} style={styles.dependentItem}>
                      • {dep}
                    </Text>
                  ))}
                </View>
                <Text style={styles.infoText}>
                  Ces tables seront aussi vidées pour éviter les orphelins.
                </Text>
              </>
            ) : (
              <Text style={styles.infoText}>
                Aucune table ne dépend de celle-ci.
              </Text>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowResetDialog(false);
                  setSelectedForReset(null);
                  setDependents([]);
                }}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmReset}
                disabled={loadingDependents}
              >
                <Text style={styles.confirmButtonText}>Vider</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  tableCardContainer: {
    flex: 1,
    marginRight: 7,
  },
  tableCardContainerRight: {
    marginRight: 0,
    marginLeft: 7,
  },
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  resetButton: {
    marginTop: 8,
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonDisabled: {
    opacity: 0.6,
  },
  resetButtonText: {
    fontSize: 16,
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
  // Styles pour le modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  tableBold: {
    fontWeight: '700',
    color: '#333',
  },
  warningText: {
    fontSize: 13,
    color: '#FF9500',
    fontWeight: '600',
    marginBottom: 10,
  },
  dependentsList: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  dependentItem: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  modalLoading: {
    marginVertical: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  confirmButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default TableListScreen;
