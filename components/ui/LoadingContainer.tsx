import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

interface LoadingContainerProps {
  text?: string;
  size?: 'small' | 'large';
  color?: string;
}

export const LoadingContainer: React.FC<LoadingContainerProps> = ({
  text = 'Đang tải...',
  size = 'large',
  color = '#0A5C6D'
}) => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={size} color={color} />
      <Text style={styles.loadingText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default LoadingContainer;