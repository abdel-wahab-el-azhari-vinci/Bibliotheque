// Colors
export const colors = {
  primary: '#004E89',      // Bleu foncé
  primaryLight: '#0066CC', // Bleu clair
  secondary: '#00A86B',    // Vert
  success: '#28a745',      // Vert success
  danger: '#dc3545',       // Rouge
  warning: '#ffc107',      // Orange
  info: '#17a2b8',         // Cyan
  dark: '#222222',         // Noir
  gray: '#666666',         // Gris
  lightGray: '#f5f5f5',    // Gris très clair
  white: '#ffffff',        // Blanc
  border: '#dddddd',       // Gris bordure
  background: '#f9f9f9',   // Gris background
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 32,
};

// Font Sizes
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
};

// Font Weights
export const fontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// Common styles
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
