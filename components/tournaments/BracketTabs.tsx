import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Trophy, Users, List } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface BracketTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BracketTabs({ activeTab, onTabChange }: BracketTabsProps) {
  const theme = useTheme();
  
  const tabs = [
    { 
      id: 'winner', 
      label: 'Nhánh thắng', 
      icon: Trophy,
      description: 'Winners bracket'
    },
    { 
      id: 'loser', 
      label: 'Nhánh thua', 
      icon: Users,
      description: 'Losers bracket'
    },
    { 
      id: 'semifinal', 
      label: 'Semi - Final', 
      icon: List,
      description: 'Semi Final & Final'
    }
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              isActive && [styles.activeTab, { backgroundColor: theme.colors.light.background }]
            ]}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <Icon 
              size={16} 
              color={isActive ? theme.colors.sabo.primary[600] : theme.colors.sabo.primary[400]} 
            />
            <Text style={[
              styles.tabText,
              { color: isActive ? theme.colors.sabo.primary[600] : theme.colors.sabo.primary[400] },
              isActive && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '600',
  },
});