#!/bin/bash
echo "=== AUDIT DES STYLES FRONTEND ==="
echo ""
echo "Fichiers avec StyleSheet.create:"
files=$(grep -r "StyleSheet.create" src --include="*.tsx" --include="*.ts" -l | grep -v node_modules)
total=0
with_styles=0
with_theme=0
with_nothing=0

for file in $files; do
  total=$((total + 1))
  imports=$(grep "from.*styles\|from.*theme" "$file" | wc -l)
  has_styles=$(grep "from.*styles" "$file" | wc -l)
  has_theme=$(grep "from.*theme" "$file" | wc -l)
  
  if [ $has_styles -gt 0 ]; then
    with_styles=$((with_styles + 1))
    echo "✅ $file - UTILISE styles"
  elif [ $has_theme -gt 0 ]; then
    with_theme=$((with_theme + 1))
    echo "⚠️  $file - UTILISE theme (ancien)"
  else
    with_nothing=$((with_nothing + 1))
    echo "❌ $file - NO IMPORT (styles en dur)"
  fi
done

echo ""
echo "=== RÉSUMÉ ==="
echo "Total fichiers: $total"
echo "✅ Utilisant styles/:  $with_styles"
echo "⚠️  Utilisant theme.ts: $with_theme"
echo "❌ Sans import:        $with_nothing"
