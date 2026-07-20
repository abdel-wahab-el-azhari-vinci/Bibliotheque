#!/bin/bash

echo "🔍 AUDIT FINAL DES STYLES FRONTEND"
echo "==================================="
echo ""

files=$(grep -r "StyleSheet.create" src --include="*.tsx" --include="*.ts" -l | grep -v node_modules)

total=0
using_styles=0
still_hardcoded=0

for file in $files; do
  total=$((total + 1))
  has_styles=$(grep "from.*styles" "$file" 2>/dev/null | wc -l)
  has_hardcoded=$(grep -E "'#[0-9A-Fa-f]{3,6}'" "$file" 2>/dev/null | grep -v "shadowColor: '#000'" | wc -l)
  
  if [ $has_styles -gt 0 ] && [ $has_hardcoded -eq 0 ]; then
    using_styles=$((using_styles + 1))
    echo "✅ $file - PARFAIT (utilise styles/)"
  elif [ $has_styles -gt 0 ]; then
    still_hardcoded=$((still_hardcoded + 1))
    echo "⚠️  $file - Encore des colors: $(grep -E "'#[0-9A-Fa-f]{3,6}'" "$file" | grep -v "shadowColor: '#000'" | head -1)"
  else
    still_hardcoded=$((still_hardcoded + 1))
    echo "❌ $file - Pas d'import styles!"
  fi
done

echo ""
echo "=== RÉSUMÉ FINAL ==="
echo "Total fichiers: $total"
echo "✅ Utilisant styles/:   $using_styles"
echo "⚠️  Encore hardcoded:    $still_hardcoded"
