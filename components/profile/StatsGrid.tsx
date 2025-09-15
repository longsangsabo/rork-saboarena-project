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
  isSmallScreen?: boolean;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, style, isSmallScreen = false }) => {
  const theme = useTheme();
  
  // For small screens, consider 2x2 layout if too cramped
  const containerStyle = isSmallScreen ? {
    paddingVertical: 12,
    paddingHorizontal: 16,
  } : {
    paddingVertical: 16,
    paddingHorizontal: 20,
  };
  
  return (
    <View style={[styles.container, containerStyle, style]}>
      {stats.map((stat, index) => (
        <View key={index} style={[
          styles.statItem,
          isSmallScreen && { minWidth: 60 } // Ensure minimum width on small screens
        ]}>
          <Text style={[
            styles.statValue,
            { 
              color: stat.color || theme.colors.light.text,
              fontSize: isSmallScreen ? 16 : 18,
              lineHeight: isSmallScreen ? 20 : 22,
            }
          ]}>
            {stat.value}
          </Text>
          <Text style={[
            styles.statLabel,
            { 
              color: theme.colors.sabo.gray[500],
              fontSize: isSmallScreen ? 10 : 12,
              lineHeight: isSmallScreen ? 12 : 14,
            }
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
    // Dynamic padding applied via props
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