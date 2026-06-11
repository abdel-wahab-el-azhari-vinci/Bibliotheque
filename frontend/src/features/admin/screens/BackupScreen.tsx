import styles from '../../../styles/screens/admin/BackupScreen.styles';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
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
        <Text style={styles.backupName}> {item.name}</Text>
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
            <Text style={styles.createButtonText}>Nouveau Backup</Text>
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


export default BackupScreen;
