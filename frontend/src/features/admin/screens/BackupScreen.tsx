import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import BackupService, { Backup } from '../services/backupService';

interface Props {
  backupService: BackupService;
  onBack: () => void;
}

/**
 * Écran de gestion des backups
 * Affiche tous les backups, le plus récent en haut
 */
const BackupScreen: React.FC<Props> = ({ backupService, onBack }) => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    try {
      setLoading(true);
      const data = await backupService.listBackups();
      setBackups(data || []);
    } catch (error) {
      console.error('Erreur:', error);
      Alert.alert('Erreur', 'Impossible de charger les backups');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBackups();
    setRefreshing(false);
  };

  const handleCreateBackup = async () => {
    try {
      setCreatingBackup(true);
      await backupService.createBackup();
      Alert.alert('Succès', 'Backup créé avec succès');
      await loadBackups();
    } catch (error) {
      console.error('Erreur:', error);
      Alert.alert('Erreur', 'Impossible de créer le backup');
    } finally {
      setCreatingBackup(false);
    }
  };

  const handleRestore = (backup: Backup) => {
    Alert.alert(
      'Confirmer la restauration',
      `Êtes-vous certain de vouloir restaurer le backup du\n${backup.date}?\n\nCette action est irréversible.`,
      [
        { text: 'Annuler', onPress: () => {}, style: 'cancel' },
        {
          text: 'Restaurer',
          onPress: () => restoreBackup(backup.id),
          style: 'destructive',
        },
      ]
    );
  };

  const restoreBackup = async (backupId: string) => {
    try {
      setRestoringId(backupId);
      await backupService.restoreBackup(backupId);
      Alert.alert('Succès', 'Base de données restaurée');
      await loadBackups();
    } catch (error) {
      console.error('Erreur:', error);
      Alert.alert('Erreur', 'Impossible de restaurer le backup');
    } finally {
      setRestoringId(null);
    }
  };

  const renderBackupItem = ({ item }: { item: Backup }) => (
    <View style={styles.backupCard}>
      <View style={styles.backupInfo}>
        <Text style={styles.backupName}>��� {item.name}</Text>
        <Text style={styles.backupDate}>{item.date}</Text>
        <Text style={styles.backupSize}>Taille: {item.size} KB</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.restoreButton,
          restoringId === item.id && styles.restoreButtonDisabled,
        ]}
        onPress={() => handleRestore(item)}
        disabled={restoringId === item.id}
        activeOpacity={0.7}
      >
        {restoringId === item.id ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.restoreButtonText}>↩️ Restaurer</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement des backups...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Backups</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.createButtonContainer}>
        <TouchableOpacity
          style={[
            styles.createButton,
            creatingBackup && styles.createButtonDisabled,
          ]}
          onPress={handleCreateBackup}
          disabled={creatingBackup}
          activeOpacity={0.7}
        >
          {creatingBackup ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>��� Nouveau Backup</Text>
          )}
        </TouchableOpacity>
      </View>

      {backups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun backup disponible</Text>
          <Text style={styles.emptySubText}>
            Créez votre premier backup pour commencer
          </Text>
        </View>
      ) : (
        <FlatList
          data={backups}
          renderItem={renderBackupItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 15,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 60,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  createButtonContainer: {
    padding: 15,
  },
  createButton: {
    backgroundColor: '#34C759',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  backupCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backupInfo: {
    flex: 1,
  },
  backupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  backupDate: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  backupSize: {
    fontSize: 12,
    color: '#999',
  },
  restoreButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  restoreButtonDisabled: {
    opacity: 0.6,
  },
  restoreButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: '#666',
  },
});

export default BackupScreen;
