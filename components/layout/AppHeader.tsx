import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell, Sun, MessageSquare, ArrowLeft, MoreHorizontal } from 'lucide-react-native';

interface AppHeaderProps {
  title?: string;
  showLogo?: boolean;
  showBackButton?: boolean;
  showMoreButton?: boolean;
  onBack?: () => void;
  onMore?: () => void;
  isDark?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showLogo = false,
  showBackButton = false,
  showMoreButton = false,
  onBack,
  onMore,
  isDark = false
}) => {
  const iconColor = isDark ? '#161722' : 'white';
  const textColor = isDark ? '#161722' : '#6503C8';
  
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {showBackButton ? (
          <TouchableOpacity style={styles.headerButton} onPress={onBack}>
            <ArrowLeft size={24} color={iconColor} />
          </TouchableOpacity>
        ) : showLogo ? (
          <Text style={[styles.logoText, { color: textColor }]}>SABO</Text>
        ) : (
          <Text style={[styles.titleText, { color: iconColor }]}>{title}</Text>
        )}
      </View>
      
      <View style={styles.headerRight}>
        {!showBackButton && !showMoreButton && (
          <>
            <TouchableOpacity style={styles.headerIcon}>
              <Sun size={20} color={iconColor} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <MessageSquare size={20} color={iconColor} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Bell size={20} color={iconColor} />
            </TouchableOpacity>
          </>
        )}
        {showMoreButton && (
          <TouchableOpacity style={styles.headerButton} onPress={onMore}>
            <MoreHorizontal size={24} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 8,
  },
  headerIcon: {
    padding: 4,
  },
  logoText: {
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: '900',
    lineHeight: 32,
    letterSpacing: 1.2,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '400',
    textAlign: 'center',
  },
});