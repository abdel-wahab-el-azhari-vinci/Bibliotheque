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
} from 'react-native';
import { livresApi } from '../api/livresApi';
import { useAuth } from '../../auth/context/AuthContext';
import type { Livre } from '../types';

export default function LivresListScreen() {
  const { user, logout } = useAuth();
  const [livres, setLivres] = useState<Livre[]>([]);
  const [loading, setLoading] = useState(true);
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
    try {
      await logout();
    } catch (error) {
      Alert.alert('Erreur', 'Déconnexion échouée');
    }
  };

  const renderLivreItem = ({ item }: { item: Livre }) => (
    <View style={styles.livreCard}>
      <Text style={styles.titre}>{item.titre}</Text>
      <Text style={styles.detail}>Auteur: {item.auteurNom}</Text>
      <Text style={styles.detail}>Genre: {item.genreLibelle}</Text>
      <Text style={styles.detail}>ISBN: {item.isbn || 'N/A'}</Text>
      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.status,
            item.statusStock === 'EN_STOCK' ? styles.stockOk : styles.stockNo,
          ]}
        >
          {item.statusStock === 'EN_STOCK'
            ? `✓ ${item.nbExemplairesDisponibles} exemplaire(s)`
            : '✗ Sorti'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bibliothèque</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutBtn}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      {/* User info - DEBUG */}
      <View style={styles.userInfo}>
        <Text style={styles.userText}>
          {user ? `${user.prenom} ${user.nom}` : 'Pas de user'}
        </Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Rechercher par titre..."
          value={searchText}
          onChangeText={setSearchText}
          editable={!searching}
        />
        <TouchableOpacity
          style={[styles.searchBtn, searching && styles.disabled]}
          onPress={handleSearch}
          disabled={searching}
        >
          <Text style={styles.searchBtnText}>{searching ? '...' : '���'}</Text>
        </TouchableOpacity>
      </View>

      {/* Livres list */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : livres.length === 0 ? (
        <Text style={styles.noData}>Aucun livre trouvé</Text>
      ) : (
        <FlatList
          data={livres}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLivreItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  header: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutBtn: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  userInfo: {
    backgroundColor: '#e8f4f8',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 6,
  },
  userText: {
    fontSize: 14,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: {
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  livreCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  titre: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  detail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  statusContainer: {
    marginTop: 8,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  stockOk: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  stockNo: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  noData: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
  },
});
