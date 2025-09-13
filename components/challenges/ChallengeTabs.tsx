import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Users, Trophy, X } from 'lucide-react-native';

interface ChallengeTabsProps {
  activeTab: 'waiting' | 'live' | 'finished';
  onTabChange: (tab: 'waiting' | 'live' | 'finished') => void;
}

export default function ChallengeTabs({ activeTab, onTabChange }: ChallengeTabsProps) {
  const tabs = [
    { key: 'waiting' as const, label: 'Chờ đối', icon: Users },
    { key: 'live' as const, label: 'Lên xe', icon: Trophy },
    { key: 'finished' as const, label: 'Đã xong', icon: X },
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
              color={isActive ? '#333' : '#999'} 
            />
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.underline} />}
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  activeTab: {
    // Active tab styling handled by underline
  },
  tabText: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#333',
    fontWeight: '600',
  },
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