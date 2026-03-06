import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { colors, spacing, fontSizes, fontWeights, commonStyles } from '../../../theme';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
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
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    color: colors.white,
    flex: 1,
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  darkArea: {
    flex: 0.25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scanAreaContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  scanFrame: {
    width: 280,
    height: 120,
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  bottomArea: {
    justifyContent: 'flex-start',
    paddingTop: spacing.xl,
  },
  infoText: {
    color: colors.white,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    textAlign: 'center',
  },
  inputSection: {
    padding: spacing.lg,
    backgroundColor: colors.dark,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSizes.base,
    color: colors.white,
    backgroundColor: colors.dark,
    marginBottom: spacing.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
  },
  submitBtn: {
    backgroundColor: colors.primary,
  },
  cancelBtn: {
    backgroundColor: colors.lightGray,
  },
  btnText: {
    color: colors.white,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
  },
  cancelBtnText: {
    color: colors.dark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSizes.base,
    color: colors.gray,
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  errorTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.danger,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  errorText: {
    fontSize: fontSizes.base,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  closeBtn: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  closeBtnText: {
    color: colors.dark,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
  },
});
