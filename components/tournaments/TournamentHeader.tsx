import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Trophy } from 'lucide-react-native';

interface TournamentHeaderProps {
  onRankingPress: () => void;
}

export const TournamentHeader: React.FC<TournamentHeaderProps> = ({
  onRankingPress
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Giải đấu</Text>
      <Text style={styles.subtitle}>Tham gia các giải đấu hấp dẫn</Text>
      <TouchableOpacity style={styles.rankingButton} onPress={onRankingPress}>
        <Trophy size={20} color="#0A5C6D" />
        <Text style={styles.rankingButtonText}>Bảng xếp hạng</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  rankingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f9ff',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  rankingButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A5C6D',
  },
});