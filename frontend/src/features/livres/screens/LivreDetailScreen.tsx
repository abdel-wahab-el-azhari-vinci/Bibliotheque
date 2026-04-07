import { getPublicationYear } from '../utils/dateUtils';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { livresApi } from '../api/livresApi';
import { possessionApi } from '../api/possessionApi';
import { useAuth } from '../../auth/context/AuthContext';
import { colors, spacing, fontSizes, fontWeights, commonStyles } from '../../../theme';
import type { Livre } from '../types';

type RootStackParamList = {
  LivreDetail: { id: number };
  LivresList: undefined;
  Possessions: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'LivreDetail'>;

export default function LivreDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  
  const [livre, setLivre] = useState<Livre | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLivre();
  }, []);

  const loadLivre = async () => {
    try {
      setLoading(true);
      const data = await livresApi.getById(id);
      console.log('Livre loaded:', data);
      setLivre(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les détails du livre');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLivre();
    setRefreshing(false);
  };

  const handleBorrow = async () => {
    if (!livre) return;

    Alert.alert('Emprunter', `Emprunter "${livre.titre}" ?`, [
      { text: 'Annuler', onPress: () => {}, style: 'cancel' },
      {
        text: 'Emprunter',
        onPress: async () => {
          try {
            setBorrowing(true);
            await possessionApi.borrow(livre.id);
            // Navigation directe vers la liste des emprunts
            Alert.alert('Succès', 'Livre emprunté avec succès!', [
              {
                text: 'Voir mes emprunts',
                onPress: () => navigation.navigate('Possessions'),
                isPreferred: true,
              },
            ]);
          } catch (error: any) {
            const message = error?.response?.data?.message || 'Impossible d\'emprunter ce livre';
            Alert.alert('Erreur', message);
          } finally {
            setBorrowing(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!livre) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
        <Text style={styles.errorText}>Livre non trouvé</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header with back button */}
      <View style={[styles.header, commonStyles.shadowLarge]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails du livre</Text>
        <View style={styles.spacer} />
      </View>

      {/* Admin Badge */}
      {isAdmin && (
        <View style={styles.adminBadge}>
          <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
          <Text style={styles.adminBadgeText}>Vue Admin</Text>
        </View>
      )}

      {/* Book Cover Placeholder */}
      <View style={styles.bookCoverContainer}>
        <View style={styles.bookCover}>
          <Ionicons name="book" size={80} color={colors.white} />
        </View>
      </View>

      {/* Stock Status Banner */}
      {livre && (
        <View style={styles.statusBanner}>
          <View
            style={[
              styles.statusBannerContent,
              livre.statusStock === 'EN_STOCK' ? styles.statusBannerAvailable : styles.statusBannerUnavailable,
            ]}
          >
            <Ionicons
              name={livre.statusStock === 'EN_STOCK' ? 'checkmark-circle' : 'alert-circle'}
              size={20}
              color={livre.statusStock === 'EN_STOCK' ? colors.success : colors.danger}
            />
            <Text
              style={[
                styles.statusBannerText,
                livre.statusStock === 'EN_STOCK' ? styles.statusBannerTextAvailable : styles.statusBannerTextUnavailable,
              ]}
            >
              {livre.statusStock === 'EN_STOCK' ? 'En stock' : 'Non disponible'}
            </Text>
          </View>
        </View>
      )}

      {/* Book Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.titre}>{livre?.titre}</Text>

        <View style={styles.metadataContainer}>
          {/* Author */}
          <View style={styles.metadataItem}>
            <View style={styles.metadataLabel}>
              <Ionicons name="person" size={16} color={colors.primary} />
              <Text style={styles.metadataLabelText}>Auteur</Text>
            </View>
            <Text style={styles.metadataValue}>{livre?.auteurNom}</Text>
          </View>

          {/* Genre */}
          <View style={styles.metadataItem}>
            <View style={styles.metadataLabel}>
              <Ionicons name="pricetag" size={16} color={colors.primary} />
              <Text style={styles.metadataLabelText}>Genre</Text>
            </View>
            <Text style={styles.metadataValue}>{livre?.genreLibelle}</Text>
          </View>

          {/* Language */}
          <View style={styles.metadataItem}>
            <View style={styles.metadataLabel}>
              <Ionicons name="globe" size={16} color={colors.primary} />
              <Text style={styles.metadataLabelText}>Langue</Text>
            </View>
            <Text style={styles.metadataValue}>{livre?.langueLibelle}</Text>
          </View>

          {/* ISBN */}
          <View style={styles.metadataItem}>
            <View style={styles.metadataLabel}>
              <Ionicons name="barcode" size={16} color={colors.primary} />
              <Text style={styles.metadataLabelText}>ISBN</Text>
            </View>
            <Text style={styles.metadataValue}>{livre?.isbn}</Text>
          </View>

          {/* Publication Year */}
          <View style={styles.metadataItem}>
            <View style={styles.metadataLabel}>
              <Ionicons name="calendar" size={16} color={colors.primary} />
              <Text style={styles.metadataLabelText}>Année</Text>
            </View>
            <Text style={styles.metadataValue}>{getPublicationYear(livre?.datePublication)}</Text>
          </View>
        </View>

        {/* Resume Section */}
        {livre?.resume && (
          <View style={styles.resumeSection}>
            <Text style={styles.resumeLabel}>Résumé</Text>
            <Text style={styles.resumeText}>{livre.resume}</Text>
          </View>
        )}

        {/* Admin Stock Display */}
        {isAdmin && (
          <View style={styles.adminStockContainer}>
            <View style={styles.adminStockHeader}>
              <Ionicons name="server" size={20} color={colors.primary} />
              <Text style={styles.adminStockTitle}>Stock</Text>
            </View>
            <View style={styles.adminStockContent}>
              <View style={styles.stockInfoRow}>
                <Text style={styles.stockLabel}>Exemplaires disponibles :</Text>
                <Text style={styles.stockValue}>{livre?.nbExemplairesDisponibles ?? 0}</Text>
              </View>
              <Text style={styles.stockUpdateInfo}>Tirez pour actualiser</Text>
            </View>
          </View>
        )}

        {/* Borrow Button - Hidden for Admin */}
        {!isAdmin && (
          <TouchableOpacity
            style={[
              styles.borrowButton,
              (borrowing || livre?.statusStock !== 'EN_STOCK') && styles.borrowButtonDisabled,
            ]}
            onPress={handleBorrow}
            disabled={borrowing || livre?.statusStock !== 'EN_STOCK'}
            activeOpacity={0.7}
          >
            <Ionicons
              name="download"
              size={20}
              color={
                borrowing || livre?.statusStock !== 'EN_STOCK' ? colors.gray : colors.white
              }
            />
            <Text
              style={[
                styles.borrowButtonText,
                (borrowing || livre?.statusStock !== 'EN_STOCK') && styles.borrowButtonTextDisabled,
              ]}
            >
              {borrowing ? 'Emprunt en cours...' : 'Emprunter ce livre'}
            </Text>
            {borrowing && <ActivityIndicator color={colors.primary} style={{ marginLeft: spacing.sm }} />}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.white,
    flex: 1,
    textAlign: 'center',
  },
  spacer: {
    width: 40,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  adminBadgeText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.primary,
  },
  bookCoverContainer: {
    paddingVertical: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookCover: {
    width: 120,
    height: 160,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  statusBanner: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  statusBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
  },
  statusBannerAvailable: {
    backgroundColor: colors.lightGray,
  },
  statusBannerUnavailable: {
    backgroundColor: colors.lightGray,
  },
  statusBannerText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
  },
  statusBannerTextAvailable: {
    color: colors.success,
  },
  statusBannerTextUnavailable: {
    color: colors.danger,
  },
  detailsContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
  },
  titre: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.dark,
    marginBottom: spacing.md,
  },
  metadataContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  metadataLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 0.4,
  },
  metadataLabelText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.dark,
  },
  metadataValue: {
    fontSize: fontSizes.base,
    color: colors.dark,
    flex: 0.6,
  },
  resumeSection: {
    marginBottom: spacing.lg,
  },
  resumeLabel: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  resumeText: {
    fontSize: fontSizes.sm,
    color: colors.dark,
    lineHeight: 20,
  },
  adminStockContainer: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  adminStockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  adminStockTitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.primary,
  },
  adminStockContent: {
    gap: spacing.md,
  },
  stockInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockLabel: {
    fontSize: fontSizes.base,
    color: colors.dark,
    fontWeight: fontWeights.medium,
  },
  stockValue: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
  stockUpdateInfo: {
    fontSize: fontSizes.xs,
    color: colors.gray,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  borrowButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...commonStyles.shadow,
  },
  borrowButtonDisabled: {
    backgroundColor: colors.gray,
    opacity: 0.6,
  },
  borrowButtonText: {
    color: colors.white,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
  },
  borrowButtonTextDisabled: {
    color: colors.gray,
  },
  errorText: {
    fontSize: fontSizes.base,
    color: colors.danger,
    marginTop: spacing.md,
  },
});
