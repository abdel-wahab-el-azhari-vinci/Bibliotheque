#!/bin/bash

echo "🎨 Migration Complète des Styles Frontend"
echo "========================================="
echo ""

# Fichiers utilisant theme.ts
THEME_FILES=(
  "src/features/auth/screens/LoginScreen.tsx"
  "src/features/auth/screens/RegisterScreen.tsx"
  "src/features/livres/components/CameraScanner.tsx"
  "src/features/livres/screens/LivreAddScreen.tsx"
  "src/features/livres/screens/LivreDetailScreen.tsx"
  "src/features/livres/screens/LivresListScreen.tsx"
  "src/features/livres/screens/LivresListScreen_FIXED.tsx"
  "src/features/livres/screens/PossessionListScreen.tsx"
)

echo "Phase 1: Mise à jour des imports theme → styles"
echo "================================================"
for file in "${THEME_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✏️  Mise à jour: $file"
    # Remplacer l'import
    sed -i "s|from '\.\./\.\./\.\./theme'|from '../../styles'|g" "$file"
    sed -i "s|from '\.\./theme'|from '../../styles'|g" "$file"
    # Remplacer commonStyles.shadow
    sed -i "s|\.\.\.commonStyles\.shadow,|\.\.\. shadows\.medium,|g" "$file"
    sed -i "s|\.\.\.\s*commonStyles\.shadowLarge,|...shadows.extraLarge,|g" "$file"
    # Remplacer commonStyles dans l'import
    sed -i "s|commonStyles||g" "$file"
    echo "   ✅ Fait"
  fi
done

echo ""
echo "✅ Migration Complète!"
