/**
 * Spacing Theme
 * Consistent spacing values for padding, margins, and gaps
 */

export const spacing = {
  xs: 4,      // 4px   - Minimal spacing
  sm: 8,      // 8px   - Small spacing
  md: 12,     // 12px  - Medium spacing
  lg: 16,     // 16px  - Large spacing
  xl: 20,     // 20px  - Extra large spacing
  xxl: 32,    // 32px  - Double extra large spacing
} as const;

export type SpacingKey = keyof typeof spacing;
