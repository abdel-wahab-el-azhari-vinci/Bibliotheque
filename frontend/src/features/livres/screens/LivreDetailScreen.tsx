import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { livresApi } from '../api/livresApi';
import { possessionApi } from '../api/possessionApi';
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
  const [livre, setLivre] = useState<Livre | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    loadLivre();
  }, []);

  const loadLivre = async () => {
    try {
      setLoading(true);
      const data = await livresApi.getById(id);
      setLivre(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les détails du livre');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
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
            Alert.alert('Succès', 'Livre emprunté avec succès!', [
              {
                text: 'Voir mes emprunts',
                onPress: () => navigation.navigate('Possessions'),
              },
              {
                text: 'Retour à la liste',
                onPress: () => navigation.navigate('LivresList'),
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with back button */}
      <View style={[styles.header, commonStyles.shadowLarge]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails du livre</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Book Cover Section */}
      <View style={styles.coverSection}>
        <View style={styles.bookCoverPlaceholder}>
          <Ionicons name="book" size={80} color={colors.primary} />
        </View>
        <Text style={styles.titre}>{livre.titre}</Text>
      </View>

      {/* Details Card */}
      <View style={[styles.detailsCard, commonStyles.shadow]}>
        {/* Author */}
        <View style={styles.detailRow}>
          <View style={styles.detailLabel}>
            <Ionicons name="person" size={20} color={colors.primary} />
            <Text style={styles.label}>Auteur</Text>
          </View>
          <Text style={styles.value}>{livre.auteurNom}</Text>
        </View>

        {/* Genre */}
        <View style={[styles.detailRow, styles.borderTop]}>
          <View style={styles.detailLabel}>
            <Ionicons name="pricetag" size={20} color={colors.primary} />
            <Text style={styles.label}>Genre</Text>
          </View>
          <Text style={styles.value}>{livre.genreLibelle}</Text>
        </View>

        {/* Language */}
        <View style={[styles.detailRow, styles.borderTop]}>
          <View style={styles.detailLabel}>
            <Ionicons name="globe" size={20} color={colors.primary} />
            <Text style={styles.label}>Langue</Text>
          </View>
          <Text style={styles.value}>{livre.langueLibelle || 'N/A'}</Text>
        </View>

        {/* ISBN */}
        <View style={[styles.detailRow, styles.borderTop]}>
          <View style={styles.detailLabel}>
            <Ionicons name="barcode" size={20} color={colors.primary} />
            <Text style={styles.label}>ISBN</Text>
          </View>
          <Text style={styles.value}>{livre.isbn || 'N/A'}</Text>
        </View>

        {/* Publication Date */}
        <View style={[styles.detailRow, styles.borderTop]}>
          <View style={styles.detailLabel}>
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={styles.label}>Publication</Text>
          </View>
          <Text style={styles.value}>{livre.datePublication || 'N/A'}</Text>
        </View>
      </View>

      {/* Resume Section (Description) */}
      {livre.resume && (
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Résumé</Text>
          <Text style={styles.descriptionText}>{livre.resume}</Text>
        </View>
      )}

      {/* Stock Status */}
      <View style={styles.statusSection}>
        {livre.statusStock === 'EN_STOCK' ? (
          <View style={[styles.statusBanner, styles.statusBannerReady]}>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>Disponible</Text>
              <Text style={styles.statusSubtitle}>
                {livre.nbExemplairesDisponibles} exemplaire(s) disponible(s)
              </Text>
            </View>
          </View>
        ) : (
          <View style={[styles.statusBanner, styles.statusBannerUnavailable]}>
            <Ionicons name="close-circle" size={24} color={colors.danger} />
            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>Non disponible</Text>
              <Text style={styles.statusSubtitle}>Tous les exemplaires sont empruntés</Text>
            </View>
          </View>
        )}
      </View>

      {/* Borrow Button */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[
            styles.borrowButton,
            livre.statusStock !== 'EN_STOCK' && styles.borrowButtonDisabled,
          ]}
          onPress={handleBorrow}
          disabled={livre.statusStock !== 'EN_STOCK' || borrowing}
        >
          {borrowing ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Ionicons name="download-outline" size={20} color={colors.white} />
              <Text style={styles.borrowButtonText}>Emprunter ce livre</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={{ height: spacing.xxl }} />
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
  coverSection: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bookCoverPlaceholder: {
    width: 100,
    height: 140,
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...commonStyles.shadow,
  },
  titre: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.dark,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  detailsCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.lg,
    borderRadius: 8,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  label: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.dark,
  },
  value: {
    fontSize: fontSizes.base,
    color: colors.gray,
    fontWeight: fontWeights.normal,
  },
  descriptionSection: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: 8,
    ...commonStyles.shadow,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.dark,
    marginBottom: spacing.md,
  },
  descriptionText: {
    fontSize: fontSizes.base,
    color: colors.gray,
    lineHeight: 20,
  },
  statusSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  statusBanner: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    gap: spacing.md,
  },
  statusBannerReady: {
    backgroundColor: colors.success + '15',
  },
  statusBannerUnavailable: {
    backgroundColor: colors.danger + '15',
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  statusSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.gray,
  },
  actionSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  borrowButton: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.lg,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    ...commonStyles.shadowLarge,
  },
  borrowButtonDisabled: {
    backgroundColor: colors.lightGray,
  },
  borrowButtonText: {
    color: colors.white,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
  },
  errorText: {
    fontSize: fontSizes.base,
    color: colors.danger,
    marginTop: spacing.md,
  },
});
