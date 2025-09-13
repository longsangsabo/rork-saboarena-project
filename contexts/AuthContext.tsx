import { useState, useEffect, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { useStorage } from '../providers/StorageProvider';

interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  elo: number;
  spaPoints: number;
  rank: string;
  rankPosition: number;
  stats: {
    matches: number;
    wins: number;
    losses: number;
    winRate: number;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const STORAGE_KEY = '@sabo_user';

export const [AuthProvider, useAuth] = createContextHook<AuthContextType>(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { getItem, setItem, removeItem } = useStorage();

  const loadUserFromStorage = useCallback(async () => {
    try {
      const storedUser = await getItem(STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getItem]);

  // Load user from storage on app start
  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const saveUserToStorage = useCallback(async (userData: User) => {
    if (!userData?.id?.trim()) {
      console.error('Invalid user data');
      return;
    }
    
    try {
      await setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }, [setItem]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!email?.trim() || !password?.trim()) {
      throw new Error('Email and password are required');
    }
    
    setIsLoading(true);
    try {
      // Mock authentication - replace with real API call
      const mockUser: User = {
        id: '1',
        email: email.trim(),
        username: 'Anh Long Magic',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        elo: 1485,
        spaPoints: 320,
        rank: 'Master',
        rankPosition: 89,
        stats: {
          matches: 37,
          wins: 28,
          losses: 9,
          winRate: 75.7,
        },
      };
      
      setUser(mockUser);
      await saveUserToStorage(mockUser);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [saveUserToStorage]);

  const signUp = useCallback(async (email: string, password: string, username: string) => {
    if (!email?.trim() || !password?.trim() || !username?.trim()) {
      throw new Error('All fields are required');
    }
    
    if (username.length > 50) {
      throw new Error('Username too long');
    }
    
    setIsLoading(true);
    try {
      // Mock registration - replace with real API call
      const newUser: User = {
        id: Date.now().toString(),
        email: email.trim(),
        username: username.trim(),
        elo: 1200,
        spaPoints: 0,
        rank: 'Beginner',
        rankPosition: 999,
        stats: {
          matches: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
        },
      };
      
      setUser(newUser);
      await saveUserToStorage(newUser);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [saveUserToStorage]);

  const signOut = useCallback(async () => {
    try {
      await removeItem(STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, [removeItem]);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      await saveUserToStorage(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }, [user, saveUserToStorage]);

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }), [user, isLoading, signIn, signUp, signOut, updateProfile]);
});