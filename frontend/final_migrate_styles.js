const fs = require('fs');

const files = [
  'src/features/admin/screens/AdminPenaltiesScreen.tsx',
  'src/features/admin/screens/BackupScreen.tsx',
  'src/features/admin/screens/DynamicFormScreen.tsx',
  'src/features/admin/screens/TableListScreen.tsx',
  'src/features/livres/components/PenaltyAlert.tsx',
  'src/features/livres/screens/PenaltiesListScreen.tsx',
  'src/features/shared/components/PenaltyBadge.tsx',
];

const replacements = [
  // Colors
  [/#f5f5f5/gi, 'colors.background'],
  [/#F5F5F5/gi, 'colors.background'],
  [/#F9F9F9/gi, 'colors.lightGray'],
  [/#f9f9f9/gi, 'colors.lightGray'],
  [/#007AFF/g, 'colors.primary'],
  [/#0066CC/g, 'colors.primaryLight'],
  [/#34C759/g, 'colors.success'],
  [/#51CF66/g, 'colors.success'],
  [/#FF6B6B/g, 'colors.danger'],
  [/#FFD43B/gi, 'colors.warning'],
  [/#FF9500/gi, 'colors.warning'],
  [/#E3F2FD/g, 'colors.lightGray'],
  [/#fff/gi, 'colors.white'],
  [/#FFF/g, 'colors.white'],
  [/#333/g, 'colors.dark'],
  [/#666/gi, 'colors.gray'],
  [/#666666/gi, 'colors.gray'],
  [/#999/gi, 'colors.gray'],
  [/#ffc107/gi, 'colors.warning'],
  [/#A78BFA/g, 'colors.warning'],
  [/#dc3545/gi, 'colors.danger'],
  
  // Espacements (padding/margin)
  [/padding: 4,/g, 'padding: spacing.xs,'],
  [/padding: 8,/g, 'padding: spacing.sm,'],
  [/padding: 12,/g, 'padding: spacing.md,'],
  [/padding: 15,/g, 'padding: spacing.lg,'],
  [/padding: 16,/g, 'padding: spacing.lg,'],
  [/padding: 20,/g, 'padding: spacing.xl,'],
  [/paddingVertical: 14,/g, 'paddingVertical: spacing.md,'],
  [/paddingVertical: 32,/g, 'paddingVertical: spacing.xxl,'],
  [/paddingHorizontal: 15,/g, 'paddingHorizontal: spacing.lg,'],
  [/paddingHorizontal: 20,/g, 'paddingHorizontal: spacing.lg,'],
  [/marginTop: 12,/g, 'marginTop: spacing.md,'],
  [/marginBottom: 12,/g, 'marginBottom: spacing.md,'],
  [/marginBottom: 16,/g, 'marginBottom: spacing.lg,'],
  [/marginBottom: 6,/g, 'marginBottom: spacing.xs,'],
  [/marginBottom: 8,/g, 'marginBottom: spacing.sm,'],
  [/marginBottom: 4,/g, 'marginBottom: spacing.xs,'],
  [/marginVertical: 12,/g, 'marginVertical: spacing.md,'],
  [/marginHorizontal: 12,/g, 'marginHorizontal: spacing.md,'],
  [/gap: 8,/g, 'gap: spacing.sm,'],
  [/paddingTop: 20,/g, 'paddingTop: spacing.xl,'],
  [/paddingLeft: 15,/g, 'paddingLeft: spacing.lg,'],
  [/paddingRight: 15,/g, 'paddingRight: spacing.lg,'],
  [/borderRadius: 12,/g, 'borderRadius: 12,'],  // Keep as is
  
  // Font sizes
  [/fontSize: 14,/g, 'fontSize: fontSizes.base,'],
  [/fontSize: 16,/g, 'fontSize: fontSizes.lg,'],
  [/fontSize: 12,/g, 'fontSize: fontSizes.sm,'],
  [/fontSize: 20,/g, "fontSize: fontSizes['2xl'],"],
  [/fontSize: 24,/g, "fontSize: fontSizes['3xl'],"],
  [/fontSize: 18,/g, 'fontSize: fontSizes.xl,'],
  
  // Font weights
  [/fontWeight: '600',/g, 'fontWeight: fontWeights.semibold,'],
  [/fontWeight: '700',/g, 'fontWeight: fontWeights.bold,'],
  [/fontWeight: 'bold',/g, 'fontWeight: fontWeights.bold,'],
  [/fontWeight: 'semibold',/g, 'fontWeight: fontWeights.semibold,'],
];

files.forEach(filePath => {
  console.log(`🔄 Migration: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Appliquer les replacements
  replacements.forEach(([pattern, replacement]) => {
    content = content.replace(pattern, replacement);
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`   ✅ Fait`);
});

console.log('\n✅ Migration Finale Complétée!');
