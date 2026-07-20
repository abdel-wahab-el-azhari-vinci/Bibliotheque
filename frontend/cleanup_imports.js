const fs = require('fs');
const path = require('path');

const files = [
  'src/features/admin/screens/AdminPenaltiesScreen.tsx',
  'src/features/admin/screens/BackupScreen.tsx',
  'src/features/admin/screens/DynamicFormScreen.tsx',
  'src/features/admin/screens/TableListScreen.tsx',
  'src/features/livres/components/PenaltyAlert.tsx',
  'src/features/livres/screens/PenaltiesListScreen.tsx',
  'src/features/shared/components/PenaltyBadge.tsx',
];

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Supprimer les imports dupliqués du styles
  const linesArray = content.split('\n');
  const seenStylesImport = false;
  const filteredLines = [];
  
  linesArray.forEach((line, index) => {
    // Garder seulement le 1er import du styles
    if (line.includes("import { colors, spacing, fontSizes, fontWeights, shadows } from '../../../styles'")) {
      if (!filteredLines.some(l => l.includes("from '../../../styles'"))) {
        filteredLines.push(line);
      }
    } else {
      filteredLines.push(line);
    }
  });
  
  content = filteredLines.join('\n');
  
  // Nettoyer les lignes vides excessives
  content = content.replace(/\n\n\n+/g, '\n\n');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Nettoyé: ${filePath}`);
});

console.log('\n✅ Cleanup complété!');
