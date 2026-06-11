#!/bin/bash

echo "🎨 Auto-Migration des Styles En Dur"
echo "===================================="
echo ""

# Files avec styles en dur
FILES=(
  "src/features/admin/screens/AdminPenaltiesScreen.tsx"
  "src/features/admin/screens/BackupScreen.tsx"
  "src/features/admin/screens/DynamicFormScreen.tsx"
  "src/features/admin/screens/TableListScreen.tsx"
  "src/features/livres/components/PenaltyAlert.tsx"
  "src/features/livres/screens/PenaltiesListScreen.tsx"
  "src/features/shared/components/PenaltyBadge.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "🔄 Migration: $file"
    
    # Ajouter import si pas présent
    if ! grep -q "from.*styles" "$file"; then
      # Ajouter après le 1er import de react-native
      sed -i "0,/from 'react-native'/a import { colors, spacing, fontSizes, fontWeights, shadows } from '../../../styles';" "$file"
    fi
    
    # Remplacer les couleurs
    sed -i "s/'#f5f5f5'/colors.background/g" "$file"
    sed -i "s/'#F5F5F5'/colors.background/g" "$file"
    sed -i "s/'#F9F9F9'/colors.lightGray/g" "$file"
    sed -i "s/'#f9f9f9'/colors.lightGray/g" "$file"
    sed -i "s/'#007AFF'/colors.primary/g" "$file"
    sed -i "s/'#0066CC'/colors.primaryLight/g" "$file"
    sed -i "s/'#34C759'/colors.success/g" "$file"
    sed -i "s/'#51CF66'/colors.success/g" "$file"
    sed -i "s/'#FF6B6B'/colors.danger/g" "$file"
    sed -i "s/'#dc3545'/colors.danger/g" "$file"
    sed -i "s/'#E3F2FD'/colors.lightGray/g" "$file"
    sed -i "s/'#fff'/colors.white/g" "$file"
    sed -i "s/'#FFF'/colors.white/g" "$file"
    sed -i "s/'#666'/colors.gray/g" "$file"
    sed -i "s/'#666666'/colors.gray/g" "$file"
    sed -i "s/'#999'/colors.gray/g" "$file"
    sed -i "s/'#ffc107'/colors.warning/g" "$file"
    
    # Remplacer les spacings
    sed -i "s/padding: 4,/padding: spacing.xs,/g" "$file"
    sed -i "s/padding: 8,/padding: spacing.sm,/g" "$file"
    sed -i "s/padding: 12,/padding: spacing.md,/g" "$file"
    sed -i "s/padding: 15,/padding: spacing.lg,/g" "$file"
    sed -i "s/padding: 16,/padding: spacing.lg,/g" "$file"
    sed -i "s/padding: 20,/padding: spacing.xl,/g" "$file"
    sed -i "s/paddingVertical: 14,/paddingVertical: spacing.md,/g" "$file"
    sed -i "s/paddingVertical: 32,/paddingVertical: spacing.xxl,/g" "$file"
    sed -i "s/paddingHorizontal: 15,/paddingHorizontal: spacing.lg,/g" "$file"
    sed -i "s/paddingHorizontal: 20,/paddingHorizontal: spacing.lg,/g" "$file"
    sed -i "s/marginTop: 12,/marginTop: spacing.md,/g" "$file"
    sed -i "s/marginBottom: 12,/marginBottom: spacing.md,/g" "$file"
    sed -i "s/marginBottom: 16,/marginBottom: spacing.lg,/g" "$file"
    sed -i "s/marginBottom: 6,/marginBottom: spacing.xs,/g" "$file"
    sed -i "s/marginBottom: 8,/marginBottom: spacing.sm,/g" "$file"
    sed -i "s/marginBottom: 4,/marginBottom: spacing.xs,/g" "$file"
    sed -i "s/marginVertical: 12,/marginVertical: spacing.md,/g" "$file"
    sed -i "s/marginHorizontal: 12,/marginHorizontal: spacing.md,/g" "$file"
    sed -i "s/gap: 8,/gap: spacing.sm,/g" "$file"
    
    # Remplacer les fontSizes
    sed -i "s/fontSize: 14,/fontSize: fontSizes.base,/g" "$file"
    sed -i "s/fontSize: 16,/fontSize: fontSizes.lg,/g" "$file"
    sed -i "s/fontSize: 12,/fontSize: fontSizes.sm,/g" "$file"
    sed -i "s/fontSize: 20,/fontSize: fontSizes['2xl'],/g" "$file"
    sed -i "s/fontSize: 24,/fontSize: fontSizes['3xl'],/g" "$file"
    sed -i "s/fontSize: 18,/fontSize: fontSizes.xl,/g" "$file"
    
    # Remplacer les fontWeights
    sed -i "s/fontWeight: '600',/fontWeight: fontWeights.semibold,/g" "$file"
    sed -i "s/fontWeight: '700',/fontWeight: fontWeights.bold,/g" "$file"
    sed -i "s/fontWeight: 'bold',/fontWeight: fontWeights.bold,/g" "$file"
    
    # Remplacer les shadows
    sed -i "s/shadowColor: '#000',/shadowColor: '#000',/g" "$file"
    sed -i "s/shadowOffset: { width: 0, height: 2 },/shadowOffset: { width: 0, height: 2 },/g" "$file"
    sed -i "s/shadowOpacity: 0.1,/shadowOpacity: 0.1,/g" "$file"
    sed -i "s/shadowOpacity: 0.15,/shadowOpacity: 0.15,/g" "$file"
    
    echo "   ✅ Fait"
  fi
done

echo ""
echo "✅ Auto-Migration Complète!"
