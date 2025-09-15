import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export interface AppError {
  id: string;
  type: 'network' | 'server' | 'auth' | 'validation' | 'unknown';
  message: string;
  details?: string;
  timestamp: Date;
  retryable: boolean;
  context?: Record<string, any>;
}

interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  delay: 1000,
  backoffMultiplier: 2,
};

export function useErrorHandler() {
  const [errors, setErrors] = useState<AppError[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [retryAttempts, setRetryAttempts] = useState<Map<string, number>>(new Map());

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return unsubscribe;
  }, []);

  // Create error object
  const createError = useCallback((
    type: AppError['type'],
    message: string,
    details?: string,
    context?: Record<string, any>
  ): AppError => {
    return {
      id: Date.now().toString() + Math.random().toString(36),
      type,
      message,
      details,
      timestamp: new Date(),
      retryable: type === 'network' || type === 'server',
      context,
    };
  }, []);

  // Add error to state
  const addError = useCallback((error: AppError) => {
    setErrors(prev => [error, ...prev.slice(0, 9)]); // Keep last 10 errors
  }, []);

  // Remove error
  const removeError = useCallback((errorId: string) => {
    setErrors(prev => prev.filter(e => e.id !== errorId));
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors([]);
    setRetryAttempts(new Map());
  }, []);

  // Handle different types of errors
  const handleError = useCallback((
    error: any,
    context?: Record<string, any>
  ): AppError => {
    let appError: AppError;

    if (error?.response) {
      // HTTP error responses
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 401:
          appError = createError('auth', 'Phiên đăng nhập đã hết hạn', 'Vui lòng đăng nhập lại', context);
          break;
        case 403:
          appError = createError('auth', 'Không có quyền truy cập', data?.message, context);
          break;
        case 404:
          appError = createError('server', 'Không tìm thấy dữ liệu', data?.message, context);
          break;
        case 422:
          appError = createError('validation', 'Dữ liệu không hợp lệ', data?.message, context);
          break;
        case 500:
          appError = createError('server', 'Lỗi máy chủ', 'Vui lòng thử lại sau', context);
          break;
        default:
          appError = createError('server', `Lỗi HTTP ${status}`, data?.message, context);
      }
    } else if (error?.code === 'NETWORK_ERROR' || !isOnline) {
      appError = createError('network', 'Không có kết nối mạng', 'Kiểm tra kết nối internet của bạn', context);
    } else if (error?.message) {
      appError = createError('unknown', error.message, error.stack, context);
    } else {
      appError = createError('unknown', 'Đã xảy ra lỗi không xác định', JSON.stringify(error), context);
    }

    addError(appError);
    return appError;
  }, [createError, addError, isOnline]);

  // Retry function with exponential backoff
  const retryWithBackoff = useCallback(async <T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {},
    errorContext?: Record<string, any>
  ): Promise<T> => {
    const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
    const operationId = `${Date.now()}-${Math.random()}`;
    
    for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
      try {
        const result = await operation();
        // Clear retry count on success
        setRetryAttempts(prev => {
          const newMap = new Map(prev);
          newMap.delete(operationId);
          return newMap;
        });
        return result;
      } catch (error) {
        setRetryAttempts(prev => new Map(prev).set(operationId, attempt));
        
        if (attempt === finalConfig.maxAttempts) {
          // Final attempt failed
          const appError = handleError(error, { 
            ...errorContext, 
            attempts: attempt,
            operationId 
          });
          throw appError;
        }

        // Wait before next attempt with exponential backoff
        const delay = finalConfig.delay * Math.pow(finalConfig.backoffMultiplier, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Retry logic error'); // Should never reach here
  }, [handleError]);

  // Show error alert with retry option
  const showErrorAlert = useCallback((
    error: AppError,
    onRetry?: () => void,
    onCancel?: () => void
  ) => {
    const buttons: any[] = [
      {
        text: 'Đóng',
        style: 'cancel',
        onPress: () => {
          removeError(error.id);
          onCancel?.();
        }
      }
    ];

    if (error.retryable && onRetry) {
      buttons.unshift({
        text: 'Thử lại',
        onPress: () => {
          removeError(error.id);
          onRetry();
        }
      });
    }

    Alert.alert(
      getErrorTitle(error.type),
      error.message + (error.details ? `\n\n${error.details}` : ''),
      buttons
    );
  }, [removeError]);

  // Get user-friendly error title
  const getErrorTitle = (type: AppError['type']): string => {
    switch (type) {
      case 'network':
        return 'Lỗi kết nối';
      case 'server':
        return 'Lỗi máy chủ';
      case 'auth':
        return 'Lỗi xác thực';
      case 'validation':
        return 'Dữ liệu không hợp lệ';
      default:
        return 'Đã xảy ra lỗi';
    }
  };

  // Wrapped operation with error handling
  const withErrorHandling = useCallback(<T>(
    operation: () => Promise<T>,
    options?: {
      showAlert?: boolean;
      enableRetry?: boolean;
      retryConfig?: Partial<RetryConfig>;
      context?: Record<string, any>;
      onError?: (error: AppError) => void;
    }
  ) => {
    return async (): Promise<T | null> => {
      const {
        showAlert = true,
        enableRetry = false,
        retryConfig,
        context,
        onError
      } = options || {};

      try {
        if (enableRetry) {
          return await retryWithBackoff(operation, retryConfig, context);
        } else {
          return await operation();
        }
      } catch (error) {
        const appError = error instanceof Error && 'type' in error 
          ? error as AppError 
          : handleError(error, context);

        onError?.(appError);

        if (showAlert) {
          showErrorAlert(appError, enableRetry ? () => withErrorHandling(operation, options)() : undefined);
        }

        return null;
      }
    };
  }, [handleError, showErrorAlert, retryWithBackoff]);

  return {
    // State
    errors,
    isOnline,
    hasErrors: errors.length > 0,
    
    // Actions
    handleError,
    addError,
    removeError,
    clearErrors,
    showErrorAlert,
    
    // Utilities
    retryWithBackoff,
    withErrorHandling,
    
    // Helpers
    getRetryAttempts: (operationId: string) => retryAttempts.get(operationId) || 0,
  };
}

// Error boundary context for React components
export function useErrorBoundary() {
  const { handleError, showErrorAlert } = useErrorHandler();

  const captureError = useCallback((error: Error, errorInfo?: any) => {
    const appError = handleError(error, { 
      errorInfo,
      boundary: true 
    });
    
    showErrorAlert(appError);
  }, [handleError, showErrorAlert]);

  return { captureError };
}

// Network-aware operation wrapper
export function useNetworkAwareOperation() {
  const { isOnline, withErrorHandling } = useErrorHandler();

  const executeWhenOnline = useCallback(<T>(
    operation: () => Promise<T>,
    fallback?: () => T | Promise<T>
  ) => {
    if (!isOnline && fallback) {
      return Promise.resolve(fallback());
    }

    return withErrorHandling(operation, {
      enableRetry: true,
      retryConfig: { maxAttempts: isOnline ? 3 : 1 },
      context: { networkStatus: isOnline ? 'online' : 'offline' }
    })();
  }, [isOnline, withErrorHandling]);

  return {
    isOnline,
    executeWhenOnline,
  };
}

// Specific error handling hooks for common scenarios
export function useTRPCErrorHandler() {
  const { withErrorHandling } = useErrorHandler();

  const handleTRPCQuery = useCallback(<T>(
    queryFn: () => Promise<T>,
    options?: { showAlert?: boolean; enableRetry?: boolean }
  ) => {
    return withErrorHandling(queryFn, {
      showAlert: options?.showAlert ?? true,
      enableRetry: options?.enableRetry ?? true,
      context: { source: 'trpc-query' }
    });
  }, [withErrorHandling]);

  const handleTRPCMutation = useCallback(<T>(
    mutationFn: () => Promise<T>,
    options?: { showAlert?: boolean }
  ) => {
    return withErrorHandling(mutationFn, {
      showAlert: options?.showAlert ?? true,
      enableRetry: false, // Mutations shouldn't auto-retry
      context: { source: 'trpc-mutation' }
    });
  }, [withErrorHandling]);

  return {
    handleTRPCQuery,
    handleTRPCMutation,
  };
}