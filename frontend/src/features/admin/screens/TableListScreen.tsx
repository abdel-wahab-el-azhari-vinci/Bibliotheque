import styles from '../../../styles/screens/admin/TableListScreen.styles';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert, ScrollView, Modal } from 'react-native';
import AdminService from '../services/adminService';

interface Props {
  adminService: AdminService;
  onSelectTable: (tableName: string) => void;
  onBackupClick?: () => void;
}

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
        <TouchableOpacity
          key={table}
          style={[
            styles.tableCard,
            index === 1 && styles.tableCardRight,
          ]}
          onPress={() => onSelectTable(table)}
          activeOpacity={0.7}
        >
          <Text style={styles.tableIcon}>⬥ ⬥ ⬥</Text>
          <Text style={styles.tableName}>{table}</Text>
          
          <TouchableOpacity
            style={[
              styles.resetButton,
              resettingTable === table && styles.resetButtonDisabled,
            ]}
            onPress={() => handleResetClick(table)}
            disabled={resettingTable === table}
          >
            {resettingTable === table ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.resetButtonText}>Vider</Text>
            )}
          </TouchableOpacity>
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


export default TableListScreen;
