# Styles - Guide d'Organisation

Ce dossier centralise tous les styles et thèmes de l'application pour une meilleure maintenabilité et cohérence.

## Structure

```
styles/
├── colors.ts           # Palette de couleurs
├── typography.ts       # Tailles de police et poids
├── spacing.ts          # Valeurs d'espacement
├── shadows.ts          # Styles d'ombres et élévation
├── index.ts            # Point d'entrée central
└── README.md           # Ce fichier
```

## Modules

### 🎨 Colors (`colors.ts`)
Contient la palette de couleurs centralisée:
- Couleurs primaires et secondaires
- Couleurs de statut (succès, danger, avertissement, info)
- Couleurs neutres (blancs, gris, noirs)

**Usage:**
```typescript
import { colors } from '../styles';

const buttonStyle = {
  backgroundColor: colors.primary,
  borderColor: colors.border,
};
```

### 📝 Typography (`typography.ts`)
Définit les tailles de police et poids pour une typographie cohérente:
- `fontSizes`: 11px - 32px
- `fontWeights`: normal, medium, semibold, bold
- `typographyPresets`: Styles prédéfinis (h1, h2, body, etc.)

**Usage:**
```typescript
import { fontSizes, fontWeights, typographyPresets } from '../styles';

const textStyle = {
  fontSize: fontSizes.lg,
  fontWeight: fontWeights.bold,
};

// Ou utiliser les présets
const headingStyle = typographyPresets.h3;
```

### 📏 Spacing (`spacing.ts`)
Valeurs d'espacement standardisées (4px, 8px, 12px, 16px, 20px, 32px)

**Usage:**
```typescript
import { spacing } from '../styles';

const containerStyle = {
  paddingVertical: spacing.md,
  marginHorizontal: spacing.lg,
  gap: spacing.sm,
};
```

### ✨ Shadows (`shadows.ts`)
Styles d'ombres pour créer de la profondeur:
- `small`: Ombres subtiles
- `medium`: Ombres par défaut
- `large`: Ombres accentuées
- `extraLarge`: Ombres pour modales et overlays

**Usage:**
```typescript
import { shadows } from '../styles';

const cardStyle = {
  ...shadows.medium,
  backgroundColor: colors.white,
};
```

## Migration depuis `theme.ts`

Les anciennes imports:
```typescript
import { colors, spacing, fontSizes, fontWeights, commonStyles } from '../../../theme';
```

Doivent être remplacées par:
```typescript
import { colors, spacing, fontSizes, fontWeights, shadows } from '../styles';
```

## Avantages

✅ **Maintenabilité**: Chaque aspect du design est organisé dans son propre module  
✅ **Réutilisabilité**: Accès facile aux variables de style  
✅ **Cohérence**: Un seul point de vérité pour tous les styles  
✅ **Scalabilité**: Structure extensible pour de nouveaux thèmes ou variables  
✅ **Type Safety**: Support complet TypeScript avec types exportés  

## Conventions

- Utiliser les valeurs prédéfinies plutôt que des valeurs en dur
- Exploiter les constantes pour éviter la duplication
- Ajouter des commentaires en français pour les nouveaux styles
- Maintenir l'ordre logique (couleurs → typographie → espacement → ombres)
