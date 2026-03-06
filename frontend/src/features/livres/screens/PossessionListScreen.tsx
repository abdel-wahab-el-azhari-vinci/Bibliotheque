import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  SectionList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { possessionApi, type BorrowResponse } from '../api/possessionApi';
import { colors, spacing, fontSizes, fontWeights, commonStyles } from '../../../theme';

type RootStackParamList = {
  Possessions: undefined;
  LivresList: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Possessions'>;

export default function PossessionListScreen({ navigation }: Props) {
  const [borrows, setBorrows] = useState<BorrowResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [returning, setReturning] = useState<number | null>(null);

  useEffect(() => {
    loadBorrows();
  }, []);

  const loadBorrows = async () => {
    try {
      setLoading(true);
      const data = await possessionApi.getMyBorrows();
      setBorrows(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les emprunts');
      console.error('Erreur chargement emprunts:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await possessionApi.getMyBorrows();
      setBorrows(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de recharger les emprunts');
    } finally {
      setRefreshing(false);
    }
  };

  const handleReturnBook = async (borrow: BorrowResponse) => {
    Alert.alert('Retourner un livre', `Retourner "${borrow.titre}" ?`, [
      { text: 'Annuler', onPress: () => {}, style: 'cancel' },
      {
        text: 'Retourner',
        onPress: async () => {
          try {
            setReturning(borrow.id);
            await possessionApi.returnBook(borrow.id);
            Alert.alert('Succès', 'Livre retourné avec succès!');
            loadBorrows();
          } catch (error) {
            Alert.alert('Erreur', 'Impossible de retourner ce livre');
          } finally {
            setReturning(null);
          }
        },
      },
    ]);
  };

  const activeRent = borrows.filter((b) => b.statut === 'EN_COURS');
  const returnedRent = borrows.filter((b) => b.statut === 'RETOURNE');

  const sections = [
    { title: 'En cours', data: activeRent },
    { title: 'Historique', data: returnedRent },
  ];

  const renderBorrowItem = ({ item }: { item: BorrowResponse }) => {
    const isActive = item.statut === 'EN_COURS';
    const borrowDate = new Date(item.dateEmprunt);
    const returnDate = new Date(item.dateRetourPrevu);
    const isOverdue = isActive && new Date() > returnDate;

    return (
      <View style={[styles.borrowCard, commonStyles.shadow]}>
        {/* Book Info */}
        <View style={styles.bookInfo}>
          <View style={styles.iconContainer}>
            <Ionicons name="book" size={24} color={colors.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.titre} numberOfLines={2}>
              {item.titre}
            </Text>
            <Text style={styles.auteur}>{item.auteur}</Text>
            <View style={styles.dateRow}>
              <Ionicons name="calendar" size={14} color={colors.gray} />
              <Text style={styles.dateText}>
                Emprunté le {borrowDate.toLocaleDateString('fr-FR')}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.statusBadge,
              isActive && isOverdue && styles.statusBadgeOverdue,
              isActive && !isOverdue && styles.statusBadgeActive,
              !isActive && styles.statusBadgeReturned,
            ]}
          >
            <Text style={styles.statusBadgeText}>
              {isActive ? (isOverdue ? '!!' : '✓') : '✓'}
            </Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Retour prévu:</Text>
            <Text
              style={[
                styles.detailValue,
                isActive && isOverdue && styles.textOverdue,
              ]}
            >
              {returnDate.toLocaleDateString('fr-FR')}
              {isActive && isOverdue && ' ⚠️'}
            </Text>
          </View>

          {item.dateRetourEffectif && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Retourné le:</Text>
              <Text style={styles.detailValue}>
                {new Date(item.dateRetourEffectif).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          )}
        </View>

        {/* Action Button */}
        {isActive && (
          <TouchableOpacity
            style={[styles.returnButton, returning === item.id && styles.returning]}
            onPress={() => handleReturnBook(item)}
            disabled={returning === item.id}
          >
            {returning === item.id ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <Ionicons name="arrow-undo-outline" size={18} color={colors.white} />
                <Text style={styles.returnButtonText}>Retourner</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderSectionHeading = ({ section: { title, data } }: any) => (
    <View style={styles.sectionHeader}>
      <Ionicons
        name={title === 'En cours' ? 'time-outline' : 'checkmark-done-outline'}
        size={20}
        color={colors.primary}
      />
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionCount}>({data.length})</Text>
    </View>
  );

  const renderEmptySection = () => (
    <View style={styles.emptySection}>
      <Ionicons name="book-outline" size={48} color={colors.lightGray} />
      <Text style={styles.emptyText}>Aucun emprunt en cours</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, commonStyles.shadowLarge]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes emprunts</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Borrows List */}
      {borrows.length === 0 ? (
        renderEmptySection()
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.id.toString() + index}
          renderItem={renderBorrowItem}
          renderSectionHeader={renderSectionHeading}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.white,
    marginVertical: spacing.md,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.dark,
    flex: 1,
  },
  sectionCount: {
    fontSize: fontSizes.base,
    color: colors.gray,
    fontWeight: fontWeights.semibold,
  },
  borrowCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  bookInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  infoContent: {
    flex: 1,
  },
  titre: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  auteur: {
    fontSize: fontSizes.sm,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateText: {
    fontSize: fontSizes.xs,
    color: colors.gray,
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadgeActive: {
    backgroundColor: colors.success + '15',
  },
  statusBadgeOverdue: {
    backgroundColor: colors.warning + '15',
  },
  statusBadgeReturned: {
    backgroundColor: colors.lightGray,
  },
  statusBadgeText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
  },
  details: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailLabel: {
    fontSize: fontSizes.sm,
    color: colors.gray,
    fontWeight: fontWeights.semibold,
  },
  detailValue: {
    fontSize: fontSizes.sm,
    color: colors.dark,
  },
  textOverdue: {
    color: colors.danger,
    fontWeight: fontWeights.bold,
  },
  returnButton: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  returning: {
    opacity: 0.6,
  },
  returnButtonText: {
    color: colors.white,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
  },
  emptySection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontSize: fontSizes.base,
    color: colors.gray,
    marginTop: spacing.lg,
  },
});
