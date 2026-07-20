/**
 * Styles Index
 * Central export point for all theme and style definitions
 */

// Import and re-export all theme modules
export { colors } from './colors';
export type { ColorKey } from './colors';

export { fontSizes, fontWeights, typographyPresets } from './typography';
export type { FontSizeKey, FontWeightKey } from './typography';

export { spacing } from './spacing';
export type { SpacingKey } from './spacing';

export { shadows } from './shadows';
export type { ShadowKey } from './shadows';

// Legacy exports for backward compatibility
export const commonStyles = {
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shadowLarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};
