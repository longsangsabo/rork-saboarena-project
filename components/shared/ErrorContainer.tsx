import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ErrorContainerProps {
  message?: string;
  buttonText?: string;
  onRetry?: () => void;
}

export const ErrorContainer: React.FC<ErrorContainerProps> = ({
  message = 'Không thể tải dữ liệu',
  buttonText = 'Thử lại',
  onRetry
}) => {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0A5C6D',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ErrorContainer;