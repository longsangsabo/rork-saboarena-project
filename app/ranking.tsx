import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { UniversalTabs } from '@/components/shared/UniversalTabs';
import { RankingList } from '@/components/ranking';
import { RankingHeaderButtons } from '@/components/ranking/RankingHeader';
import { mockRankingData } from '@/lib/demo-data/ranking_data';
import { Users, Trophy, BarChart3 } from 'lucide-react-native';

type RankingType = 'prizepool' | 'elo' | 'spa';





export default function RankingScreen() {
  const [activeTab, setActiveTab] = useState<RankingType>('elo');
  
  const currentData = mockRankingData[activeTab];

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

});