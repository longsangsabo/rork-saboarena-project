import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Trophy } from 'lucide-react-native';

interface TournamentEmptyStateProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const TournamentEmptyState: React.FC<TournamentEmptyStateProps> = ({
  title = "Không có giải đấu nào",
  subtitle = "Hãy thử lọc khác hoặc quay lại sau",
  icon = <Trophy size={48} color="#666" />
}) => {
  return (
    <View style={styles.emptyContainer}>
      {icon}
      <Text style={styles.emptyText}>{title}</Text>
      <Text style={styles.emptySubtext}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});