const fs = require('fs');
const path = require('path');

const files = [
  // Admin screens
  { src: 'src/features/admin/screens/AdminDashboard.tsx', dest: 'src/styles/screens/admin/AdminDashboard.styles.ts', type: 'screen' },
  { src: 'src/features/admin/screens/AdminPenaltiesScreen.tsx', dest: 'src/styles/screens/admin/AdminPenaltiesScreen.styles.ts', type: 'screen' },
  { src: 'src/features/admin/screens/BackupScreen.tsx', dest: 'src/styles/screens/admin/BackupScreen.styles.ts', type: 'screen' },
  { src: 'src/features/admin/screens/DynamicFormScreen.tsx', dest: 'src/styles/screens/admin/DynamicFormScreen.styles.ts', type: 'screen' },
  { src: 'src/features/admin/screens/TableListScreen.tsx', dest: 'src/styles/screens/admin/TableListScreen.styles.ts', type: 'screen' },
  // Auth screens
  { src: 'src/features/auth/screens/LoginScreen.tsx', dest: 'src/styles/screens/auth/LoginScreen.styles.ts', type: 'screen' },
  { src: 'src/features/auth/screens/RegisterScreen.tsx', dest: 'src/styles/screens/auth/RegisterScreen.styles.ts', type: 'screen' },
  // Livres screens
  { src: 'src/features/livres/screens/LivreAddScreen.tsx', dest: 'src/styles/screens/livres/LivreAddScreen.styles.ts', type: 'screen' },
  { src: 'src/features/livres/screens/LivreDetailScreen.tsx', dest: 'src/styles/screens/livres/LivreDetailScreen.styles.ts', type: 'screen' },
  { src: 'src/features/livres/screens/LivresListScreen.tsx', dest: 'src/styles/screens/livres/LivresListScreen.styles.ts', type: 'screen' },
  { src: 'src/features/livres/screens/LivresListScreen_FIXED.tsx', dest: 'src/styles/screens/livres/LivresListScreen_FIXED.styles.ts', type: 'screen' },
  { src: 'src/features/livres/screens/LivresListScreen_WITH_ADMIN.tsx', dest: 'src/styles/screens/livres/LivresListScreen_WITH_ADMIN.styles.ts', type: 'screen' },
  { src: 'src/features/livres/screens/PenaltiesListScreen.tsx', dest: 'src/styles/screens/livres/PenaltiesListScreen.styles.ts', type: 'screen' },
  { src: 'src/features/livres/screens/PossessionListScreen.tsx', dest: 'src/styles/screens/livres/PossessionListScreen.styles.ts', type: 'screen' },
  // Components
  { src: 'src/features/livres/components/CameraScanner.tsx', dest: 'src/styles/components/CameraScanner.styles.ts', type: 'component' },
  { src: 'src/features/livres/components/PenaltyAlert.tsx', dest: 'src/styles/components/PenaltyAlert.styles.ts', type: 'component' },
  { src: 'src/features/shared/components/PenaltyBadge.tsx', dest: 'src/styles/components/PenaltyBadge.styles.ts', type: 'component' },
];

function extractStyleSheet(content) {
  const match = content.match(/const\s+styles\s*=\s*StyleSheet\.create\({[\s\S]*?\n\}\);/);
  return match ? match[0] : null;
}

function extractStyleSheetName(styleContent) {
  const match = styleContent.match(/StyleSheet\.create\(({[\s\S]*?\n})\);/);
  return match ? match[1] : null;
}

files.forEach(({ src, dest, type }) => {
  if (!fs.existsSync(src)) {
    console.log(`⏭️  ${src} n'existe pas, ignoré`);
    return;
  }

  const content = fs.readFileSync(src, 'utf-8');
  const styleSheet = extractStyleSheet(content);

  if (!styleSheet) {
    console.log(`⏭️  ${src} - Pas de StyleSheet.create trouvé`);
    return;
  }

  // Créer le contenu du fichier styles
  const getRelativePath = () => {
    if (type === 'screen') {
      const parts = dest.split('/');
      const depth = parts.length - 2; // -2 for styles/screens/...
      return '../../../styles';
    } else {
      const parts = dest.split('/');
      const depth = parts.length - 2;
      return '../../../styles';
    }
  };

  const relativePath = getRelativePath();
  const styleContent = `import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, fontWeights, shadows } from '${relativePath}';

${styleSheet}

export default styles;
`;

  // Créer le fichier style
  fs.writeFileSync(dest, styleContent);
  console.log(`✅ Créé: ${dest}`);

  // Mettre à jour le fichier source
  let updatedContent = content;
  
  // Ajouter l'import des styles
  const stylesImportPath = dest.replace('src/styles/', '').replace('.styles.ts', '');
  const relativeImportPath = path.relative(path.dirname(src), `src/styles/${stylesImportPath}`).replace(/\\/g, '/');
  
  // Trouver la meilleure position pour ajouter l'import
  const lines = updatedContent.split('\n');
  let lastImportIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) {
      lastImportIndex = i;
    } else if (!lines[i].startsWith('//') && lines[i].trim() !== '') {
      break;
    }
  }

  const stylesImport = `import styles from '${relativeImportPath}.styles';`;
  lines.splice(lastImportIndex + 1, 0, stylesImport);
  updatedContent = lines.join('\n');

  // Supprimer la définition locale de styles
  updatedContent = updatedContent.replace(/\n\nconst styles = StyleSheet\.create\({[\s\S]*?\n\}\);/, '');
  updatedContent = updatedContent.replace(/const styles = StyleSheet\.create\({[\s\S]*?\n\}\);\n/, '');

  // Retirer StyleSheet de l'import react-native s'il n'est plus utilisé
  if (!updatedContent.includes('StyleSheet')) {
    updatedContent = updatedContent.replace(/import\s*{\s*([^}]*StyleSheet[^}]*)\s*}\s*from\s*['"]react-native['"];/g, (match, imports) => {
      const importList = imports.split(',').map(i => i.trim()).filter(i => i !== 'StyleSheet');
      if (importList.length === 0) {
        return '';
      }
      return `import { ${importList.join(', ')} } from 'react-native';`;
    });
  }

  fs.writeFileSync(src, updatedContent);
  console.log(`✅ Mis à jour: ${src}`);
});

console.log('\n✨ Migration complétée!');
