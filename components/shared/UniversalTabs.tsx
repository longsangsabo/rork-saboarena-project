import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface TabItem {
  key: string;
  label: string;
  badge?: number;
  disabled?: boolean;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
}

interface UniversalTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  scrollable?: boolean;
  style?: any;
}

const UniversalTabs = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  scrollable = false,
  style
}: UniversalTabsProps) => {
  const getTabStyles = (isActive: boolean, disabled?: boolean) => {
    let combinedStyles = { ...styles.tab };
    
    if (disabled) {
      combinedStyles = { ...combinedStyles, ...styles.tabDisabled };
      return combinedStyles;
    }

    switch (variant) {
      case 'pills':
        combinedStyles = { ...combinedStyles, ...styles.tabPill };
        if (isActive) combinedStyles = { ...combinedStyles, ...styles.tabPillActive };
        break;
      case 'underline':
        combinedStyles = { ...combinedStyles, ...styles.tabUnderline };
        if (isActive) combinedStyles = { ...combinedStyles, ...styles.tabUnderlineActive };
        break;
      default:
        combinedStyles = { ...combinedStyles, ...styles.tabDefault };
        if (isActive) combinedStyles = { ...combinedStyles, ...styles.tabDefaultActive };
    }
    
    return combinedStyles;
  };

  const getTabTextStyles = (isActive: boolean, disabled?: boolean) => {
    let combinedStyles = { ...styles.tabText };
    
    if (disabled) {
      combinedStyles = { ...combinedStyles, ...styles.tabTextDisabled };
      return combinedStyles;
    }

    switch (variant) {
      case 'pills':
        if (isActive) combinedStyles = { ...combinedStyles, ...styles.tabTextPillActive };
        break;
      case 'underline':
        if (isActive) combinedStyles = { ...combinedStyles, ...styles.tabTextUnderlineActive };
        break;
      default:
        if (isActive) combinedStyles = { ...combinedStyles, ...styles.tabTextDefaultActive };
    }
    
    return combinedStyles;
  };

  const renderTab = (tab: TabItem) => {
    const isActive = activeTab === tab.key;
    const Icon = tab.icon;
    
    return (
      <TouchableOpacity
        key={tab.key}
        style={getTabStyles(isActive, tab.disabled)}
        onPress={() => !tab.disabled && onTabChange(tab.key)}
        disabled={tab.disabled}
      >
        {Icon && (
          <Icon 
            size={20} 
            color={isActive ? (variant === 'underline' ? '#333' : '#4A90E2') : '#999'} 
          />
        )}
        <Text style={getTabTextStyles(isActive, tab.disabled)}>
          {tab.label}
        </Text>
        {tab.badge && tab.badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {tab.badge > 99 ? '99+' : tab.badge.toString()}
            </Text>
          </View>
        )}
        {isActive && variant === 'underline' && <View style={styles.underline} />}
      </TouchableOpacity>
    );
  };

  const TabContainer = scrollable ? ScrollView : View;
  const containerProps = scrollable 
    ? { horizontal: true, showsHorizontalScrollIndicator: false }
    : {};

  return (
    <TabContainer 
      style={[styles.container, style]} 
      contentContainerStyle={scrollable ? styles.scrollContent : undefined}
      {...containerProps}
    >
      {tabs.map(renderTab)}
    </TabContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  tabDisabled: {
    opacity: 0.5,
  },
  
  // Default variant
  tabDefault: {
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabDefaultActive: {
    borderBottomColor: '#0A5C6D',
  },
  
  // Pills variant
  tabPill: {
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
  },
  tabPillActive: {
    backgroundColor: '#0A5C6D',
    borderColor: '#0A5C6D',
  },
  
  // Underline variant
  tabUnderline: {
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    flex: 1,
  },
  tabUnderlineActive: {
    borderBottomColor: '#0A5C6D',
  },
  
  // Text styles
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabTextDisabled: {
    color: '#CCC',
  },
  tabTextDefaultActive: {
    color: '#0A5C6D',
  },
  tabTextPillActive: {
    color: '#fff',
  },
  tabTextUnderlineActive: {
    color: '#0A5C6D',
  },
  
  // Badge styles
  badge: {
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Underline for 'underline' variant
  underline: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 2,
    backgroundColor: '#333',
    borderRadius: 1,
  },
});

export { UniversalTabs };
export default UniversalTabs;