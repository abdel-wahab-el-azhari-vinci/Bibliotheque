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
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { livresApi } from '../api/livresApi';
import { useAuth } from '../../auth/context/AuthContext';
import { colors, spacing, fontSizes, fontWeights, commonStyles } from '../../../theme';
import type { Livre } from '../types';

type RootStackParamList = {
  LivresList: undefined;
  LivreDetail: { id: number };
  LivreAdd: undefined;
  Possessions: undefined;
  AdminPanel: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'LivresList'>;

export default function LivresListScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const [livres, setLivres] = useState<Livre[]>([]);
  const [originalLivres, setOriginalLivres] = useState<Livre[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const fabScale = new Animated.Value(1);

  useEffect(() => {
    loadLivres();
  }, []);

  // Filtre en temps réel
  useEffect(() => {
    if (!searchText.trim()) {
      setLivres(originalLivres);
    } else {
      const filtered = originalLivres.filter(livre =>
        livre.titre.toLowerCase().startsWith(searchText.toLowerCase()) ||
        livre.auteurNom.toLowerCase().startsWith(searchText.toLowerCase())
      );
      setLivres(filtered);
    }
  }, [searchText, originalLivres]);

  const loadLivres = async () => {
    try {
      setLoading(true);
      const data = await livresApi.getAll();
      setOriginalLivres(data);
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
      setOriginalLivres(data);
      setLivres(data);
      setSearchText('');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de recharger les livres');
    } finally {
      setRefreshing(false);
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

  const handleAddLivre = () => {
    Animated.sequence([
      Animated.timing(fabScale, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(fabScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    navigation.navigate('LivreAdd');
  };

  const handleViewBorrowings = () => {
    navigation.navigate('Possessions');
  };

  const handleAdminPanel = () => {
    navigation.navigate('AdminPanel');
  };

  const renderLivreItem = ({ item }: { item: Livre }) => (
    <TouchableOpacity
      style={[styles.livreCard, commonStyles.shadow]}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('LivreDetail', { id: item.id })}
    >
      {/* Book Icon */}
      <View style={styles.bookIconContainer}>
        <Ionicons name="book" size={32} color={colors.white} />
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
        <View style={styles.isbnContainer}>
          <Text style={styles.isbnLabel}>ISBN: </Text>
          <Text style={styles.isbnValue}>{item.isbn}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.status,
              item.statusStock === 'EN_STOCK' ? styles.statusReady : styles.statusUnavailable,
            ]}
          >
            <Ionicons
              name={item.statusStock === 'EN_STOCK' ? 'checkmark-circle' : 'close-circle'}
              size={14}
              color={item.statusStock === 'EN_STOCK' ? colors.success : colors.danger}
            />
            <Text
              style={[
                styles.statusText,
                item.statusStock === 'EN_STOCK' ? styles.statusTextReady : styles.statusTextUnavailable,
              ]}
            >
              {item.statusStock === 'EN_STOCK' ? 'En stock' : 'Non disponible'}
            </Text>
          </View>
        </View>
      </View>

      {/* Detail Button */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          item.statusStock !== 'EN_STOCK' && styles.actionButtonDisabled,
        ]}
        onPress={() => navigation.navigate('LivreDetail', { id: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.actionButtonContent}>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={item.statusStock === 'EN_STOCK' ? colors.white : colors.gray}
          />
          <Text style={[
            styles.actionButtonText,
            item.statusStock !== 'EN_STOCK' && styles.actionButtonTextDisabled
          ]}>
            Détails
          </Text>
        </View>
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
        <View style={styles.headerRight}>
          {user?.role === "ADMIN" && (
            <TouchableOpacity 
              onPress={handleAdminPanel}
              style={{ marginRight: spacing.md }}
              activeOpacity={0.7}
            >
              <Ionicons name="cog" size={24} color={colors.white} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            onPress={handleViewBorrowings} 
            style={{ marginRight: spacing.md }}
            activeOpacity={0.7}
          >
            <Ionicons name="bookmark" size={24} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
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
            <Ionicons name="checkmark-outline" size={16} color={colors.white} />
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
            color={colors.primary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Rechercher un livre ou un auteur..."
            placeholderTextColor={colors.gray}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results info */}
      {searchText.length > 0 && (
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>
            {livres.length} livre{livres.length !== 1 ? 's' : ''} trouvé{livres.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

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
          <Text style={styles.noData}>
            {searchText ? 'Aucun livre ne correspond à votre recherche' : 'Aucun livre trouvé'}
          </Text>
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

      {/* Floating Action Button (FAB) */}
      <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity
          style={[styles.fab, commonStyles.shadowLarge]}
          onPress={handleAddLivre}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={32} color={colors.white} />
        </TouchableOpacity>
      </Animated.View>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  headerTitle: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  userCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: 8,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  userEmail: {
    fontSize: fontSizes.sm,
    color: colors.gray,
    marginTop: spacing.xs,
  },
  userBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  userBadgeText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
  searchSection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    borderColor: colors.lightGray,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSizes.sm,
    color: colors.text,
  },
  resultsInfo: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  resultsText: {
    fontSize: fontSizes.sm,
    color: colors.gray,
    fontWeight: fontWeights.medium,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  livreCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: spacing.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bookIconContainer: {
    width: 60,
    height: 80,
    backgroundColor: colors.primary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookContent: {
    flex: 1,
  },
  titre: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  metadata: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    fontSize: fontSizes.xs,
    color: colors.gray,
  },
  isbnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  isbnLabel: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    color: colors.gray,
  },
  isbnValue: {
    fontSize: fontSizes.xs,
    color: colors.gray,
  },
  statusContainer: {
    marginBottom: spacing.xs,
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
    backgroundColor: colors.lightSuccess,
  },
  statusUnavailable: {
    backgroundColor: colors.lightDanger,
  },
  statusText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
  },
  statusTextReady: {
    color: colors.success,
  },
  statusTextUnavailable: {
    color: colors.danger,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: colors.lightGray,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionButtonText: {
    color: colors.white,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.xs,
  },
  actionButtonTextDisabled: {
    color: colors.gray,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSizes.md,
    color: colors.gray,
    marginTop: spacing.md,
  },
  noData: {
    fontSize: fontSizes.md,
    color: colors.gray,
    marginTop: spacing.md,
  },
  fabContainer: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
