import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Crown, Star, TrendingUp, Gamepad2, Users, Trophy, DollarSign } from 'lucide-react-native';

interface Stat {
  label: string;
  value: string | number;
  icon?: 'crown' | 'star' | 'trending' | 'gamepad' | 'users' | 'trophy' | 'dollar';
}

interface StatsRowProps {
  stats: Stat[];
  style?: any;
}

const getIcon = (iconType?: string) => {
  switch (iconType) {
    case 'crown': return Crown;
    case 'star': return Star;
    case 'trending': return TrendingUp;
    case 'gamepad': return Gamepad2;
    case 'users': return Users;
    case 'trophy': return Trophy;
    case 'dollar': return DollarSign;
    default: return null;
  }
};

export const StatsRow: React.FC<StatsRowProps> = ({ stats, style }) => {
  return (
    <View style={[styles.statsRow, style]}>
      {stats.map((stat, index) => {
        const IconComponent = getIcon(stat.icon);
        
        return (
          <View key={`${stat.label}-${index}`} style={styles.statItem}>
            {IconComponent && (
              <IconComponent size={16} color="#081122" />
            )}
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 28,
    gap: 35,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#081122',
    marginTop: 4,
    marginBottom: 2,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#455154',
    textAlign: 'center',
  },
});