import { useState } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  MD3LightTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { authApi } from '../api/authApi';
import type { RegisterRequest } from '../types';
import type { RegisterScreenNavigationProp } from '@/shared/navigation/types';

/**
 * ============================================================================
 * REGISTER SCREEN - avec React Native Paper
 * ============================================================================
 *
 * UI Framework : React Native Paper (Material Design)
 * 
 * Responsabilités :
 * - Afficher le formulaire d'inscription
 * - Valider les données localement
 * - Appeler authApi.register() (PAS d'axios direct!)
 * - Afficher les erreurs
 * - Rediriger après succès
 *
 * Règle AI_RULES.md : 
 * - Gère UNIQUEMENT l'UI
 * - AUCUN axios/fetch directs
 * - Appelle authApi pour la logique réseau
 */

interface RegisterForm {
  email: string;
  password: string;
  passwordConfirm: string;
  nom: string;
  prenom: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  nom?: string;
  prenom?: string;
}

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

export function RegisterScreen({ navigation }: RegisterScreenProps): JSX.Element {
  // État du formulaire
  const [form, setForm] = useState<RegisterForm>({
    email: '',
    password: '',
    passwordConfirm: '',
    nom: '',
    prenom: '',
  });

  // État des erreurs
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string>('');

  // État du chargement
  const [loading, setLoading] = useState(false);

  // État des inputs visibles
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  /**
   * VALIDATION LOCALE
   * Avant d'envoyer au backend
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email
    if (!form.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Email invalide';
    }

    // Mot de passe
    if (!form.password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (form.password.length < 6) {
      newErrors.password =
        'Le mot de passe doit avoir au moins 6 caractères';
    }

    // Confirmation mot de passe
    if (form.password !== form.passwordConfirm) {
      newErrors.passwordConfirm =
        'Les mots de passe ne correspondent pas';
    }

    // Nom
    if (!form.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    } else if (form.nom.trim().length < 2) {
      newErrors.nom = 'Le nom doit avoir au moins 2 caractères';
    }

    // Prénom
    if (!form.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    } else if (form.prenom.trim().length < 2) {
      newErrors.prenom = 'Le prénom doit avoir au moins 2 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * HANDLE REGISTER
   * 1. Valide localement
   * 2. Appelle authApi.register()
   * 3. Gère les succès/erreurs
   * 4. Redirige vers l'app
   */
  const handleRegister = async (): Promise<void> => {
    // Réinitialiser les erreurs serveur
    setServerError('');

    // Valider localement
    if (!validateForm()) {
      console.warn('❌ Validation locale échouée');
      return;
    }

    setLoading(true);

    try {
      // Préparer les données
      const registerData: RegisterRequest = {
        email: form.email.trim(),
        password: form.password,
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
      };

      console.log('��� Envoi inscription...');

      // Appeler authApi.register() (PAS axios direct!)
      const response = await authApi.register(registerData);

      console.log('✅ Inscription réussie', response);

      // Afficher confirmation
      Alert.alert(
        'Succès',
        `Bienvenue ${response.prenom}! Vous êtes maintenant connecté.`,
        [
          {
            text: 'Continuer',
            onPress: (): void => {
              // TODO : Rediriger avec navigation.navigate('Home') ou 'Dashboard'
              console.log('Redirection vers l\'app principale');
            },
          },
        ]
      );
    } catch (error: unknown) {
      console.error('❌ Erreur inscription:', error);

      // Type guard pour accéder à error.error
      const errorMessage: string = 
        (error && typeof error === 'object' && 'error' in error && typeof (error as {error: unknown}).error === 'string')
          ? (error as {error: string}).error
          : 'Une erreur est survenue. Veuillez réessayer.';
      
      setServerError(errorMessage);
      Alert.alert('Erreur', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * HANDLE CHANGE INPUT
   */
  const handleChangeText = (field: keyof RegisterForm, value: string): void => {
    setForm({ ...form, [field]: value });
    // Effacer l'erreur du champ si l'utilisateur modifie
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  /**
   * NAVIGATE TO LOGIN
   * Si l'utilisateur a déjà un compte
   */
  const goToLogin = (): void => {
    navigation.navigate('Login');
  };

  return (
    <PaperProvider theme={MD3LightTheme}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        >
          {/* Header */}
          <View style={{ marginBottom: 30, marginTop: 20 }}>
            <Text variant="headlineLarge" style={{ fontWeight: 'bold' }}>
              Créer un compte
            </Text>
            <Text variant="bodyMedium" style={{ color: '#666', marginTop: 8 }}>
              Rejoignez notre communauté
            </Text>
          </View>

          {/* Error message serveur */}
          {serverError && (
            <View
              style={{
                backgroundColor: '#ffebee',
                padding: 12,
                borderRadius: 8,
                marginBottom: 20,
                borderLeftWidth: 4,
                borderLeftColor: '#f44336',
              }}
            >
              <Text style={{ color: '#c62828', fontSize: 14 }}>
                ⚠️ {serverError}
              </Text>
            </View>
          )}

          {/* Email */}
          <TextInput
            label="Email"
            mode="outlined"
            placeholder="exemple@email.com"
            value={form.email}
            onChangeText={(value: string) => handleChangeText('email', value)}
            editable={!loading}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!errors.email}
            style={{ marginBottom: 4 }}
          />
          {errors.email && (
            <Text style={{ color: '#f44336', fontSize: 12, marginBottom: 16 }}>
              {errors.email}
            </Text>
          )}

          {/* Nom */}
          <TextInput
            label="Nom"
            mode="outlined"
            placeholder="Votre nom"
            value={form.nom}
            onChangeText={(value: string) => handleChangeText('nom', value)}
            editable={!loading}
            error={!!errors.nom}
            style={{ marginBottom: 4 }}
          />
          {errors.nom && (
            <Text style={{ color: '#f44336', fontSize: 12, marginBottom: 16 }}>
              {errors.nom}
            </Text>
          )}

          {/* Prénom */}
          <TextInput
            label="Prénom"
            mode="outlined"
            placeholder="Votre prénom"
            value={form.prenom}
            onChangeText={(value: string) => handleChangeText('prenom', value)}
            editable={!loading}
            error={!!errors.prenom}
            style={{ marginBottom: 4 }}
          />
          {errors.prenom && (
            <Text style={{ color: '#f44336', fontSize: 12, marginBottom: 16 }}>
              {errors.prenom}
            </Text>
          )}

          {/* Mot de passe */}
          <TextInput
            label="Mot de passe"
            mode="outlined"
            placeholder="Min. 6 caractères"
            value={form.password}
            onChangeText={(value: string) => handleChangeText('password', value)}
            editable={!loading}
            secureTextEntry={!showPassword}
            error={!!errors.password}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={(): void => setShowPassword(!showPassword)}
              />
            }
            style={{ marginBottom: 4 }}
          />
          {errors.password && (
            <Text style={{ color: '#f44336', fontSize: 12, marginBottom: 16 }}>
              {errors.password}
            </Text>
          )}

          {/* Confirmation mot de passe */}
          <TextInput
            label="Confirmer le mot de passe"
            mode="outlined"
            placeholder="Répétez votre mot de passe"
            value={form.passwordConfirm}
            onChangeText={(value: string) =>
              handleChangeText('passwordConfirm', value)
            }
            editable={!loading}
            secureTextEntry={!showPasswordConfirm}
            error={!!errors.passwordConfirm}
            right={
              <TextInput.Icon
                icon={showPasswordConfirm ? 'eye-off' : 'eye'}
                onPress={(): void => setShowPasswordConfirm(!showPasswordConfirm)}
              />
            }
            style={{ marginBottom: 16 }}
          />
          {errors.passwordConfirm && (
            <Text style={{ color: '#f44336', fontSize: 12, marginBottom: 16 }}>
              {errors.passwordConfirm}
            </Text>
          )}

          {/* Bouton S&apos;inscrire */}
          <Button
            mode="contained"
            loading={loading}
            disabled={loading}
            onPress={handleRegister}
            style={{ paddingVertical: 6, marginBottom: 20 }}
          >
            S&apos;inscrire
          </Button>

          {/* Lien vers Login */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <Text variant="bodySmall">Vous avez déjà un compte? </Text>
            <Text
              variant="bodySmall"
              style={{ color: '#2196F3', fontWeight: 'bold' }}
              onPress={goToLogin}
            >
              Se connecter
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}
