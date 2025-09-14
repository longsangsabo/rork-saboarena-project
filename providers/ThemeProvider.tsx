/**
 * SABO Arena - Theme Provider
 * Centralized design system access for all components
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { TextStyle } from 'react-native';
import colors from '@/constants/colors';
import { typography } from '@/lib/design-tokens/src/typography';
import { spacing } from '@/lib/design-tokens/src/spacing';

// Theme interface
interface Theme {
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
  // Helper functions for React Native
  fontStyle: (preset: keyof typeof typography) => TextStyle;
  colorStyle: (colorPath: string) => string;
  spacingStyle: (size: keyof typeof spacing) => number;
}

// Create theme object
const createTheme = (): Theme => ({
  colors,
  typography,
  spacing,
  
  // Convert typography preset to React Native style
  fontStyle: (preset) => {
    const style = typography[preset];
    // Map font weight strings to React Native acceptable values
    const fontWeightMap: Record<string, TextStyle['fontWeight']> = {
      '300': '300',
      '400': 'normal',
      '500': '500',
      '600': '600',
      '700': 'bold',
      '800': '800',
    };
    
    return {
      fontSize: parseInt(style.fontSize),
      fontWeight: fontWeightMap[style.fontWeight] || 'normal',
      lineHeight: parseInt(style.lineHeight),
    } as TextStyle;
  },
  
  // Get color from path (e.g., 'sabo.primary.500')
  colorStyle: (colorPath) => {
    const path = colorPath.split('.');
    let color: any = colors;
    
    for (const key of path) {
      color = color[key];
      if (!color) return '#000000'; // fallback
    }
    
    return color;
  },
  
  // Convert spacing token to number
  spacingStyle: (size) => {
    return parseInt(spacing[size].replace('px', ''));
  }
});

// Theme context
const ThemeContext = createContext<Theme | null>(null);

// Theme provider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = createTheme();
  
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = (): Theme => {
  const theme = useContext(ThemeContext);
  
  if (!theme) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  
  return theme;
};

// Convenience hooks for specific design tokens
export const useColors = () => useTheme().colors;
export const useTypography = () => useTheme().typography;
export const useSpacing = () => useTheme().spacing;

// Helper hooks with React Native ready values
export const useFontStyle = (preset: keyof typeof typography) => {
  const theme = useTheme();
  return theme.fontStyle(preset);
};

export const useColorStyle = (colorPath: string) => {
  const theme = useTheme();
  return theme.colorStyle(colorPath);
};

export const useSpacingStyle = (size: keyof typeof spacing) => {
  const theme = useTheme();
  return theme.spacingStyle(size);
};

export default ThemeProvider;