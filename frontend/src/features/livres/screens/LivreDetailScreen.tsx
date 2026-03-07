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
      console.log('Livre loaded:', data);
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with back button */}
      <View style={[styles.header, commonStyles.shadowLarge]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails du livre</Text>
        <View style={styles.spacer} />
      </View>

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

        {/* Borrow Button */}
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
    backgroundColor: colors.lightSuccess,
  },
  statusBannerUnavailable: {
    backgroundColor: colors.lightDanger,
  },
  statusBannerText: {
    fontSize: fontSizes.md,
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
    paddingBottom: spacing.xl,
  },
  titre: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  metadataContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomColor: colors.lightGray,
    borderBottomWidth: 1,
  },
  metadataItem: {
    gap: spacing.xs,
  },
  metadataLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  metadataLabelText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.primary,
  },
  metadataValue: {
    fontSize: fontSizes.md,
    color: colors.text,
    marginLeft: spacing.lg,
  },
  resumeSection: {
    marginBottom: spacing.lg,
  },
  resumeLabel: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  resumeText: {
    fontSize: fontSizes.md,
    color: colors.gray,
    lineHeight: 24,
  },
  borrowButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
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
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
  borrowButtonTextDisabled: {
    color: colors.gray,
  },
  errorText: {
    fontSize: fontSizes.lg,
    color: colors.danger,
    marginTop: spacing.md,
  },
});
