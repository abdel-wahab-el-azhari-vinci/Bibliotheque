#!/bin/bash

echo "🔍 AUDIT MIGRATION STYLES
================================================"

echo ""
echo "1️⃣  Fichiers avec StyleSheet.create() restant:"
grep -r "const styles = StyleSheet.create" src/features --include="*.tsx" | grep -E "(screens|components)" | wc -l
if [[ $(grep -r "const styles = StyleSheet.create" src/features --include="*.tsx" | grep -E "(screens|components)" | wc -l) -eq 0 ]]; then
  echo "✅ PARFAIT - Aucun StyleSheet.create() dans les screens/components"
else
  echo "⚠️  PROBLÈME - Quelques StyleSheet.create() restent"
  grep -r "const styles = StyleSheet.create" src/features --include="*.tsx" | grep -E "(screens|components)"
fi

echo ""
echo "2️⃣  Fichiers avec StyleSheet importé (ne devrait pas être):"
grep -r "import.*StyleSheet" src/features --include="*.tsx" | grep -E "(screens|components)" | wc -l
if [[ $(grep -r "import.*StyleSheet" src/features --include="*.tsx" | grep -E "(screens|components)" | wc -l) -eq 0 ]]; then
  echo "✅ PARFAIT - Aucun import StyleSheet dans les screens/components"
else
  echo "⚠️  PROBLÈME - Quelques imports StyleSheet restent"
fi

echo ""
echo "3️⃣  Fichiers avec import styles depuis .styles.ts:"
grep -r "import styles from.*\.styles" src/features --include="*.tsx" | grep -E "(screens|components)" | wc -l
COUNT=$(grep -r "import styles from.*\.styles" src/features --include="*.tsx" | grep -E "(screens|components)" | wc -l)
if [[ $COUNT -ge 15 ]]; then
  echo "✅ PARFAIT - $COUNT fichiers utilisent les imports .styles.ts"
else
  echo "⚠️  PROBLÈME - Seulement $COUNT fichiers utilisent les imports"
fi

echo ""
echo "4️⃣  Fichiers .styles.ts créés:"
find src/styles -name "*.styles.ts" | wc -l

echo ""
echo "5️⃣  Fichiers .styles.ts avec import correct de styles/index:"
grep -r "from.*styles/index" src/styles --include="*.styles.ts" | wc -l

echo ""
echo "✨ AUDIT TERMINÉ"
