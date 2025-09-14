import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface StatItem {
  label: string;
  value: string | number;
  color?: string;
}

interface StatsGridProps {
  stats: StatItem[];
  style?: any;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, style }) => {
  const theme = useTheme();
  
  return (
    <View style={[styles.container, style]}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statItem}>
          <Text style={[
            styles.statValue,
            { 
              color: stat.color || theme.colors.light.text,
            }
          ]}>
            {stat.value}
          </Text>
          <Text style={[
            styles.statLabel,
            { color: theme.colors.sabo.gray[500] }
          ]}>
            {stat.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
});