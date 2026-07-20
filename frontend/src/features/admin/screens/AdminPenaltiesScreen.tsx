import styles from '../../../styles/screens/admin/AdminPenaltiesScreen.styles';
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useAuth } from '../../auth/context/AuthContext';
import httpClientManager from '../../../shared/api/httpClient';
import { penaltiesApi, Penalty } from '../../livres/api/penaltiesApi';

interface AdminPenaltiesScreenProps {
  navigation: any;
}

export default function AdminPenaltiesScreen({
  navigation,
}: AdminPenaltiesScreenProps) {
  const { isAuthenticated } = useAuth();

  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedPenalty, setSelectedPenalty] = useState<Penalty | null>(null);
  const [actionType, setActionType] = useState<'pay' | 'cancel' | 'waive'>('pay');
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    loadAllPenalties();
  }, [isAuthenticated]);

  const loadAllPenalties = async () => {
    try {
      setLoading(true);
      const token = await httpClientManager.getAccessToken();

      if (!token) {
        Alert.alert('Erreur', 'Vous devez être connecté pour voir les pénalités');
        return;
      }

      const response = await penaltiesApi.getMyPenalties(token);
      setPenalties(response);
    } catch (error) {
      console.error('Failed to load penalties:', error);
      Alert.alert('Erreur', 'Impossible de charger les pénalités');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await loadAllPenalties();
    } finally {
      setRefreshing(false);
    }
  };

  const handleMarkAsPaid = async (penalty: Penalty) => {
    setSelectedPenalty(penalty);
    setActionType('pay');
    setReason('');
    setDialogVisible(true);
  };

  const handleCancel = async (penalty: Penalty) => {
    setSelectedPenalty(penalty);
    setActionType('cancel');
    setReason('');
    setDialogVisible(true);
  };

  const handleWaive = async (penalty: Penalty) => {
    setSelectedPenalty(penalty);
    setActionType('waive');
    setReason('');
    setDialogVisible(true);
  };

  const confirmAction = async () => {
    if (!selectedPenalty) return;

    try {
      setProcessing(true);
      const token = await httpClientManager.getAccessToken();

      if (!token) {
        Alert.alert('Erreur', 'Session expirée, veuillez vous reconnecter');
        return;
      }

      if (actionType === 'pay') {
        await penaltiesApi.payPenalty(selectedPenalty.id, 'PAYMENT_IN_PERSON', token);
        Alert.alert('Succès', `Pénalité ${selectedPenalty.id} marquée comme payée`);
      } else if (actionType === 'cancel') {
        if (!reason.trim()) {
          Alert.alert('Erreur', 'Veuillez entrer une raison');
          return;
        }
        await penaltiesApi.cancelPenalty(selectedPenalty.id, reason, token);
        Alert.alert('Succès', `Pénalité ${selectedPenalty.id} annulée`);
      } else if (actionType === 'waive') {
        if (!reason.trim()) {
          Alert.alert('Erreur', 'Veuillez entrer une raison');
          return;
        }
        await penaltiesApi.waivePenalty(selectedPenalty.id, reason, token);
        Alert.alert('Succès', `Pénalité ${selectedPenalty.id} graciée`);
      }

      setDialogVisible(false);
      setSelectedPenalty(null);
      await loadAllPenalties();
    } catch (error) {
      console.error('Failed to process action:', error);
      Alert.alert('Erreur', 'L\'action a échoué');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'PENDING':
        return '#FF6B6B';
      case 'PAID':
        return '#51CF66';
      case 'CANCELLED':
        return '#FFD43B';
      case 'WAIVED':
        return '#A78BFA';
      default:
        return '#999';
    }
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      PENDING: 'En attente',
      PAID: 'Payée',
      CANCELLED: 'Annulée',
      WAIVED: 'Annulée (grâce)',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const pendingPenalties = penalties.filter((p) => p.status === 'PENDING');

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontSize: 24 }]}>Gestion des pénalités</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View>
              <Text style={styles.statLabel}>En attente</Text>
              <Text style={styles.statValue}>{pendingPenalties.length}</Text>
            </View>
          </View>
        </View>
      </View>

      {pendingPenalties.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>✓</Text>
          <Text style={styles.emptyText}>Aucune pénalité en attente</Text>
        </View>
      ) : (
        pendingPenalties.map((penalty) => (
          <View key={penalty.id} style={styles.penaltyCard}>
            <View style={styles.penaltyHeader}>
              <View style={styles.penaltyInfo}>
                <Text style={styles.livreTitle}>{penalty.titreLivre}</Text>
                <Text style={styles.userName}>{penalty.userName}</Text>
              </View>
              <View
                style={{
                  backgroundColor: getStatusColor(penalty.status),
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 999,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                  {getStatusLabel(penalty.status)}
                </Text>
              </View>
            </View>

            <View style={styles.details}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Jours de retard:</Text>
                <Text style={styles.detailValue}>{penalty.nombreJoursRetard} j.</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Montant:</Text>
                <Text style={[styles.detailValue, { color: '#FF6B6B' }]}>€{penalty.montantTotal.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => handleMarkAsPaid(penalty)}
                style={[styles.payButton, { paddingVertical: 10, borderRadius: 8, alignItems: 'center' }]}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Payée</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleCancel(penalty)}
                style={[styles.cancelButton, { paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#999', alignItems: 'center' }]}
              >
                <Text style={{ color: '#333', fontWeight: '600' }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleWaive(penalty)}
                style={[styles.waiveButton, { paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#999', alignItems: 'center' }]}
              >
                <Text style={{ color: '#333', fontWeight: '600' }}>Gracier</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      <Modal visible={dialogVisible} transparent animationType="fade" onRequestClose={() => setDialogVisible(false)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.35)', padding: 20 }}>
          <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 12, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
              {actionType === 'pay' && 'Marquer comme payée'}
              {actionType === 'cancel' && 'Annuler la pénalité'}
              {actionType === 'waive' && 'Gracier la pénalité'}
            </Text>

            {selectedPenalty && (
              <>
                <Text style={styles.dialogInfo}>Pénalité de €{selectedPenalty.montantTotal.toFixed(2)}</Text>
                <Text style={styles.dialogInfo}>Livre: {selectedPenalty.titreLivre}</Text>

                {(actionType === 'cancel' || actionType === 'waive') && (
                  <TextInput
                    placeholder="Entrez la raison..."
                    value={reason}
                    onChangeText={setReason}
                    multiline
                    numberOfLines={3}
                    style={styles.reasonInput}
                  />
                )}
              </>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
              <Pressable onPress={() => setDialogVisible(false)} disabled={processing} style={{ marginRight: 12, paddingVertical: 10, paddingHorizontal: 12 }}>
                <Text style={{ color: '#666' }}>Annuler</Text>
              </Pressable>
              <Pressable onPress={confirmAction} disabled={processing} style={{ paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#0066CC', borderRadius: 8 }}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>{processing ? '...' : 'Confirmer'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
