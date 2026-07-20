import styles from '../../../styles/screens/livres/LivreAddScreen.styles';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { livresApi, auteursApi, genresApi, languesApi } from '../api/livresApi';
import { bookSearchService } from '../api/bookSearchService';
import { colors, spacing, fontSizes, fontWeights, commonStyles } from '../../../styles';
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
  const [searchingBook, setSearchingBook] = useState(false);

  const [openAuteurModal, setOpenAuteurModal] = useState(false);
  const [openGenreModal, setOpenGenreModal] = useState(false);
  const [openLangueModal, setOpenLangueModal] = useState(false);
  const [openScanner, setOpenScanner] = useState(false);
  const [scanning, setScanning] = useState(true);

  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

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

  const handleBarCodeScanned = async (code: any) => {
    if (!code || !scanning) return;

    setScanning(false);
    setSearchingBook(true);

    // Extract ISBN from barcode (expo-camera Vision API uses 'data')
    let isbn = code.data || code.displayValue || code.value || "";

    // Remove hyphens or spaces
    isbn = isbn.replace(/[-\s]/g, '');

    console.log('��� ISBN scanné:', isbn);

    // Close scanner
    setOpenScanner(false);

    // Rechercher les infos du livre
    const bookInfo = await bookSearchService.searchByISBN(isbn);
    setSearchingBook(false);

    if (!bookInfo) {
      Alert.alert(
        '⚠️ Livre non trouvé',
        `Aucun livre trouvé pour l'ISBN ${isbn}.\nVous pouvez remplir les infos manuellement.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Au moins mettre l'ISBN
              setFormData((prev) => ({ ...prev, isbn }));
              setScanning(true);
            },
          },
        ]
      );
      return;
    }

    // Auto-compléter les champs
    console.log('✅ Infos trouvées:', bookInfo);

    // Remplir le titre, ISBN et résumé
    setFormData((prev) => ({
      ...prev,
      titre: bookInfo.titre,
      isbn: bookInfo.isbn,
      resume: bookInfo.resume || '',
    }));

    // Chercher et sélectionner l'auteur
    if (bookInfo.auteur && auteurs.length > 0) {
      const matchingAuteur = auteurs.find(
        (a) =>
          a.nom.toLowerCase().includes(bookInfo.auteur.toLowerCase()) ||
          bookInfo.auteur.toLowerCase().includes(a.nom.toLowerCase())
      );
      if (matchingAuteur) {
        setSelectedAuteur(matchingAuteur);
      }
    }

    // Chercher et sélectionner la langue
    if (bookInfo.langue && langues.length > 0) {
      const matchingLangue = langues.find(
        (l) => l.libelle.toLowerCase() === bookInfo.langue!.toLowerCase()
      );
      if (matchingLangue) {
        setSelectedLangue(matchingLangue);
      }
    }

    // Afficher un message de succès avec les infos
    Alert.alert('✅ Succès!', 
      `Titre: ${bookInfo.titre}\nAuteur: ${bookInfo.auteur || 'Non trouvé'}\n\nVérifiez les infos et appuyez sur Enregistrer`,
      [
        {
          text: 'OK',
          onPress: () => setScanning(true),
        },
      ]
    );
  };

  const handleOpenScanner = async () => {
    if (!permission) {
      Alert.alert('Erreur', 'Permission de caméra non disponible');
      return;
    }

    if (!permission.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission refusée', 'La permission d\'accès à la caméra est requise');
        return;
      }
    }

    setScanning(true);
    setOpenScanner(true);
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
              editable={!searchingBook}
            />
            <TouchableOpacity 
              style={[styles.scanButton, searchingBook && styles.scanButtonDisabled]}
              onPress={handleOpenScanner}
              disabled={searchingBook}
            >
              {searchingBook ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <>
                  <Ionicons name="camera" size={20} color={colors.white} />
                  <Text style={styles.scanButtonText}>Scanner</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={16} color={colors.primary} />
            <Text style={styles.infoText}>Scannez un code-barres ISBN pour auto-compléter les infos du livre</Text>
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
          style={[styles.submitButton, (submitting || searchingBook) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting || searchingBook}
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

      {/* Barcode Scanner Modal */}
      <Modal
        visible={openScanner}
        transparent
        animationType="slide"
        onRequestClose={() => setOpenScanner(false)}
      >
        <View style={styles.scannerContainer}>
          <View style={styles.scannerHeader}>
            <TouchableOpacity onPress={() => setOpenScanner(false)}>
              <Ionicons name="close" size={28} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.scannerTitle}>Scanner ISBN</Text>
            <View style={{ width: 28 }} />
          </View>

          {permission?.granted ? (
            <>
              <CameraView
                ref={cameraRef}
                style={styles.scanner}
                facing="back"
                onBarcodeScanned={scanning ? handleBarCodeScanned : undefined}
              />
              <View style={styles.scannerOverlay}>
                <View style={styles.scannerFrame} />
              </View>
              <View style={styles.scannerFooter}>
                <Text style={styles.scannerText}>
                  Pointez le code-barres vers la caméra
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.permissionError}>
              <Ionicons name="alert-circle" size={48} color={colors.danger} />
              <Text style={styles.permissionErrorText}>
                Permission d'accès à la caméra refusée
              </Text>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={requestPermission}
              >
                <Text style={styles.permissionButtonText}>Autoriser</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

