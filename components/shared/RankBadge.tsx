import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Crown, Trophy } from 'lucide-react-native';

interface RankBadgeProps {
  rank: string;
  showIcon?: boolean;
  iconType?: 'crown' | 'trophy';
  style?: any;
}

export const RankBadge: React.FC<RankBadgeProps> = ({
  rank,
  showIcon = true,
  iconType = 'crown',
  style
}) => {
  const IconComponent = iconType === 'crown' ? Crown : Trophy;
  
  return (
    <View style={[styles.rankBadge, style]}>
      {showIcon && (
        <View style={styles.rankIcon}>
          <IconComponent size={14} color="#19127B" />
        </View>
      )}
      <Text style={styles.rankText}>RANK : {rank}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(35.89, 25.99, 91.95, 0.15)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1B1B50',
    paddingHorizontal: 25,
    paddingVertical: 7,
    gap: 8,
  },
  rankIcon: {
    width: 14,
    height: 14,
  },
  rankText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19127B',
    lineHeight: 20,
  },
});