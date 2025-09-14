// SABO Arena Color Palette
const saboColors = {
  // Primary Brand Colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main brand blue
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Secondary Colors
  secondary: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308', // Gold/Yellow accent
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },
  
  // Success/Win Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Error/Loss Colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Neutral Colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Background Colors (mapped to grays for light/dark themes)
  background: {
    50: '#ffffff',     // Pure white for light theme
    100: '#f9fafb',    // Near white
    200: '#f3f4f6',    // Very light gray
    300: '#e5e7eb',    // Light gray
    400: '#d1d5db',    // Medium light gray
    500: '#9ca3af',    // Medium gray
    600: '#6b7280',    // Medium dark gray
    700: '#374151',    // Dark gray
    800: '#1f2937',    // Very dark gray
    900: '#111827',    // Near black for dark theme
  },
  
  // Text Colors
  text: {
    50: '#f9fafb',     // Light text
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',    // Medium text
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',    // Dark text
    900: '#111827',    // Primary text
  },
  
  // Border Colors
  border: {
    subtle: '#f3f4f6',  // Very subtle border
    light: '#e5e7eb',   // Light border
    default: '#d1d5db', // Default border
    medium: '#9ca3af',  // Medium border
    strong: '#6b7280',  // Strong border
  },
  
  // Special Colors
  tournament: '#8b5cf6', // Purple for tournaments
  club: '#f59e0b', // Orange for clubs
  ranking: '#06b6d4', // Cyan for rankings
  spa: '#10b981', // Emerald for SPA points
};

const tintColorLight = saboColors.primary[500];
const tintColorDark = saboColors.primary[400];

export default {
  light: {
    text: saboColors.gray[900],
    background: saboColors.gray[50],
    tint: tintColorLight,
    tabIconDefault: saboColors.gray[400],
    tabIconSelected: tintColorLight,
    card: '#ffffff',
    border: saboColors.gray[200],
    placeholder: saboColors.gray[500],
  },
  dark: {
    text: saboColors.gray[100],
    background: saboColors.gray[900],
    tint: tintColorDark,
    tabIconDefault: saboColors.gray[500],
    tabIconSelected: tintColorDark,
    card: saboColors.gray[800],
    border: saboColors.gray[700],
    placeholder: saboColors.gray[400],
  },
  sabo: saboColors,
};
