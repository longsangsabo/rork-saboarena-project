import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AlertCircle, RefreshCw, Home } from 'lucide-react-native';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to error reporting service
    this.props.onError?.(error, errorInfo);

    // In development, log to console
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  retry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.retry);
      }

      // Default fallback UI
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <AlertCircle size={64} color="#ef4444" />
            
            <Text style={styles.title}>
              Đã xảy ra lỗi
            </Text>
            
            <Text style={styles.message}>
              Ứng dụng gặp sự cố không mong muốn. Chúng tôi rất xin lỗi về điều này.
            </Text>

            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorTitle}>Chi tiết lỗi (Dev Mode):</Text>
                <Text style={styles.errorText}>
                  {this.state.error.message}
                </Text>
                {this.state.errorInfo?.componentStack && (
                  <Text style={styles.stackTrace}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}

            <View style={styles.actions}>
              <TouchableOpacity 
                style={[styles.button, styles.retryButton]} 
                onPress={this.retry}
              >
                <RefreshCw size={18} color="white" />
                <Text style={styles.buttonText}>
                  Thử lại
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.homeButton]}
                onPress={() => {
                  // Navigate to home - this would need router context
                  this.retry();
                }}
              >
                <Home size={18} color="#7B5CF6" />
                <Text style={[styles.buttonText, { color: '#7B5CF6' }]}>
                  Về trang chủ
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  errorDetails: {
    backgroundColor: '#fee2e2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991b1b',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  stackTrace: {
    fontSize: 10,
    color: '#7f1d1d',
    fontFamily: 'monospace',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minHeight: 48,
  },
  retryButton: {
    backgroundColor: '#7B5CF6',
  },
  homeButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#7B5CF6',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Specialized error boundaries for different app sections
export function APIErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={(error, retry) => (
        <View style={styles.container}>
          <View style={styles.content}>
            <AlertCircle size={48} color="#f59e0b" />
            <Text style={styles.title}>Lỗi kết nối API</Text>
            <Text style={styles.message}>
              Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.
            </Text>
            <TouchableOpacity 
              style={[styles.button, styles.retryButton]} 
              onPress={retry}
            >
              <RefreshCw size={18} color="white" />
              <Text style={styles.buttonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      onError={(error, errorInfo) => {
        // Log API errors specifically
        console.error('API Error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function UIErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={(error, retry) => (
        <View style={styles.container}>
          <View style={styles.content}>
            <AlertCircle size={48} color="#ef4444" />
            <Text style={styles.title}>Lỗi giao diện</Text>
            <Text style={styles.message}>
              Giao diện gặp sự cố. Thử tải lại để khắc phục.
            </Text>
            <TouchableOpacity 
              style={[styles.button, styles.retryButton]} 
              onPress={retry}
            >
              <RefreshCw size={18} color="white" />
              <Text style={styles.buttonText}>Tải lại</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      onError={(error, errorInfo) => {
        // Log UI errors specifically
        console.error('UI Error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}