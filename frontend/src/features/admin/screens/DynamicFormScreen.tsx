import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  TextInput,
  Switch,
} from 'react-native';
import AdminService from '../services/adminService';

interface Column {
  COLUMN_NAME: string;
  COLUMN_TYPE: string;
  IS_NULLABLE: string;
  COLUMN_KEY: string;
  EXTRA: string;
}

interface DynamicFormScreenProps {
  tableName: string;
  adminService: AdminService;
  onBack: () => void;
}

/**
 * Formulaire dynamique pour insérer des données dans une table
 */
const DynamicFormScreen: React.FC<DynamicFormScreenProps> = ({
  tableName,
  adminService,
  onBack,
}) => {
  const [schema, setSchema] = useState<Column[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSchema();
  }, []);

  const loadSchema = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getTableSchema(tableName);
      
      if (response.success) {
        const columns = response.schema || [];
        setSchema(columns);
        
        // Initialiser le formData avec des valeurs vides
        const initialData: Record<string, any> = {};
        columns.forEach((col: Column) => {
          // Sauter les colonnes auto-générées
          if (col.EXTRA !== 'auto_increment' && col.COLUMN_KEY !== 'PRI') {
            initialData[col.COLUMN_NAME] = '';
          }
        });
        setFormData(initialData);
      } else {
        setError('Erreur lors du chargement du schéma');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du schéma');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validation basique
      let hasErrors = false;
      const errors = [];

      schema.forEach((col: Column) => {
        if (col.IS_NULLABLE === 'NO' && !formData[col.COLUMN_NAME]) {
          errors.push(`${col.COLUMN_NAME} est obligatoire`);
          hasErrors = true;
        }
      });

      if (hasErrors) {
        Alert.alert('Erreur de validation', errors.join('\n'));
        return;
      }

      setSubmitting(true);
      const response = await adminService.insertIntoTable(tableName, formData);

      if (response.success) {
        Alert.alert(
          'Succès',
          'Données insérées avec succès!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Réinitialiser le formulaire
                const initialData: Record<string, any> = {};
                schema.forEach((col: Column) => {
                  if (col.EXTRA !== 'auto_increment' && col.COLUMN_KEY !== 'PRI') {
                    initialData[col.COLUMN_NAME] = '';
                  }
                });
                setFormData(initialData);
              },
            },
          ]
        );
      } else {
        Alert.alert('Erreur', response.error || 'Erreur lors de l\'insertion');
      }
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Erreur lors de l\'insertion');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (column: Column) => {
    const { COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE } = column;
    const value = formData[COLUMN_NAME];
    const isRequired = IS_NULLABLE === 'NO';
    
    // Déterminer le type d'input basé sur le type de colonne
    const isNumberField = COLUMN_TYPE.includes('int') || COLUMN_TYPE.includes('decimal');
    const isBooleanField = COLUMN_TYPE.includes('tinyint(1)');

    return (
      <View key={COLUMN_NAME} style={styles.fieldContainer}>
        <Text style={styles.label}>
          {COLUMN_NAME}
          {isRequired && <Text style={styles.required}> *</Text>}
        </Text>
        
        {isBooleanField ? (
          <View style={styles.switchContainer}>
            <Switch
              value={!!value}
              onValueChange={(newValue) => handleInputChange(COLUMN_NAME, newValue ? 1 : 0)}
              trackColor={{ false: '#767577', true: '#81c784' }}
              thumbColor={value ? '#4caf50' : '#f4f3f4'}
            />
            <Text style={styles.switchLabel}>{value ? 'Oui' : 'Non'}</Text>
          </View>
        ) : (
          <TextInput
            style={styles.input}
            placeholder={`Entrer ${COLUMN_NAME}`}
            placeholderTextColor="#999"
            value={String(value)}
            onChangeText={(text) => handleInputChange(COLUMN_NAME, text)}
            keyboardType={isNumberField ? 'decimal-pad' : 'default'}
            multiline={COLUMN_TYPE.includes('text')}
            numberOfLines={COLUMN_TYPE.includes('text') ? 4 : 1}
          />
        )}
        
        <Text style={styles.columnType}>{COLUMN_TYPE}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Chargement du formulaire...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Ajouter une entrée</Text>
        <Text style={styles.subtitle}>{tableName}</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView style={styles.formContainer} contentContainerStyle={{ paddingBottom: 20 }}>
        {schema.map((column) => {
          // Ne pas afficher les colonnes auto-générées
          if (column.EXTRA === 'auto_increment' || column.COLUMN_KEY === 'PRI') {
            return null;
          }
          return renderField(column);
        })}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onBack}
          disabled={submitting}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 15,
  },
  backButton: {
    paddingVertical: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  formContainer: {
    flex: 1,
    padding: 15,
  },
  fieldContainer: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  switchLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  columnType: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#4caf50',
  },
  submitButtonDisabled: {
    backgroundColor: '#80c34f',
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    marginHorizontal: 10,
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    fontSize: 14,
    color: '#c62828',
  },
});

export default DynamicFormScreen;
