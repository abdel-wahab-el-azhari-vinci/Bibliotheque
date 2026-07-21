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
import { penaltiesApi, Penalty } from '../../livres/api/penaltiesApi';

interface AdminPenaltiesScreenProps {
  onBack: () => void;
}

export default function AdminPenaltiesScreen({
  onBack,
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
      const response = await penaltiesApi.getAllPenalties();
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

  const handleMarkAsPaid = (penalty: Penalty) => {
    setSelectedPenalty(penalty);
    setActionType('pay');
    setReason('');
    setDialogVisible(true);
  };

  const handleCancel = (penalty: Penalty) => {
    setSelectedPenalty(penalty);
    setActionType('cancel');
    setReason('');
    setDialogVisible(true);
  };

  const handleWaive = (penalty: Penalty) => {
    setSelectedPenalty(penalty);
    setActionType('waive');
    setReason('');
    setDialogVisible(true);
  };

  const confirmAction = async () => {
    if (!selectedPenalty) return;

    try {
      setProcessing(true);

      if (actionType === 'pay') {
        await penaltiesApi.payPenalty(selectedPenalty.id, 'PAYMENT_IN_PERSON');
        Alert.alert('Succès', `Pénalité marquée comme payée`);
      } else if (actionType === 'cancel') {
        if (!reason.trim()) {
          Alert.alert('Erreur', 'Veuillez entrer une raison');
          return;
        }
        await penaltiesApi.cancelPenalty(selectedPenalty.id, reason);
        Alert.alert('Succès', `Pénalité annulée`);
      } else if (actionType === 'waive') {
        if (!reason.trim()) {
          Alert.alert('Erreur', 'Veuillez entrer une raison');
          return;
        }
        await penaltiesApi.waivePenalty(selectedPenalty.id, reason);
        Alert.alert('Succès', `Pénalité graciée`);
      }

      setDialogVisible(false);
      setSelectedPenalty(null);
      await loadAllPenalties();
    } catch (error) {
      console.error('Failed to process action:', error);
      Alert.alert('Erreur', "L'action a échoué");
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'PENDING':
        return '#FF6B6B';
      case 'PAID':
        return '#34C759';
      case 'CANCELLED':
        return '#FFB400';
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
      WAIVED: 'Graciée',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const pendingPenalties = penalties.filter((p) => p.status === 'PENDING');
  const historyPenalties = penalties.filter((p) => p.status !== 'PENDING');
  const totalPendingAmount = pendingPenalties.reduce((sum, p) => sum + p.montantTotal, 0);

  const renderPenaltyCard = (penalty: Penalty, actionable: boolean) => (
    <View key={penalty.id} style={styles.penaltyCard}>
      <View style={styles.penaltyHeader}>
        <View style={styles.penaltyInfo}>
          <Text style={styles.livreTitle}>{penalty.titreLivre}</Text>
          <Text style={styles.userName}>{penalty.userName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(penalty.status) }]}>
          <Text style={styles.statusBadgeText}>{getStatusLabel(penalty.status)}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Jours de retard</Text>
          <Text style={styles.detailValue}>{penalty.nombreJoursRetard} j.</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Montant</Text>
          <Text style={[styles.detailValue, styles.amountValue]}>
            €{penalty.montantTotal.toFixed(2)}
          </Text>
        </View>
        {penalty.notes && (
          <View style={styles.notesBox}>
            <Text style={styles.notesLabel}>Note:</Text>
            <Text style={styles.notesText}>{penalty.notes}</Text>
          </View>
        )}
      </View>

      {actionable && (
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => handleMarkAsPaid(penalty)}
            style={[styles.actionButton, styles.payButton]}
          >
            <Text style={styles.actionButtonTextLight}>Payée</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleCancel(penalty)}
            style={[styles.actionButton, styles.cancelButton]}
          >
            <Text style={styles.actionButtonTextDark}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleWaive(penalty)}
            style={[styles.actionButton, styles.waiveButton]}
          >
            <Text style={styles.actionButtonTextDark}>Gracier</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Gestion des pénalités</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>En attente</Text>
          <Text style={styles.statValue}>{pendingPenalties.length}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Montant total</Text>
          <Text style={styles.statValue}>€{totalPendingAmount.toFixed(2)}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {pendingPenalties.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>✓</Text>
            <Text style={styles.emptyText}>Aucune pénalité en attente</Text>
          </View>
        ) : (
          pendingPenalties.map((penalty) => renderPenaltyCard(penalty, true))
        )}

        {historyPenalties.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Historique</Text>
            {historyPenalties.map((penalty) => renderPenaltyCard(penalty, false))}
          </>
        )}
      </ScrollView>

      <Modal visible={dialogVisible} transparent animationType="fade" onRequestClose={() => setDialogVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
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

            <View style={styles.modalActions}>
              <Pressable onPress={() => setDialogVisible(false)} disabled={processing} style={{ paddingVertical: 10, paddingHorizontal: 12 }}>
                <Text style={styles.modalCancelText}>Annuler</Text>
              </Pressable>
              <Pressable onPress={confirmAction} disabled={processing} style={styles.modalConfirmButton}>
                <Text style={styles.modalConfirmText}>{processing ? '...' : 'Confirmer'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
