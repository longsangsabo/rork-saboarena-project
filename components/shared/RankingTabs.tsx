import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Users, Trophy, BarChart3 } from 'lucide-react-native';

export type RankingType = 'prizepool' | 'elo' | 'spa';

interface RankingTabsProps {
  activeTab: RankingType;
  onTabChange: (tab: RankingType) => void;
}

export const RankingTabs: React.FC<RankingTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      key: 'prizepool' as RankingType,
      label: 'Prize Pool',
      icon: Users,
    },
    {
      key: 'elo' as RankingType,
      label: 'ELO',
      icon: Trophy,
    },
    {
      key: 'spa' as RankingType,
      label: 'SPA',
      icon: BarChart3,
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;
        
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onTabChange(tab.key)}
          >
            <Icon 
              size={20} 
              color={isActive ? '#4A90E2' : '#999'} 
            />
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#F0F7FF',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#999',
  },
  activeTabText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
});