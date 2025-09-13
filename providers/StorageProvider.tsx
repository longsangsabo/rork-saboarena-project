import { useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

interface StorageContextType {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

export const [StorageProvider, useStorage] = createContextHook<StorageContextType>(() => {
  const getItem = useCallback(async (key: string): Promise<string | null> => {
    if (!key?.trim()) {
      throw new Error('Storage key is required');
    }
    
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }, []);

  const setItem = useCallback(async (key: string, value: string): Promise<void> => {
    if (!key?.trim()) {
      throw new Error('Storage key is required');
    }
    
    if (typeof value !== 'string') {
      throw new Error('Storage value must be a string');
    }
    
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      throw error;
    }
  }, []);

  const removeItem = useCallback(async (key: string): Promise<void> => {
    if (!key?.trim()) {
      throw new Error('Storage key is required');
    }
    
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      throw error;
    }
  }, []);

  const clear = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }, []);

  return useMemo(() => ({
    getItem,
    setItem,
    removeItem,
    clear,
  }), [getItem, setItem, removeItem, clear]);
});