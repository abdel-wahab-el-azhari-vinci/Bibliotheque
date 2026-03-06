import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { livresApi } from '../api/livresApi';
import { useAuth } from '../../auth/context/AuthContext';
import { colors, spacing, fontSizes, fontWeights, commonStyles } from '../../../theme';
import type { Livre } from '../types';

export default function LivresListScreen() {
  const { user, logout } = useAuth();
  const [livres, setLivres] = useState<Livre[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadLivres();
  }, []);

  const loadLivres = async () => {
    try {
      setLoading(true);
      const data = await livresApi.getAll();
      setLivres(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les livres');
      console.error('Erreur chargement livres:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await livresApi.getAll();
      setLivres(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de recharger les livres');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      loadLivres();
      return;
    }

    try {
      setSearching(true);
      const data = await livresApi.search(searchText);
      setLivres(data);
    } catch (error) {
      Alert.alert('Erreur', 'Recherche échouée');
    } finally {
      setSearching(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr ?', [
      { text: 'Annuler', onPress: () => {}, style: 'cancel' },
      {
        text: 'Déconnexion',
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            Alert.alert('Erreur', 'Déconnexion échouée');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const renderLivreItem = ({ item }: { item: Livre }) => (
    <TouchableOpacity style={[styles.livreCard, commonStyles.shadow]}>
      {/* Book Icon */}
      <View style={styles.bookIconContainer}>
        <Ionicons name="book" size={32} color={colors.primary} />
      </View>

      {/* Book Content */}
      <View style={styles.bookContent}>
        <Text style={styles.titre} numberOfLines={2}>
          {item.titre}
        </Text>
        <View style={styles.metadata}>
          <View style={styles.metaItem}>
            <Ionicons name="person" size={14} color={colors.gray} />
            <Text style={styles.metaText}>{item.auteurNom}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="pricetag" size={14} color={colors.gray} />
            <Text style={styles.metaText}>{item.genreLibelle}</Text>
          </View>
        </View>

        {/* ISBN */}
        <View style={styles.isbnContainer}>
          <Text style={styles.isbnLabel}>ISBN: </Text>
          <Text style={styles.isbnValue}>{item.isbn || 'N/A'}</Text>
        </View>

        {/* Stock Status */}
        <View style={styles.statusContainer}>
          {item.statusStock === 'EN_STOCK' ? (
            <View style={[styles.status, styles.statusReady]}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={[styles.statusText, styles.statusTextReady]}>
                {item.nbExemplairesDisponibles} disponible(s)
              </Text>
            </View>
          ) : (
            <View style={[styles.status, styles.statusUnavailable]}>
              <Ionicons name="close-circle" size={14} color={colors.danger} />
              <Text style={[styles.statusText, styles.statusTextUnavailable]}>
                Non disponible
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          item.statusStock !== 'EN_STOCK' && styles.actionButtonDisabled,
        ]}
      >
        <Ionicons name="add-circle-outline" size={24} color={colors.white} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, commonStyles.shadowLarge]}>
        <View style={styles.headerLeft}>
          <Ionicons name="library" size={28} color={colors.white} />
          <Text style={styles.headerTitle}>Bibliothèque</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* User card */}
      {user && (
        <View style={[styles.userCard, commonStyles.shadow]}>
          <View style={styles.userAvatar}>
            <Ionicons name="person-circle" size={40} color={colors.primary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user.prenom} {user.nom}
            </Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
          <View style={styles.userBadge}>
            <Ionicons name="checkmark-outline" size={16} color={colors.success} />
            <Text style={styles.userBadgeText}>Actif</Text>
          </View>
        </View>
      )}

      {/* Search bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.gray}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Rechercher par titre..."
            placeholderTextColor={colors.gray}
            value={searchText}
            onChangeText={setSearchText}
            editable={!searching}
          />
          {searchText.length > 0 && !searching && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color={colors.gray} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.searchBtn, searching && styles.disabled]}
          onPress={handleSearch}
          disabled={searching}
        >
          {searching ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Ionicons name="search" size={20} color={colors.white} />
          )}
        </TouchableOpacity>
      </View>

      {/* Livres list */}
      {loading ? (
        <View style={styles.centerContent}>
          <Ionicons name="book-outline" size={48} color={colors.lightGray} />
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.lg }} />
          <Text style={styles.loadingText}>Chargement des livres...</Text>
        </View>
      ) : livres.length === 0 ? (
        <View style={styles.centerContent}>
          <Ionicons name="book-outline" size={48} color={colors.lightGray} />
          <Text style={styles.noData}>Aucun livre trouvé</Text>
        </View>
      ) : (
        <FlatList
          data={livres}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLivreItem}
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
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerTitle: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  userCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    padding: spacing.md,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  userAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: fontSizes.sm,
    color: colors.gray,
  },
  userBadge: {
    backgroundColor: colors.success + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  userBadgeText: {
    fontSize: fontSizes.xs,
    color: colors.success,
    fontWeight: fontWeights.bold,
  },
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    gap: spacing.md,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...commonStyles.shadow,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSizes.base,
    color: colors.dark,
  },
  searchBtn: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  disabled: {
    opacity: 0.6,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xxl,
  },
  livreCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  bookIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookContent: {
    flex: 1,
  },
  titre: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  metadata: {
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    fontSize: fontSizes.sm,
    color: colors.gray,
  },
  isbnContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  isbnLabel: {
    fontSize: fontSizes.xs,
    color: colors.gray,
    fontWeight: fontWeights.semibold,
  },
  isbnValue: {
    fontSize: fontSizes.xs,
    color: colors.dark,
    fontFamily: 'monospace',
  },
  statusContainer: {
    marginTop: spacing.sm,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusReady: {
    backgroundColor: colors.success + '15',
  },
  statusUnavailable: {
    backgroundColor: colors.danger + '15',
  },
  statusText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
  },
  statusTextReady: {
    color: colors.success,
  },
  statusTextUnavailable: {
    color: colors.danger,
  },
  actionButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  actionButtonDisabled: {
    backgroundColor: colors.lightGray,
  },
  loadingText: {
    fontSize: fontSizes.base,
    color: colors.gray,
    marginTop: spacing.md,
  },
  noData: {
    fontSize: fontSizes.base,
    color: colors.gray,
    marginTop: spacing.lg,
  },
});
