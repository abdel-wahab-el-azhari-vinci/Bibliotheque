const fs = require('fs');

// Corrections spéciales
const fixes = {
  'src/features/admin/screens/DynamicFormScreen.tsx': [
    [/trackColor={{ false: '#767577', true: '#81c784' }}/g, 
     `trackColor={{ false: colors.gray, true: colors.success }}`]
  ],
  'src/features/admin/screens/TableListScreen.tsx': [
    [/backgroundColor: '#FF3B30'/g, "backgroundColor: colors.danger"],
    [/import.*from 'react-native';/g, 
     `import { colors, spacing } from '../../../styles';\nimport { View, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator, FlatList, RefreshControl, Alert } from 'react-native';`]
  ],
  'src/features/livres/screens/LivreAddScreen.tsx': [
    [/backgroundColor: '#E3F2FD'/g, "backgroundColor: colors.lightGray"]
  ],
  'src/features/livres/screens/PenaltiesListScreen.tsx': [
    [/borderBottomColor: '#EEE'/g, "borderBottomColor: colors.border"]
  ]
};

Object.entries(fixes).forEach(([filePath, replacements]) => {
  if (fs.existsSync(filePath)) {
    console.log(`🔧 Correction: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    replacements.forEach(([pattern, replacement]) => {
      content = content.replace(pattern, replacement);
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`   ✅ Fixé`);
  }
});

console.log('\n✅ Corrections Finales Terminées!');
