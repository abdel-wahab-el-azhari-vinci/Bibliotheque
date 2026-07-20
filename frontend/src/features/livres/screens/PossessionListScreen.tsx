import styles from '../../../styles/screens/livres/PossessionListScreen.styles';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, SectionList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { possessionApi, type BorrowResponse } from '../api/possessionApi';
import { colors, spacing, fontSizes, fontWeights, commonStyles } from '../../../styles';
import { formatDateFR, getDaysUntilReturn } from '../utils/dateUtils';

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
      console.log('Borrows loaded:', data);
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
            <Ionicons name="book" size={32} color={colors.white} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.titre} numberOfLines={2}>
              {item.titre}
            </Text>
            <Text style={styles.auteur}>{item.auteur}</Text>
            <Text style={styles.genre}>{item.genre}</Text>
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

          {item.isbn && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>ISBN:</Text>
              <Text style={styles.detailValue}>{item.isbn}</Text>
            </View>
          )}

          {item.anneePub && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Année:</Text>
              <Text style={styles.detailValue}>{item.anneePub}</Text>
            </View>
          )}
        </View>

        {/* Return Button */}
        {isActive && (
          <TouchableOpacity
            style={[styles.returnButton, returning === item.id && styles.returnButtonDisabled]}
            onPress={() => handleReturnBook(item)}
            disabled={returning === item.id}
            activeOpacity={0.7}
          >
            <Ionicons
              name="checkmark-done"
              size={18}
              color={returning === item.id ? colors.gray : colors.white}
            />
            <Text style={[
              styles.returnButtonText,
              returning === item.id && styles.returnButtonTextDisabled
            ]}>
              {returning === item.id ? 'Retour...' : 'Retourner'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Ionicons
        name={title === 'En cours' ? 'hourglass' : 'archive'}
        size={18}
        color={colors.primary}
      />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderEmptySection = () => (
    <View style={styles.emptySection}>
      <Ionicons name="book-outline" size={48} color={colors.lightGray} />
      <Text style={styles.emptySectionText}>Aucun emprunt</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, commonStyles.shadowLarge]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes emprunts</Text>
        <View style={styles.spacer} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Chargement des emprunts...</Text>
        </View>
      ) : borrows.length === 0 ? (
        <View style={styles.centerContent}>
          <Ionicons name="book-outline" size={48} color={colors.lightGray} />
          <Text style={styles.noData}>Aucun emprunt pour le moment</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBorrowItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          SectionSeparatorComponent={({ trailingItem }) => (trailingItem ? <View style={{ height: spacing.md }} /> : null)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={renderEmptySection}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

