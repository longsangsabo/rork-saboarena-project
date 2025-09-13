import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  style?: any;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Đang tải...',
  size = 'large',
  color = '#0A5C6D',
  style
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      <Text style={[styles.message, { color }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});