import styles from '../../../styles/components/CameraScanner.styles';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { colors, spacing, fontSizes, fontWeights, commonStyles } from '../../../styles';

interface CameraScannerProps {
  isVisible: boolean;
  onClose: () => void;
  onIsbnScanned: (isbn: string) => void;
}

export default function CameraScanner({ isVisible, onClose, onIsbnScanned }: CameraScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [manualInput, setManualInput] = useState('');

  useEffect(() => {
    if (isVisible && permission === null) {
      requestPermission();
    }
  }, [isVisible, permission]);

  const handleSubmit = () => {
    if (!manualInput.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un ISBN');
      return;
    }
    onIsbnScanned(manualInput);
    setManualInput('');
    onClose();
  };

  if (!permission) {
    return (
      <Modal visible={isVisible} transparent animationType="slide">
        <View style={styles.container}>
          <View style={[styles.header, commonStyles.shadowLarge]}>
            <TouchableOpacity onPress={onClose} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={28} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scanner ISBN</Text>
            <View style={{ width: 44 }} />
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Vérification des permissions...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  if (!permission.granted) {
    return (
      <Modal visible={isVisible} transparent animationType="slide">
        <View style={styles.container}>
          <View style={[styles.header, commonStyles.shadowLarge]}>
            <TouchableOpacity onPress={onClose} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={28} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scanner ISBN</Text>
            <View style={{ width: 44 }} />
          </View>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={64} color={colors.danger} />
            <Text style={styles.errorTitle}>Accès caméra refusé</Text>
            <Text style={styles.errorText}>
              Veuillez autoriser l'accès à la caméra dans les paramètres
            </Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={[styles.header, commonStyles.shadowLarge]}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scanner ISBN</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing="back" />
          
          <View style={styles.overlay} pointerEvents="none">
            <View style={styles.darkArea} />
            <View style={styles.scanAreaContainer}>
              <View style={styles.scanFrame} />
            </View>
            <View style={[styles.darkArea, styles.bottomArea]}>
              <Text style={styles.infoText}>Saisissez l'ISBN ci-dessous</Text>
            </View>
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>ISBN</Text>
          <TextInput
            style={styles.textInput}
            placeholder="9780200379624"
            placeholderTextColor={colors.gray}
            value={manualInput}
            onChangeText={setManualInput}
            keyboardType="numeric"
            autoFocus
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.btn, styles.submitBtn]}
              onPress={handleSubmit}
            >
              <Ionicons name="checkmark" size={24} color={colors.white} />
              <Text style={styles.btnText}>Valider</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color={colors.dark} />
              <Text style={[styles.btnText, styles.cancelBtnText]}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

