import styles from '../../../styles/screens/livres/PenaltiesListScreen.styles';
import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { Text, Card, Chip, Icon } from 'react-native-paper';
import { penaltiesApi, Penalty, UserPenaltySummary } from '../api/penaltiesApi';
import PenaltyAlert from '../components/PenaltyAlert';
import { useAuth } from '../../auth/context/AuthContext';
import AdminPenaltiesScreen from '../../admin/screens/AdminPenaltiesScreen';

interface PenaltiesListScreenProps {
  navigation: any;
}

export default function PenaltiesListScreen({
  navigation,
}: PenaltiesListScreenProps) {
  const { user } = useAuth();

  if (user?.role === 'ADMIN') {
    return <AdminPenaltiesScreen onBack={() => navigation.goBack()} />;
  }

  return <UserPenaltiesView />;
}

function UserPenaltiesView() {
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [summary, setSummary] = useState<UserPenaltySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPenalties();
  }, []);

  const loadPenalties = async () => {
    try {
      setLoading(true);
      const [penaltiesData, summaryData] = await Promise.all([
        penaltiesApi.getMyPenalties(),
        penaltiesApi.getPenaltySummary(),
      ]);

      setPenalties(penaltiesData);
      setSummary(summaryData);
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
      await loadPenalties();
    } finally {
      setRefreshing(false);
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
        <Text style={styles.loadingText}>Chargement des pénalités...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Blocage Alert - si l'utilisateur est bloqué */}
      {summary && !summary.canBorrow && (
        <PenaltyAlert 
          totalAmount={summary.totalPendingAmount}
          isBlocking={true}
        />
      )}

      {/* Résumé des pénalités */}
      {summary && (
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.summaryTitle}>
              Vos pénalités
            </Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text variant="labelSmall" style={styles.summaryLabel}>
                  En attente
                </Text>
                <Text variant="titleLarge" style={styles.summaryValue}>
                  {summary.pendingPenaltiesCount}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="labelSmall" style={styles.summaryLabel}>
                  Montant total
                </Text>
                <Text
                  variant="titleLarge"
                  style={[
                    styles.summaryValue,
                    { color: summary.totalPendingAmount > 50 ? '#FF6B6B' : '#0066CC' },
                  ]}
                >
                  €{summary.totalPendingAmount.toFixed(2)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Liste des pénalités */}
      {penalties.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Icon
              source="check-circle"
              size={48}
              color="#51CF66"
              style={styles.emptyIcon}
            />
            <Text variant="titleMedium" style={styles.emptyText}>
              Aucune pénalité
            </Text>
            <Text variant="bodySmall" style={styles.emptySubText}>
              Vous n'avez pas de pénalité. Bravo!
            </Text>
          </Card.Content>
        </Card>
      ) : (
        penalties.map((penalty) => (
          <Card key={penalty.id} style={styles.penaltyCard}>
            <Card.Content>
              <View style={styles.penaltyHeader}>
                <Text variant="titleMedium" style={styles.livreTitle}>
                  {penalty.titreLivre}
                </Text>
                <Chip
                  label={getStatusLabel(penalty.status)}
                  style={{
                    backgroundColor: getStatusColor(penalty.status),
                  }}
                  textStyle={{ color: '#fff' }}
                  compact
                />
              </View>

              <View style={styles.datesContainer}>
                <View style={styles.dateItem}>
                  <Text variant="labelSmall" style={styles.dateLabel}>
                    Retour prévu:
                  </Text>
                  <Text variant="bodySmall" style={styles.dateValue}>
                    {new Date(penalty.dateExpirationEmprunt).toLocaleDateString('fr-FR')}
                  </Text>
                </View>
                <View style={styles.dateItem}>
                  <Text variant="labelSmall" style={styles.dateLabel}>
                    Retour effectif:
                  </Text>
                  <Text variant="bodySmall" style={styles.dateValue}>
                    {penalty.dateRetourActual
                      ? new Date(penalty.dateRetourActual).toLocaleDateString('fr-FR')
                      : '-'}
                  </Text>
                </View>
              </View>

              <View style={styles.penaltyDetails}>
                <View style={styles.detailItem}>
                  <Text variant="labelSmall" style={styles.detailLabel}>
                    Jours de retard
                  </Text>
                  <Text variant="bodyMedium" style={styles.detailValue}>
                    {penalty.nombreJoursRetard} j.
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text variant="labelSmall" style={styles.detailLabel}>
                    Tarif/jour
                  </Text>
                  <Text variant="bodyMedium" style={styles.detailValue}>
                    €{penalty.tarifJournalier.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text variant="labelSmall" style={styles.detailLabel}>
                    Montant
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={[
                      styles.detailValue,
                      { color: '#FF6B6B', fontWeight: 'bold' },
                    ]}
                  >
                    €{penalty.montantTotal.toFixed(2)}
                  </Text>
                </View>
              </View>

              {penalty.status === 'PENDING' && (
                <View style={styles.infoBox}>
                  <Icon source="information-outline" size={18} color="#FF9800" />
                  <Text variant="bodySmall" style={styles.infoText}>
                    À payer lors de la réception du livre à la bibliothèque
                  </Text>
                </View>
              )}

              {penalty.status === 'PAID' && (
                <View style={styles.paidBox}>
                  <Icon source="check-circle" size={18} color="#51CF66" />
                  <Text variant="bodySmall" style={styles.paidText}>
                    Payée le {new Date(penalty.datePaiement!).toLocaleDateString('fr-FR')}
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

