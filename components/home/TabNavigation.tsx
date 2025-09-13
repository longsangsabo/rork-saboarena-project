import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface TabNavigationProps {
  activeTab: 'nearby' | 'following';
  onTabChange: (tab: 'nearby' | 'following') => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'nearby' && styles.activeTab]}
        onPress={() => onTabChange('nearby')}
      >
        <Text style={[styles.tabText, activeTab === 'nearby' && styles.activeTabText]}>
          Lân cận
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'following' && styles.activeTab]}
        onPress={() => onTabChange('following')}
      >
        <Text style={[styles.tabText, activeTab === 'following' && styles.activeTabText]}>
          Đã Follow
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  tabText: {
    color: '#D7D7D9',
    fontSize: 16,
    fontFamily: 'Lexend Exa',
    fontWeight: '700',
    opacity: 0.8,
  },
  activeTabText: {
    color: 'white',
    opacity: 1,
  },
});

export default TabNavigation;