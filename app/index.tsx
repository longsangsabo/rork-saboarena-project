import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

export default function IndexScreen() {
  const { user, loading } = useAuth();

  console.log('🏠 IndexScreen - user:', user, 'loading:', loading);

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Text style={styles.logoText}>S</Text>
            </View>
          </View>
          <ActivityIndicator size="large" color="#4A5D23" style={styles.spinner} />
          <Text style={styles.loadingText}>Đang khởi tạo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // If user is authenticated, go to home
  if (user) {
    console.log('🏠 IndexScreen - Redirecting to home with user:', user.id);
    return <Redirect href="/(tabs)/home" />;
  }

  // If not authenticated, go to splash/onboarding
  console.log('🏠 IndexScreen - No user, redirecting to splash');
  return <Redirect href="/splash" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4A5D23',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  spinner: {
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});