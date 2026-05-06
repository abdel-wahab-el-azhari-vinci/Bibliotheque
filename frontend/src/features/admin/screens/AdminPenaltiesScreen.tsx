import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Text, Card, Button, Chip, Dialog, TextInput, Icon } from 'react-native-paper';
import { useAuth } from '../../../context/AuthContext';
import { penaltiesApi, Penalty } from '../../livres/api/penaltiesApi';

interface AdminPenaltiesScreenProps {
  navigation: any;
}

export default function AdminPenaltiesScreen({
  navigation,
}: AdminPenaltiesScreenProps) {
  const { authState } = useAuth();
  const token = authState?.access_token || '';

  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedPenalty, setSelectedPenalty] = useState<Penalty | null>(null);
  const [actionType, setActionType] = useState<'pay' | 'cancel' | 'waive'>('pay');
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (token) {
      loadAllPenalties();
    }
  }, [token]);

  const loadAllPenalties = async () => {
    try {
      setLoading(true);
      // Note: API doit avoir endpoint pour récupérer TOUTES les pénalités (admin)
      // Pour l'instant on récupère juste les pending
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

  const pendingPenalties = penalties.filter(p => p.status === 'PENDING');

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.headerTitle}>
          Gestion des pénalités
        </Text>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text variant="labelSmall" style={styles.statLabel}>
                En attente
              </Text>
              <Text variant="titleLarge" style={styles.statValue}>
                {pendingPenalties.length}
              </Text>
            </Card.Content>
          </Card>
        </View>
      </View>

      {pendingPenalties.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Icon
              source="check-circle"
              size={48}
              color="#51CF66"
              style={styles.emptyIcon}
            />
            <Text variant="bodySmall" style={styles.emptyText}>
              Aucune pénalité en attente
            </Text>
          </Card.Content>
        </Card>
      ) : (
        pendingPenalties.map((penalty) => (
          <Card key={penalty.id} style={styles.penaltyCard}>
            <Card.Content>
              <View style={styles.penaltyHeader}>
                <View style={styles.penaltyInfo}>
                  <Text variant="titleSmall" style={styles.livreTitle}>
                    {penalty.titreLivre}
                  </Text>
                  <Text variant="bodySmall" style={styles.userName}>
                    {penalty.userName}
                  </Text>
                </View>
                <Chip
                  label={getStatusLabel(penalty.status)}
                  style={{ backgroundColor: getStatusColor(penalty.status) }}
                  textStyle={{ color: '#fff' }}
                  compact
                />
              </View>

              <View style={styles.details}>
                <View style={styles.detailRow}>
                  <Text variant="bodySmall" style={styles.detailLabel}>
                    Jours de retard:
                  </Text>
                  <Text variant="bodySmall" style={styles.detailValue}>
                    {penalty.nombreJoursRetard} j.
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="bodySmall" style={styles.detailLabel}>
                    Montant:
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={[styles.detailValue, { color: '#FF6B6B', fontWeight: 'bold' }]}
                  >
                    €{penalty.montantTotal.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.actions}>
                <Button
                  mode="contained"
                  onPress={() => handleMarkAsPaid(penalty)}
                  style={styles.payButton}
                  icon="check"
                >
                  Payée
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => handleCancel(penalty)}
                  style={styles.cancelButton}
                  icon="close"
                >
                  Annuler
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => handleWaive(penalty)}
                  style={styles.waiveButton}
                  icon="gift"
                >
                  Gracier
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))
      )}

      {/* Dialog pour confirmer l'action */}
      <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
        <Dialog.Title>
          {actionType === 'pay' && 'Marquer comme payée'}
          {actionType === 'cancel' && 'Annuler la pénalité'}
          {actionType === 'waive' && 'Gracier la pénalité'}
        </Dialog.Title>
        
        <Dialog.Content>
          {selectedPenalty && (
            <>
              <Text variant="bodySmall" style={styles.dialogInfo}>
                Pénalité de €{selectedPenalty.montantTotal.toFixed(2)}
              </Text>
              <Text variant="bodySmall" style={styles.dialogInfo}>
                Livre: {selectedPenalty.titreLivre}
              </Text>
              
              {(actionType === 'cancel' || actionType === 'waive') && (
                <TextInput
                  label="Raison"
                  value={reason}
                  onChangeText={setReason}
                  multiline
                  numberOfLines={3}
                  style={styles.reasonInput}
                  placeholder="Entrez la raison..."
                />
              )}
            </>
          )}
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={() => setDialogVisible(false)} disabled={processing}>
            Annuler
          </Button>
          <Button
            onPress={confirmAction}
            loading={processing}
            disabled={processing}
          >
            Confirmer
          </Button>
        </Dialog.Actions>
      </Dialog>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#0066CC',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  statLabel: {
    color: '#666',
  },
  statValue: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    color: '#999',
  },
  penaltyCard: {
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  penaltyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  penaltyInfo: {
    flex: 1,
  },
  livreTitle: {
    fontWeight: 'bold',
    color: '#0066CC',
    marginBottom: 4,
  },
  userName: {
    color: '#666',
  },
  details: {
    backgroundColor: '#F9F9F9',
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    color: '#666',
  },
  detailValue: {
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  payButton: {
    flex: 1,
    backgroundColor: '#51CF66',
  },
  cancelButton: {
    flex: 1,
  },
  waiveButton: {
    flex: 1,
  },
  dialogInfo: {
    color: '#666',
    marginBottom: 8,
  },
  reasonInput: {
    marginTop: 12,
    backgroundColor: '#F9F9F9',
  },
});
