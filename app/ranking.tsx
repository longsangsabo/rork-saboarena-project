import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { UniversalTabs } from '@/components/shared/UniversalTabs';
import { RankingList, RankingHeaderButtons } from '@/components/ranking';
import { Users, Trophy, BarChart3 } from 'lucide-react-native';
import { trpc } from '@/lib/trpc';

type RankingType = 'prizepool' | 'elo' | 'spa';





export default function RankingScreen() {
  const [activeTab, setActiveTab] = useState<RankingType>('elo');
  
  // Fetch leaderboard data from tRPC
  const leaderboardQuery = trpc.ranking?.leaderboard?.getGlobalLeaderboard?.useQuery(
    { limit: 50, timeframe: 'all' },
    { retry: 2 }
  );
  
  const topPerformersQuery = trpc.ranking?.leaderboard?.getTopPerformers?.useQuery(
    { category: activeTab === 'elo' ? 'winrate' : 'streak', limit: 50 },
    { retry: 2 }
  );
  
  // Use appropriate data based on active tab
  const currentData = activeTab === 'elo' 
    ? leaderboardQuery.data || []
    : topPerformersQuery.data || [];
  
  const isLoading = leaderboardQuery.isLoading || topPerformersQuery.isLoading;
  const hasError = leaderboardQuery.error || topPerformersQuery.error;

  const handleChallenge = (userId: string) => {
    console.log('Challenge user:', userId);
    // TODO: Implement challenge logic
  };

  // Define tabs for UniversalTabs
  const rankingTabs = [
    { key: 'prizepool', label: 'Prize Pool', icon: Users },
    { key: 'elo', label: 'ELO', icon: Trophy },
    { key: 'spa', label: 'SPA', icon: BarChart3 },
  ];

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as RankingType);
  };

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen 
          options={{
            headerShown: true,
            headerTitle: 'Bảng xếp hạng',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: '600',
            },
            headerStyle: {
              backgroundColor: 'white',
            },
            headerLeft: () => <RankingHeaderButtons onBack={() => router.back()} />,
            headerRight: () => <RankingHeaderButtons onMore={() => console.log('More options')} />,
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7B5CF6" />
          <Text style={styles.loadingText}>Đang tải bảng xếp hạng...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Show error state
  if (hasError) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen 
          options={{
            headerShown: true,
            headerTitle: 'Bảng xếp hạng',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: '600',
            },
            headerStyle: {
              backgroundColor: 'white',
            },
            headerLeft: () => <RankingHeaderButtons onBack={() => router.back()} />,
            headerRight: () => <RankingHeaderButtons onMore={() => console.log('More options')} />,
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không thể tải bảng xếp hạng</Text>
          <Text style={styles.errorSubtext}>Vui lòng thử lại sau</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Bảng xếp hạng',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: 'white',
          },
          headerLeft: () => <RankingHeaderButtons onBack={() => router.back()} />,
          headerRight: () => <RankingHeaderButtons onMore={() => console.log('More options')} />,
        }}
      />
      
      <UniversalTabs 
        tabs={rankingTabs} 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        variant="pills" 
      />
      
      <RankingList 
        users={currentData}
        type={activeTab}
        onChallenge={handleChallenge}
      />
    </SafeAreaView>
  );
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
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E53E3E',
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});