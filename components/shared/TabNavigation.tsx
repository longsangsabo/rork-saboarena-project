import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface Tab {
  key: string;
  label: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDark?: boolean;
  scrollable?: boolean;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  isDark = false,
  scrollable = false
}) => {
  const activeColor = isDark ? '#0A5C6D' : 'white';
  const inactiveColor = isDark ? '#D7D7D9' : '#CCCCCE';
  
  const TabContent = (
    <View style={[styles.tabContainer, isDark && styles.darkTabContainer]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => onTabChange(tab.key)}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === tab.key ? activeColor : inactiveColor },
              activeTab === tab.key && styles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
          {activeTab === tab.key && (
            <View style={[styles.activeIndicator, { backgroundColor: activeColor }]} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
  
  if (scrollable) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={[styles.tabContainer, isDark && styles.darkTabContainer]}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => onTabChange(tab.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === tab.key ? activeColor : inactiveColor },
                  activeTab === tab.key && styles.activeTabText,
                ]}
              >
                {tab.label}
              </Text>
              {activeTab === tab.key && (
                <View style={[styles.activeIndicator, { backgroundColor: activeColor }]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }
  
  return TabContent;
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  darkTabContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 0.33,
    borderBottomColor: '#D0D1D3',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    position: 'relative',
  },
  activeTab: {
    // Active tab styling handled by indicator
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Lexend Exa',
    fontWeight: '400',
  },
  activeTabText: {
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -10,
    left: 20,
    right: 20,
    height: 2,
  },
});