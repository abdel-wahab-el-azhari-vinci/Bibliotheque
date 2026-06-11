/**
 * Colors Theme
 * Centralized color palette for the entire application
 */

export const colors = {
  // Primary Colors
  primary: '#004E89',      // Bleu foncé - Couleur principale
  primaryLight: '#0066CC', // Bleu clair - Variante claire
  
  // Secondary Colors
  secondary: '#00A86B',    // Vert - Couleur secondaire
  
  // Status Colors
  success: '#28a745',      // Vert success
  danger: '#dc3545',       // Rouge - Erreurs et danger
  warning: '#ffc107',      // Orange - Avertissements
  info: '#17a2b8',         // Cyan - Informations
  
  // Neutral Colors
  dark: '#222222',         // Noir - Texte foncé
  gray: '#666666',         // Gris - Texte secondaire
  lightGray: '#f5f5f5',    // Gris très clair - Arrière-plans
  white: '#ffffff',        // Blanc - Arrière-plan principal
  border: '#dddddd',       // Gris bordure
  background: '#f9f9f9',   // Gris background
  
  // Light Variants (for backgrounds)
  lightSuccess: '#d4edda', // Vert très clair
  lightDanger: '#f8d7da',  // Rouge très clair
  
  // Text Colors
  text: '#222222',         // Texte foncé
} as const;

export type ColorKey = keyof typeof colors;
