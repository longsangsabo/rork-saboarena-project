import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowLeft, MoreHorizontal } from 'lucide-react-native';
import { RankingUser } from '@/components/shared/RankingCard';
import { UniversalTabs } from '@/components/shared/UniversalTabs';
import { RankingHeaderButtons } from '@/components/ranking/RankingHeader';
import { RankingList } from '@/components/ranking/RankingList';
import { mockRankingData } from '@/lib/demo-data/ranking_data';
import { Users, Trophy, BarChart3 } from 'lucide-react-native';

type RankingType = 'prizepool' | 'elo' | 'spa';





export default function RankingScreen() {
  const [activeTab, setActiveTab] = useState<RankingType>('elo');
  
  const currentData = mockRankingData[activeTab];
  const topUser = currentData[0];
  const otherUsers = currentData.slice(1);

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
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});