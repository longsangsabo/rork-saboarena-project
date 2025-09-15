/**
 * SABO Arena - Typography Design Tokens
 * Consistent typography system for the app
 */

export const typography = {
  // Display styles
  display: {
    fontSize: '32px',
    fontWeight: '700',
    lineHeight: '40px',
  },
  
  // Heading styles
  h1: {
    fontSize: '28px',
    fontWeight: '700',
    lineHeight: '36px',
  },
  h2: {
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '32px',
  },
  h3: {
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '28px',
  },
  h4: {
    fontSize: '18px',
    fontWeight: '600',
    lineHeight: '24px',
  },
  h5: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '22px',
  },
  h6: {
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '20px',
  },
  
  // Body text styles
  body: {
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '24px',
  },
  bodyMedium: {
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '24px',
  },
  bodySmall: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
  },
  bodySmallMedium: {
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '20px',
  },
  
  // Caption and small text
  caption: {
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '16px',
  },
  captionMedium: {
    fontSize: '12px',
    fontWeight: '500',
    lineHeight: '16px',
  },
  
  // Button text
  button: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '20px',
  },
  buttonSmall: {
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '18px',
  },
  
  // Label text
  label: {
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '18px',
  },
  labelSmall: {
    fontSize: '12px',
    fontWeight: '500',
    lineHeight: '16px',
  },
} as const;

export type TypographyPreset = keyof typeof typography;

export default typography;