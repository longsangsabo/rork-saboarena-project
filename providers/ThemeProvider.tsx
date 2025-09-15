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
    try {
      const style = typography[preset];
      
      // Handle case where style is undefined
      if (!style) {
        console.warn(`Typography preset '${preset}' not found, using body as fallback`);
        const fallbackStyle = typography.body;
        return {
          fontSize: parseInt(fallbackStyle.fontSize.replace('px', '')),
          fontWeight: 'normal' as TextStyle['fontWeight'],
          lineHeight: parseInt(fallbackStyle.lineHeight.replace('px', '')),
        };
      }
      
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
        fontSize: style.fontSize ? parseInt(style.fontSize.replace('px', '')) : 16,
        fontWeight: fontWeightMap[style.fontWeight] || 'normal',
        lineHeight: style.lineHeight ? parseInt(style.lineHeight.replace('px', '')) : 24,
      };
    } catch (error) {
      console.error('Error in fontStyle:', error);
      return {
        fontSize: 16,
        fontWeight: 'normal' as TextStyle['fontWeight'],
        lineHeight: 24,
      };
    }
  },
  
  // Get color from path (e.g., 'sabo.primary.500')
  colorStyle: (colorPath) => {
    if (!colorPath || typeof colorPath !== 'string') {
      console.warn(`Invalid color path '${colorPath}', using fallback`);
      return '#000000';
    }
    
    const path = colorPath.split('.');
    let color: any = colors;
    
    for (const key of path) {
      if (color && typeof color === 'object' && key in color) {
        color = color[key];
      } else {
        console.warn(`Color path '${colorPath}' not found, using fallback`);
        return '#000000'; // fallback
      }
    }
    
    return typeof color === 'string' ? color : '#000000';
  },
  
  // Convert spacing token to number
  spacingStyle: (size) => {
    const value = spacing[size];
    if (!value) {
      console.warn(`Spacing size '${size}' not found, using fallback`);
      return 16; // fallback
    }
    return parseInt(value.replace('px', ''));
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