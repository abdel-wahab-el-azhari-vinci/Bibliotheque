import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { livresApi, auteursApi, genresApi, languesApi } from '../api/livresApi';
import { colors, spacing, fontSizes, fontWeights, commonStyles } from '../../../theme';
import type { Auteur, Genre, Langue, LivreRequest } from '../types';

type RootStackParamList = {
  LivreAdd: undefined;
  LivresList: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'LivreAdd'>;

export default function LivreAddScreen({ navigation }: Props) {
  const [formData, setFormData] = useState<LivreRequest>({
    titre: '',
    auteurId: 0,
    genreId: 0,
    langueId: 0,
    isbn: '',
    resume: '',
  });

  const [auteurs, setAuteurs] = useState<Auteur[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [langues, setLangues] = useState<Langue[]>([]);

  const [selectedAuteur, setSelectedAuteur] = useState<Auteur | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [selectedLangue, setSelectedLangue] = useState<Langue | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [openAuteurModal, setOpenAuteurModal] = useState(false);
  const [openGenreModal, setOpenGenreModal] = useState(false);
  const [openLangueModal, setOpenLangueModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [auteursData, genresData, languesData] = await Promise.all([
        auteursApi.getAll(),
        genresApi.getAll(),
        languesApi.getAll(),
      ]);
      setAuteurs(auteursData);
      setGenres(genresData);
      setLangues(languesData);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les données');
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.titre.trim()) {
      Alert.alert('Erreur', 'Le titre est obligatoire');
      return;
    }

    if (!selectedAuteur) {
      Alert.alert('Erreur', 'Veuillez sélectionner un auteur');
      return;
    }

    if (!selectedGenre) {
      Alert.alert('Erreur', 'Veuillez sélectionner un genre');
      return;
    }

    if (!selectedLangue) {
      Alert.alert('Erreur', 'Veuillez sélectionner une langue');
      return;
    }

    try {
      setSubmitting(true);
      const payload: LivreRequest = {
        titre: formData.titre.trim(),
        auteurId: selectedAuteur.id,
        genreId: selectedGenre.id,
        langueId: selectedLangue.id,
        isbn: formData.isbn?.trim(),
        resume: formData.resume?.trim(),
      };

      await livresApi.create(payload);
      Alert.alert('Succès', 'Livre créé avec succès', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('LivresList'),
        },
      ]);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le livre');
      console.error('Erreur création livre:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderAuteurItem = ({ item }: { item: Auteur }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        setSelectedAuteur(item);
        setFormData({ ...formData, auteurId: item.id });
        setOpenAuteurModal(false);
      }}
    >
      <Text style={styles.modalItemText}>
        {item.prenom ? `${item.prenom} ${item.nom}` : item.nom}
      </Text>
      {selectedAuteur?.id === item.id && (
        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  const renderGenreItem = ({ item }: { item: Genre }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        setSelectedGenre(item);
        setFormData({ ...formData, genreId: item.id });
        setOpenGenreModal(false);
      }}
    >
      <Text style={styles.modalItemText}>{item.libelle}</Text>
      {selectedGenre?.id === item.id && (
        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  const renderLangueItem = ({ item }: { item: Langue }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        setSelectedLangue(item);
        setFormData({ ...formData, langueId: item.id });
        setOpenLangueModal(false);
      }}
    >
      <Text style={styles.modalItemText}>{item.libelle}</Text>
      {selectedLangue?.id === item.id && (
        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, commonStyles.shadowLarge]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nouveau Livre</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, commonStyles.shadowLarge]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouveau Livre</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* ISBN Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ISBN</Text>
          <View style={styles.isbnInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Saisir ISBN"
              placeholderTextColor={colors.gray}
              value={formData.isbn || ''}
              onChangeText={(text) => setFormData({ ...formData, isbn: text })}
            />
            <TouchableOpacity style={styles.scanButton}>
              <Ionicons name="camera" size={20} color={colors.white} />
              <Text style={styles.scanButtonText}>Scanner ISBN</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Titre Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Titre</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Titre du livre"
            placeholderTextColor={colors.gray}
            value={formData.titre}
            onChangeText={(text) => setFormData({ ...formData, titre: text })}
          />
        </View>

        {/* Auteur Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Auteur</Text>
          <TouchableOpacity
            style={styles.dropdownInput}
            onPress={() => setOpenAuteurModal(true)}
          >
            <Ionicons name="person" size={18} color={colors.primary} style={styles.dropdownIcon} />
            <Text
              style={[
                styles.dropdownText,
                !selectedAuteur && styles.dropdownPlaceholder,
              ]}
            >
              {selectedAuteur
                ? selectedAuteur.prenom
                  ? `${selectedAuteur.prenom} ${selectedAuteur.nom}`
                  : selectedAuteur.nom
                : 'Sélectionner un auteur'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.gray} />
          </TouchableOpacity>
        </View>

        {/* Genre Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genre</Text>
          <TouchableOpacity
            style={styles.dropdownInput}
            onPress={() => setOpenGenreModal(true)}
          >
            <Ionicons name="pricetag" size={18} color={colors.primary} style={styles.dropdownIcon} />
            <Text
              style={[
                styles.dropdownText,
                !selectedGenre && styles.dropdownPlaceholder,
              ]}
            >
              {selectedGenre ? selectedGenre.libelle : 'Sélectionner un genre'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.gray} />
          </TouchableOpacity>
        </View>

        {/* Langue Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Langue</Text>
          <TouchableOpacity
            style={styles.dropdownInput}
            onPress={() => setOpenLangueModal(true)}
          >
            <Ionicons name="globe" size={18} color={colors.primary} style={styles.dropdownIcon} />
            <Text
              style={[
                styles.dropdownText,
                !selectedLangue && styles.dropdownPlaceholder,
              ]}
            >
              {selectedLangue ? selectedLangue.libelle : 'Sélectionner une langue'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.gray} />
          </TouchableOpacity>
        </View>

        {/* Résumé Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Résumé (optionnel)</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Résumé du livre..."
            placeholderTextColor={colors.gray}
            value={formData.resume || ''}
            onChangeText={(text) => setFormData({ ...formData, resume: text })}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color={colors.white} />
              <Text style={styles.submitButtonText}>Enregistrer</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Auteur Modal */}
      <Modal
        visible={openAuteurModal}
        transparent
        animationType="slide"
        onRequestClose={() => setOpenAuteurModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner un auteur</Text>
              <TouchableOpacity onPress={() => setOpenAuteurModal(false)}>
                <Ionicons name="close" size={24} color={colors.dark} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={auteurs}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderAuteurItem}
              scrollEnabled
            />
          </View>
        </View>
      </Modal>

      {/* Genre Modal */}
      <Modal
        visible={openGenreModal}
        transparent
        animationType="slide"
        onRequestClose={() => setOpenGenreModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner un genre</Text>
              <TouchableOpacity onPress={() => setOpenGenreModal(false)}>
                <Ionicons name="close" size={24} color={colors.dark} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={genres}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderGenreItem}
              scrollEnabled
            />
          </View>
        </View>
      </Modal>

      {/* Langue Modal */}
      <Modal
        visible={openLangueModal}
        transparent
        animationType="slide"
        onRequestClose={() => setOpenLangueModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner une langue</Text>
              <TouchableOpacity onPress={() => setOpenLangueModal(false)}>
                <Ionicons name="close" size={24} color={colors.dark} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={langues}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderLangueItem}
              scrollEnabled
            />
          </View>
        </View>
      </Modal>
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
  headerTitle: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.dark,
    marginBottom: spacing.md,
  },
  textInput: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSizes.base,
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.border,
    ...commonStyles.shadow,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  isbnInputContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    ...commonStyles.shadow,
  },
  scanButtonText: {
    color: colors.white,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
  },
  dropdownInput: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    ...commonStyles.shadow,
  },
  dropdownIcon: {
    marginRight: spacing.sm,
  },
  dropdownText: {
    flex: 1,
    fontSize: fontSizes.base,
    color: colors.dark,
  },
  dropdownPlaceholder: {
    color: colors.gray,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xxl,
    ...commonStyles.shadow,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSizes.base,
    color: colors.gray,
    marginTop: spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.dark,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  modalItemText: {
    fontSize: fontSizes.base,
    color: colors.dark,
    flex: 1,
  },
});
