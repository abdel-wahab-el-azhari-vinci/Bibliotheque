/**
 * Typography Theme
 * Font sizes and font weights for consistent text styling
 */

export const fontSizes = {
  xs: 11,
  sm: 12,
  base: 14,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
  md: 14,
} as const;

export const fontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;

// Typography presets for common text styles
export const typographyPresets = {
  h1: {
    fontSize: fontSizes['5xl'],
    fontWeight: fontWeights.bold,
  },
  h2: {
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
  },
  h3: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.semibold,
  },
  h4: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.semibold,
  },
  h5: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
  },
  h6: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
  },
  body: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.normal,
  },
  bodySmall: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
  },
  button: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
  },
  buttonSmall: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
  },
  caption: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
  },
} as const;

export type FontSizeKey = keyof typeof fontSizes;
export type FontWeightKey = keyof typeof fontWeights;
