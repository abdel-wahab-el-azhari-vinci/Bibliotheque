const fs = require('fs');
const path = require('path');

const files = [
  { src: 'src/features/admin/screens/AdminDashboard.tsx', stylePath: '../../../styles/screens/admin/AdminDashboard.styles' },
  { src: 'src/features/admin/screens/AdminPenaltiesScreen.tsx', stylePath: '../../../styles/screens/admin/AdminPenaltiesScreen.styles' },
  { src: 'src/features/admin/screens/BackupScreen.tsx', stylePath: '../../../styles/screens/admin/BackupScreen.styles' },
  { src: 'src/features/admin/screens/DynamicFormScreen.tsx', stylePath: '../../../styles/screens/admin/DynamicFormScreen.styles' },
  { src: 'src/features/admin/screens/TableListScreen.tsx', stylePath: '../../../styles/screens/admin/TableListScreen.styles' },
  { src: 'src/features/auth/screens/LoginScreen.tsx', stylePath: '../../../styles/screens/auth/LoginScreen.styles' },
  { src: 'src/features/auth/screens/RegisterScreen.tsx', stylePath: '../../../styles/screens/auth/RegisterScreen.styles' },
  { src: 'src/features/livres/screens/LivreAddScreen.tsx', stylePath: '../../../styles/screens/livres/LivreAddScreen.styles' },
  { src: 'src/features/livres/screens/LivreDetailScreen.tsx', stylePath: '../../../styles/screens/livres/LivreDetailScreen.styles' },
  { src: 'src/features/livres/screens/LivresListScreen.tsx', stylePath: '../../../styles/screens/livres/LivresListScreen.styles' },
  { src: 'src/features/livres/screens/LivresListScreen_FIXED.tsx', stylePath: '../../../styles/screens/livres/LivresListScreen_FIXED.styles' },
  { src: 'src/features/livres/screens/PenaltiesListScreen.tsx', stylePath: '../../../styles/screens/livres/PenaltiesListScreen.styles' },
  { src: 'src/features/livres/screens/PossessionListScreen.tsx', stylePath: '../../../styles/screens/livres/PossessionListScreen.styles' },
  { src: 'src/features/livres/components/CameraScanner.tsx', stylePath: '../../../styles/components/CameraScanner.styles' },
  { src: 'src/features/livres/components/PenaltyAlert.tsx', stylePath: '../../../styles/components/PenaltyAlert.styles' },
  { src: 'src/features/shared/components/PenaltyBadge.tsx', stylePath: '../../../styles/components/PenaltyBadge.styles' },
];

files.forEach(({ src, stylePath }) => {
  if (!fs.existsSync(src)) return;

  let content = fs.readFileSync(src, 'utf-8');
  
  // Supprimer les imports de styles mal placés
  content = content.replace(/import styles from '[^']+\.styles';?\n?/g, '');
  content = content.replace(/import styles from "[^"]+\.styles";\n?/g, '');

  // Supprimer StyleSheet de l'import react-native
  content = content.replace(/(import\s*{\s*)([^}]*StyleSheet[^}]*)(\s*}\s*from\s*'react-native';)/g, (match, prefix, imports, suffix) => {
    const importList = imports.split(',').map(i => i.trim()).filter(i => i && i !== 'StyleSheet');
    if (importList.length === 0) {
      return '';
    }
    return `${prefix}${importList.join(', ')}${suffix}`;
  });

  // Nettoyer les imports vides
  content = content.replace(/import\s*{\s*}\s*from\s*'react-native';?\n?/g, '');

  // Ajouter l'import styles au bon endroit (après le dernier import)
  const lines = content.split('\n');
  let lastImportIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ') && !lines[i].trim().startsWith('import styles')) {
      lastImportIndex = i;
    } else if (lastImportIndex >= 0 && !lines[i].trim().startsWith('import') && lines[i].trim() !== '' && !lines[i].trim().startsWith('type ') && !lines[i].trim().startsWith('interface ')) {
      break;
    }
  }

  if (lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, `import styles from '${stylePath}';`);
  } else {
    lines.unshift(`import styles from '${stylePath}';`);
  }

  content = lines.join('\n');

  // Nettoyer les lignes vides multiples
  content = content.replace(/\n\n\n+/g, '\n\n');

  fs.writeFileSync(src, content);
  console.log(`✅ Corrigé: ${src}`);
});

console.log('\n✨ Imports corrigés!');
