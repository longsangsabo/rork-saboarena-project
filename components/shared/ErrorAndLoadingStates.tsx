import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AlertCircle, RefreshCw } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface ErrorStateProps {
  error?: any;
  onRetry?: () => void;
  message?: string;
  showRetry?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  onRetry, 
  message, 
  showRetry = true 
}) => {
  const theme = useTheme();
  
  const errorMessage = message || error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';

  return (
    <View style={[styles.container, { backgroundColor: theme.colorStyle('light.background') }]}>
      <View style={[styles.content, { backgroundColor: theme.colorStyle('light.card') }]}>
        <AlertCircle 
          size={48} 
          color={theme.colorStyle('light.textSecondary')} 
          style={styles.icon}
        />
        
        <Text style={[
          styles.title, 
          { color: theme.colorStyle('light.text') }
        ]}>
          Oops! Có lỗi xảy ra
        </Text>
        
        <Text style={[
          styles.message, 
          { color: theme.colorStyle('light.textSecondary') }
        ]}>
          {errorMessage}
        </Text>
        
        {showRetry && onRetry && (
          <TouchableOpacity 
            style={[
              styles.retryButton,
              { backgroundColor: theme.colorStyle('sabo.primary.500') }
            ]}
            onPress={onRetry}
          >
            <RefreshCw size={16} color="white" style={styles.retryIcon} />
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Đang tải...' 
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colorStyle('light.background') }]}>
      <View style={styles.loadingContent}>
        <View style={[
          styles.spinner,
          { borderColor: theme.colorStyle('light.border') }
        ]}>
          <View style={[
            styles.spinnerInner,
            { borderTopColor: theme.colorStyle('sabo.primary.500') }
          ]} />
        </View>
        
        <Text style={[
          styles.loadingText, 
          { color: theme.colorStyle('light.textSecondary') }
        ]}>
          {message}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    maxWidth: 300,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  retryIcon: {
    marginRight: 4,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  loadingContent: {
    alignItems: 'center',
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    marginBottom: 16,
  },
  spinnerInner: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  loadingText: {
    fontSize: 14,
    textAlign: 'center',
  },
});