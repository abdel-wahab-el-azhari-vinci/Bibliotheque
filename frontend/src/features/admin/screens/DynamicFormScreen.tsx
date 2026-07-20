import styles from '../../../styles/screens/admin/DynamicFormScreen.styles';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, TextInput, Switch, Modal, FlatList } from 'react-native';
import AdminService from '../services/adminService';

interface Column {
  COLUMN_NAME: string;
  COLUMN_TYPE: string;
  IS_NULLABLE: string;
  COLUMN_KEY: string;
  EXTRA: string;
}

interface ForeignKeyOption {
  id: number;
  label: string;
}

interface ForeignKeyInfo {
  columnName: string;
  referencedTable: string;
  labelColumn: string;
  options: ForeignKeyOption[];
}

interface DynamicFormScreenProps {
  tableName: string;
  adminService: AdminService;
  onBack: () => void;
}

/**
 * Formulaire dynamique pour insérer des données dans une table
 * Support des clés étrangères avec affichage de labels lisibles
 */
const DynamicFormScreen: React.FC<DynamicFormScreenProps> = ({
  tableName,
  adminService,
  onBack,
}) => {
  const [schema, setSchema] = useState<Column[]>([]);
  const [foreignKeys, setForeignKeys] = useState<Map<string, ForeignKeyInfo>>(new Map());
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [activePickerColumn, setActivePickerColumn] = useState<string | null>(null);

  useEffect(() => {
    loadSchema();
  }, []);

  const loadSchema = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger le schéma
      const schemaResponse = await adminService.getTableSchema(tableName);
      const columns = schemaResponse.schema || [];
      setSchema(columns);

      // Charger les infos des FKs
      const fkResponse = await adminService.getForeignKeyInfo(tableName);
      const fkArray = fkResponse.foreignKeys || [];
      
      const fkMap = new Map<string, ForeignKeyInfo>();
      fkArray.forEach((fk: ForeignKeyInfo) => {
        fkMap.set(fk.columnName, fk);
      });
      setForeignKeys(fkMap);

      // Initialiser le formData avec des valeurs vides
      const initialData: Record<string, any> = {};
      columns.forEach((col: Column) => {
        // Sauter les colonnes auto-générées
        if (col.EXTRA !== 'auto_increment' && col.COLUMN_KEY !== 'PRI') {
          initialData[col.COLUMN_NAME] = '';
        }
      });
      setFormData(initialData);
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
      const errors: string[] = [];

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

  const renderPickerOption = (fkInfo: ForeignKeyInfo) => {
    const selectedId = formData[fkInfo.columnName];
    const selectedOption = fkInfo.options.find(opt => opt.id === selectedId || String(opt.id) === String(selectedId));
    const displayText = selectedOption ? selectedOption.label : `Sélectionner ${fkInfo.referencedTable}`;

    return (
      <View key={fkInfo.columnName} style={styles.fieldContainer}>
        <Text style={styles.label}>
          {fkInfo.columnName}
          {/* Vérifier si la colonne est obligatoire */}
          {schema.find(col => col.COLUMN_NAME === fkInfo.columnName)?.IS_NULLABLE === 'NO' && (
            <Text style={styles.required}> *</Text>
          )}
        </Text>
        
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => {
            setActivePickerColumn(fkInfo.columnName);
            setPickerVisible(true);
          }}
        >
          <Text style={[styles.pickerButtonText, !selectedOption && { color: '#999' }]}>
            {displayText}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.columnType}>{fkInfo.referencedTable} (FK)</Text>
      </View>
    );
  };

  const renderTextField = (column: Column) => {
    const { COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE } = column;
    
    // Sauter si c'est une FK (elle sera rendue avec renderPickerOption)
    if (foreignKeys.has(COLUMN_NAME)) {
      return null;
    }

    const value = formData[COLUMN_NAME];
    const isRequired = IS_NULLABLE === 'NO';
    
    // Déterminer le type d'input basé sur le type de colonne
    const isNumberField = COLUMN_TYPE.includes('int') || COLUMN_TYPE.includes('decimal');
    const isBooleanField = COLUMN_TYPE.includes('tinyint(1)');

    if (isBooleanField) {
      return (
        <View key={COLUMN_NAME} style={styles.fieldContainer}>
          <Text style={styles.label}>
            {COLUMN_NAME}
            {isRequired && <Text style={styles.required}> *</Text>}
          </Text>
          
          <View style={styles.switchContainer}>
            <Switch
              value={!!value}
              onValueChange={(newValue) => handleInputChange(COLUMN_NAME, newValue ? 1 : 0)}
              trackColor={{ false: '#767577', true: '#81c784' }}
              thumbColor={value ? '#4caf50' : '#f4f3f4'}
            />
            <Text style={styles.switchLabel}>{value ? 'Oui' : 'Non'}</Text>
          </View>
          
          <Text style={styles.columnType}>{COLUMN_TYPE}</Text>
        </View>
      );
    }

    return (
      <View key={COLUMN_NAME} style={styles.fieldContainer}>
        <Text style={styles.label}>
          {COLUMN_NAME}
          {isRequired && <Text style={styles.required}> *</Text>}
        </Text>
        
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
        
        <Text style={styles.columnType}>{COLUMN_TYPE}</Text>
      </View>
    );
  };

  const getActivePickerInfo = (): ForeignKeyInfo | undefined => {
    return activePickerColumn ? foreignKeys.get(activePickerColumn) : undefined;
  };

  const handleSelectOption = (option: ForeignKeyOption) => {
    if (activePickerColumn) {
      handleInputChange(activePickerColumn, option.id);
      setPickerVisible(false);
      setActivePickerColumn(null);
    }
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

  const activePickerInfo = getActivePickerInfo();

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
        {/* Afficher les champs FK avec Picker */}
        {Array.from(foreignKeys.values()).map((fkInfo) => renderPickerOption(fkInfo))}
        
        {/* Afficher les autres champs */}
        {schema.map((column) => {
          // Ne pas afficher les colonnes auto-générées
          if (column.EXTRA === 'auto_increment' || column.COLUMN_KEY === 'PRI') {
            return null;
          }
          return renderTextField(column);
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

      {/* Modal pour le Picker */}
      <Modal
        visible={pickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setPickerVisible(false);
          setActivePickerColumn(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModalContent}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>
                Sélectionner {activePickerInfo?.referencedTable}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setPickerVisible(false);
                  setActivePickerColumn(null);
                }}
              >
                <Text style={styles.pickerModalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={activePickerInfo?.options || []}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pickerOption}
                  onPress={() => handleSelectOption(item)}
                >
                  <Text style={styles.pickerOptionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Aucune option disponible</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};


export default DynamicFormScreen;
