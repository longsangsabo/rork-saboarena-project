/**
 * SABO Arena - Responsive Utilities
 * Centralized responsive breakpoints and sizing utilities
 */

import { Dimensions } from 'react-native';

// Get screen dimensions
export const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

// Responsive breakpoints based on common mobile screen sizes
export const breakpoints = {
  small: 375,   // iPhone SE, small Android phones
  medium: 414,  // iPhone Pro, most Android phones  
  large: 428,   // iPhone Pro Max, large Android phones
  tablet: 768,  // iPad Mini and tablets
};

// Screen size helpers
export const useResponsive = () => {
  const { width, height } = getScreenDimensions();
  
  return {
    width,
    height,
    isSmallScreen: width < breakpoints.small,
    isMediumScreen: width >= breakpoints.small && width < breakpoints.medium,
    isLargeScreen: width >= breakpoints.medium && width < breakpoints.tablet,
    isTablet: width >= breakpoints.tablet,
    isLandscape: width > height,
    isPortrait: height > width,
  };
};

// Responsive value selector
export const responsive = <T>(values: {
  small?: T;
  medium?: T;
  large?: T;
  tablet?: T;
  default: T;
}): T => {
  const { width } = getScreenDimensions();
  
  if (width >= breakpoints.tablet && values.tablet !== undefined) {
    return values.tablet;
  }
  if (width >= breakpoints.medium && values.large !== undefined) {
    return values.large;
  }
  if (width >= breakpoints.small && values.medium !== undefined) {
    return values.medium;
  }
  if (width < breakpoints.small && values.small !== undefined) {
    return values.small;
  }
  
  return values.default;
};

// Responsive spacing utility
export const responsiveSpacing = (base: number) => ({
  small: base * 0.75,   // 25% smaller on small screens
  medium: base,         // Base size on medium screens
  large: base * 1.1,    // 10% larger on large screens
  tablet: base * 1.25,  // 25% larger on tablets
});

// Responsive font size utility - returns actual size based on screen
export const responsiveFontSize = (base: number) => 
  responsive({
    small: Math.floor(base * 0.9),    // 10% smaller on small screens
    medium: base,                     // Base size on medium screens
    large: Math.floor(base * 1.05),   // 5% larger on large screens
    tablet: Math.floor(base * 1.15),  // 15% larger on tablets
    default: base,
  });

// Avatar size helper
export const getAvatarSize = (baseSize: number = 120) => 
  responsive({
    small: baseSize * 0.83,   // 100px for small screens
    medium: baseSize * 0.92,  // 110px for medium screens
    large: baseSize,          // 120px for large screens
    tablet: baseSize * 1.17,  // 140px for tablets
    default: baseSize,
  });

// Card padding helper
export const getCardPadding = () => 
  responsive({
    small: 12,
    medium: 14,
    large: 16,
    tablet: 20,
    default: 16,
  });

// Header padding helper
export const getHeaderPadding = () => 
  responsive({
    small: 12,
    medium: 14,
    large: 16,
    tablet: 20,
    default: 16,
  });