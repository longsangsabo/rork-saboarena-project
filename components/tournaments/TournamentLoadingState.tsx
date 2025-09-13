import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface TournamentLoadingStateProps {
  message?: string;
}

export const TournamentLoadingState: React.FC<TournamentLoadingStateProps> = ({
  message = "Đang tải giải đấu..."
}) => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0A5C6D" />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});