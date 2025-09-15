/**
 * SABO Arena - Spacing Design Tokens
 * Consistent spacing system for the app
 */

export const spacing = {
  // Base spacing units
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  '5xl': '48px',
  '6xl': '64px',
  
  // Component specific spacing
  buttonPadding: '12px',
  cardPadding: '16px',
  screenPadding: '20px',
  sectionGap: '24px',
  
  // Layout spacing
  headerHeight: '56px',
  tabBarHeight: '80px',
  bottomSafeArea: '34px',
} as const;

export type SpacingSize = keyof typeof spacing;

export default spacing;