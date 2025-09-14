import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface ProfileTabsProps {
  activeTab: 'tournaments' | 'challenges';
  onTabChange: (tab: 'tournaments' | 'challenges') => void;
  style?: any;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  style 
}) => {
  const theme = useTheme();
  
  const tabs = [
    { key: 'tournaments' as const, label: 'Giải đấu' },
    { key: 'challenges' as const, label: 'Thách đấu' }
  ];
  
  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            activeTab === tab.key && [
              styles.activeTab,
              { borderBottomColor: theme.colors.sabo.primary[500] }
            ]
          ]}
          onPress={() => onTabChange(tab.key)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText,
            { color: theme.colors.sabo.gray[600] },
            activeTab === tab.key && [
              styles.activeTabText,
              { color: theme.colors.sabo.primary[500] }
            ]
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '600',
  },
});