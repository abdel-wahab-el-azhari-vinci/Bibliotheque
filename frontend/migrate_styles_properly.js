const fs = require('fs');
const path = require('path');

const files = [
  // Admin screens
  { src: 'src/features/admin/screens/AdminDashboard.tsx', dest: 'src/styles/screens/admin/AdminDashboard.styles.ts' },
  { src: 'src/features/admin/screens/AdminPenaltiesScreen.tsx', dest: 'src/styles/screens/admin/AdminPenaltiesScreen.styles.ts' },
  { src: 'src/features/admin/screens/BackupScreen.tsx', dest: 'src/styles/screens/admin/BackupScreen.styles.ts' },
  { src: 'src/features/admin/screens/DynamicFormScreen.tsx', dest: 'src/styles/screens/admin/DynamicFormScreen.styles.ts' },
  { src: 'src/features/admin/screens/TableListScreen.tsx', dest: 'src/styles/screens/admin/TableListScreen.styles.ts' },
  { src: 'src/features/auth/screens/LoginScreen.tsx', dest: 'src/styles/screens/auth/LoginScreen.styles.ts' },
  { src: 'src/features/auth/screens/RegisterScreen.tsx', dest: 'src/styles/screens/auth/RegisterScreen.styles.ts' },
  { src: 'src/features/livres/screens/LivreAddScreen.tsx', dest: 'src/styles/screens/livres/LivreAddScreen.styles.ts' },
  { src: 'src/features/livres/screens/LivreDetailScreen.tsx', dest: 'src/styles/screens/livres/LivreDetailScreen.styles.ts' },
  { src: 'src/features/livres/screens/LivresListScreen.tsx', dest: 'src/styles/screens/livres/LivresListScreen.styles.ts' },
  { src: 'src/features/livres/screens/LivresListScreen_FIXED.tsx', dest: 'src/styles/screens/livres/LivresListScreen_FIXED.styles.ts' },
  { src: 'src/features/livres/screens/PenaltiesListScreen.tsx', dest: 'src/styles/screens/livres/PenaltiesListScreen.styles.ts' },
  { src: 'src/features/livres/screens/PossessionListScreen.tsx', dest: 'src/styles/screens/livres/PossessionListScreen.styles.ts' },
  { src: 'src/features/livres/components/CameraScanner.tsx', dest: 'src/styles/components/CameraScanner.styles.ts' },
  { src: 'src/features/livres/components/PenaltyAlert.tsx', dest: 'src/styles/components/PenaltyAlert.styles.ts' },
  { src: 'src/features/shared/components/PenaltyBadge.tsx', dest: 'src/styles/components/PenaltyBadge.styles.ts' },
];

files.forEach(({ src, dest }) => {
  if (!fs.existsSync(src)) {
    console.log(`⏭️  ${src} n'existe pas`);
    return;
  }

  const content = fs.readFileSync(src, 'utf-8');
  
  // Extraire le StyleSheet.create
  const styleMatch = content.match(/const\s+styles\s*=\s*StyleSheet\.create\({[\s\S]*?\n\}\);/);
  if (!styleMatch) {
    console.log(`⏭️  ${src} - Pas de StyleSheet trouvé`);
    return;
  }

  const styleContent = `import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights, shadows } from '../../../styles';

${styleMatch[0]}

export default styles;
`;

  fs.writeFileSync(dest, styleContent);
  console.log(`✅ Créé: ${dest}`);

  // Mettre à jour le fichier source
  let updated = content;

  // Calcul du chemin d'import relatif
  const relativeImportPath = path.relative(path.dirname(src), `src/styles/${dest.replace('src/styles/', '').replace('.styles.ts', '')}`).replace(/\\/g, '/');

  // Ajouter l'import des styles juste avant le premier import utilisé
  const firstImportMatch = updated.match(/^import\s+/m);
  if (firstImportMatch) {
    const insertPos = updated.indexOf('import React');
    updated = updated.substring(0, insertPos) + 
              `import styles from '${relativeImportPath}.styles';\n` + 
              updated.substring(insertPos);
  }

  // Supprimer le StyleSheet.create original
  updated = updated.replace(/\n\nconst styles = StyleSheet\.create\({[\s\S]*?\n\}\);/, '');
  updated = updated.replace(/const styles = StyleSheet\.create\({[\s\S]*?\n\}\);\n/, '');

  // Supprimer StyleSheet de l'import react-native
  updated = updated.replace(/import\s*{\s*([^}]*)\s*}\s*from\s*['"]react-native['"];/g, (match, imports) => {
    const items = imports.split(',').map(i => i.trim()).filter(i => i && i !== 'StyleSheet');
    if (items.length === 0) return '';
    return `import { ${items.join(', ')} } from 'react-native';`;
  });

  // Nettoyer les imports vides
  updated = updated.replace(/\nimport\s*{\s*}\s*from\s*'react-native';\n/g, '\n');

  fs.writeFileSync(src, updated);
  console.log(`✅ Mis à jour: ${src}`);
});

console.log('\n✨ Migration terminée!');
