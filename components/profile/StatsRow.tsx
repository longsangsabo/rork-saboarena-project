import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatItemProps {
  label: string;
  value: string | number;
}

interface StatsRowProps {
  stats: StatItemProps[];
}

export const StatsRow: React.FC<StatsRowProps> = ({ stats }) => {
  return (
    <View style={styles.statsContainer}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statItem}>
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#F8F9FA',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default StatsRow;