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
import { RankingCard, RankingUser } from '@/components/shared/RankingCard';
import { RankingTabs, RankingType } from '@/components/shared/RankingTabs';
import { mockRankingData } from '@/demo-data/ranking_data';





export default function RankingScreen() {
  const [activeTab, setActiveTab] = useState<RankingType>('elo');
  
  const currentData = mockRankingData[activeTab];
  const topUser = currentData[0];
  const otherUsers = currentData.slice(1);

  const handleChallenge = (userId: string) => {
    console.log('Challenge user:', userId);
    // TODO: Implement challenge logic
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
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ArrowLeft size={24} color="#333" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton}>
              <MoreHorizontal size={24} color="#333" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <RankingTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {topUser && (
          <RankingCard 
            user={topUser} 
            type={activeTab} 
            isTopRank={true}
            onChallenge={handleChallenge}
          />
        )}
        
        <View style={styles.listContainer}>
          {otherUsers.map((user) => (
            <RankingCard 
              key={user.id} 
              user={user} 
              type={activeTab}
              onChallenge={handleChallenge}
            />
          ))}
        </View>
      </ScrollView>
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