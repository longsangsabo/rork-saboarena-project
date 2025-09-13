import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Bell, 
  Sun, 
  MessageSquare 
} from 'lucide-react-native';

export interface UniversalHeaderProps {
  title?: string;
  showLogo?: boolean;
  showBackButton?: boolean;
  showMoreButton?: boolean;
  showNotifications?: boolean;
  onBack?: () => void;
  onMore?: () => void;
  onNotification?: () => void;
  variant?: 'default' | 'transparent' | 'dark';
  children?: React.ReactNode;
}

export const UniversalHeader: React.FC<UniversalHeaderProps> = ({
  title,
  showLogo = false,
  showBackButton = false,
  showMoreButton = false,
  showNotifications = false,
  onBack,
  onMore,
  onNotification,
  variant = 'default',
  children
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'transparent':
        return {
          backgroundColor: 'transparent',
          borderBottomWidth: 0,
          iconColor: '#161722',
          textColor: '#161722'
        };
      case 'dark':
        return {
          backgroundColor: '#161722',
          borderBottomColor: '#333',
          iconColor: '#fff',
          textColor: '#fff'
        };
      default:
        return {
          backgroundColor: '#fff',
          borderBottomColor: '#E0E0E0',
          iconColor: '#333',
          textColor: '#333'
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <View style={[
      styles.header, 
      { 
        backgroundColor: variantStyles.backgroundColor,
        borderBottomColor: variantStyles.borderBottomColor,
        borderBottomWidth: variant === 'transparent' ? 0 : 1
      }
    ]}>
      <View style={styles.leftSection}>
        {showBackButton && onBack && (
          <TouchableOpacity style={styles.actionButton} onPress={onBack}>
            <ArrowLeft size={24} color={variantStyles.iconColor} />
          </TouchableOpacity>
        )}
        
        {showLogo && (
          <Text style={[styles.logoText, { color: '#6503C8' }]}>SABO</Text>
        )}
        
        {title && !showLogo && (
          <Text style={[styles.titleText, { color: variantStyles.textColor }]}>
            {title}
          </Text>
        )}
      </View>

      {children && (
        <View style={styles.centerSection}>
          {children}
        </View>
      )}

      <View style={styles.rightSection}>
        {showNotifications && (
          <>
            <TouchableOpacity style={styles.iconButton} onPress={onNotification}>
              <Sun size={20} color={variantStyles.iconColor} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={onNotification}>
              <MessageSquare size={20} color={variantStyles.iconColor} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={onNotification}>
              <Bell size={20} color={variantStyles.iconColor} />
            </TouchableOpacity>
          </>
        )}
        
        {showMoreButton && onMore && (
          <TouchableOpacity style={styles.actionButton} onPress={onMore}>
            <MoreHorizontal size={24} color={variantStyles.iconColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    marginRight: 8,
  },
  iconButton: {
    padding: 6,
  },
  logoText: {
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: '900',
    lineHeight: 32,
    letterSpacing: 1.2,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default UniversalHeader;