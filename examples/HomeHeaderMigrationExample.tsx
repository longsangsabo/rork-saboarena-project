/**
 * EXAMPLE: HomeHeader Component Migration
 * Shows before/after design system implementation
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Sun, MessageSquare, Bell } from 'lucide-react-native';
import { useTheme, useFontStyle, useColorStyle, useSpacingStyle } from '@/providers/ThemeProvider';

interface HomeHeaderProps {
  onWeatherPress?: () => void;
  onMessagesPress?: () => void;
  onNotificationsPress?: () => void;
}

// ✅ AFTER: Using Design System
export const HomeHeaderNew: React.FC<HomeHeaderProps> = ({
  onWeatherPress,
  onMessagesPress,
  onNotificationsPress
}) => {
  const theme = useTheme();
  
  // Use design system tokens
  const titleStyle = useFontStyle('h3');
  const primaryColor = useColorStyle('sabo.primary.600');
  const headerPadding = useSpacingStyle(4); // 16px
  const iconGap = useSpacingStyle(4); // 16px
  
  return (
    <View style={[styles.header, { padding: headerPadding }]}>
      <View style={styles.headerLeft}>
        <Text style={[styles.saboTitle, titleStyle, { color: primaryColor }]}>
          SABO
        </Text>
      </View>
      <View style={[styles.headerRight, { gap: iconGap }]}>
        <TouchableOpacity style={styles.headerIcon} onPress={onWeatherPress}>
          <Sun size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon} onPress={onMessagesPress}>
          <MessageSquare size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon} onPress={onNotificationsPress}>
          <Bell size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ❌ BEFORE: Hardcoded values (original)
export const HomeHeaderOld: React.FC<HomeHeaderProps> = ({
  onWeatherPress,
  onMessagesPress,
  onNotificationsPress
}) => {
  return (
    <View style={stylesOld.header}>
      <View style={stylesOld.headerLeft}>
        <Text style={stylesOld.saboTitle}>SABO</Text>
      </View>
      <View style={stylesOld.headerRight}>
        <TouchableOpacity style={stylesOld.headerIcon} onPress={onWeatherPress}>
          <Sun size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={stylesOld.headerIcon} onPress={onMessagesPress}>
          <MessageSquare size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={stylesOld.headerIcon} onPress={onNotificationsPress}>
          <Bell size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ✅ NEW: Clean, semantic styles
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  saboTitle: {
    // Typography and color applied via hooks
    letterSpacing: 1.2,
  },
  headerRight: {
    flexDirection: 'row',
    // Gap applied via hooks
  },
  headerIcon: {
    padding: 4,
  },
});

// ❌ OLD: Hardcoded chaos
const stylesOld = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20, // ❌ Hardcoded
    paddingVertical: 10,   // ❌ Hardcoded
  },
  headerLeft: {
    flex: 1,
  },
  saboTitle: {
    color: '#6503C8',      // ❌ Hardcoded color
    fontSize: 24,          // ❌ Hardcoded font size
    fontFamily: 'Inter',   // ❌ Hardcoded font family
    fontWeight: '900',     // ❌ Hardcoded font weight
    lineHeight: 32,        // ❌ Hardcoded line height
    letterSpacing: 1.2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,               // ❌ Hardcoded spacing
  },
  headerIcon: {
    padding: 4,            // ❌ Hardcoded padding
  },
});

/**
 * MIGRATION BENEFITS:
 * 
 * ✅ Consistency: Uses design system tokens
 * ✅ Maintainability: Single source of truth for styles
 * ✅ Flexibility: Easy theme switching
 * ✅ Type Safety: TypeScript ensures correct token usage
 * ✅ Performance: Optimized style calculations
 * 
 * MIGRATION EFFORT:
 * - Replace hardcoded values with design system hooks
 * - Update StyleSheet to use dynamic values
 * - Test visual consistency
 * - Estimated time: 15 minutes per component
 */