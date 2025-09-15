import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Stack } from 'expo-router';
import { trpc } from '@/lib/trpc';
import { 
  UniversalTabs,
  ChallengesList
} from '@/components/shared';
import { Users, Trophy, X, Plus, Wifi, WifiOff } from 'lucide-react-native';
import { useRealTimeChallenge } from '@/hooks/useWebSocket';
import { getChallengesByStatus, type Challenge } from '@/lib/demo-data/challenges-data';

export default function ChallengesScreen() {
  const [mainTab, setMainTab] = useState<'giaoluu' | 'thachdau'>('thachdau');
  const [activeTab, setActiveTab] = useState<'waiting' | 'live' | 'finished'>('waiting');

  // WebSocket real-time challenge updates
  const realTimeData = useRealTimeChallenge();
  const isConnected = (realTimeData as any)?.isConnected || false;

  // TRPC queries with correct mapping (commented out for now)
  // const challengesQuery = trpc.challenges.list.useQuery({ 
  //   type: mainTab,
  //   limit: 10 
  // });

  // Use mock data for now since API might not be ready
  const mockChallenges = getChallengesByStatus(activeTab);

  const handleJoinChallenge = (challengeId: string) => {
    console.log('Joining challenge:', challengeId);
    // TODO: Implement actual join logic
  };
  
  const handleViewLive = (challengeId: string) => {
    console.log('Viewing live challenge:', challengeId);
    // TODO: Implement live view logic
  };

  // Define tabs for UniversalTabs
  const challengeTabs = [
    { key: 'waiting', label: 'Waiting', icon: Users },
    { key: 'live', label: 'Live', icon: Trophy },
    { key: 'finished', label: 'Finished', icon: X },
  ];

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as 'waiting' | 'live' | 'finished');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'SABO Challenges',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#F8F9FA',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#7B5CF6',
          },
        }}
      />
      
      {/* WebSocket Connection Status */}
      <View style={[
        styles.connectionStatus,
        { backgroundColor: isConnected ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }
      ]}>
        {isConnected ? (
          <Wifi size={12} color="#22c55e" />
        ) : (
          <WifiOff size={12} color="#ef4444" />
        )}
        <Text style={[
          styles.statusText,
          { color: isConnected ? '#22c55e' : '#ef4444' }
        ]}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Text>
      </View>

      {/* Main Tab Navigation */}
      <View style={styles.mainTabContainer}>
        <TouchableOpacity 
          style={[styles.mainTab, mainTab === 'giaoluu' && styles.activeMainTab]}
          onPress={() => setMainTab('giaoluu')}
        >
          <Text style={[
            styles.mainTabText, 
            mainTab === 'giaoluu' && styles.activeMainTabText
          ]}>
            Friendly
          </Text>
          {mainTab === 'giaoluu' && <View style={styles.mainTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.mainTab, mainTab === 'thachdau' && styles.activeMainTab]}
          onPress={() => setMainTab('thachdau')}
        >
          <Text style={[
            styles.mainTabText, 
            mainTab === 'thachdau' && styles.activeMainTabText
          ]}>
            Competitive
          </Text>
          {mainTab === 'thachdau' && <View style={styles.mainTabIndicator} />}
        </TouchableOpacity>
      </View>
      
      {/* Create Challenge Button */}
      <TouchableOpacity 
        style={styles.createChallengeButton}
        onPress={() => console.log('Create new challenge')}
      >
        <Plus size={20} color="white" />
        <Text style={styles.createChallengeText}>Create New Challenge</Text>
      </TouchableOpacity>
      
      {/* Challenge Tabs */}
      <UniversalTabs 
        tabs={challengeTabs} 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        variant="underline" 
      />
      
      {/* Challenge List */}
      <ScrollView style={styles.challengeContent}>
        <ChallengesList 
          challenges={mockChallenges as Challenge[]}
          onJoinChallenge={handleJoinChallenge}
          onViewLive={handleViewLive}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  // Main tab styles
  mainTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    paddingHorizontal: 20,
  },
  mainTab: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    position: 'relative',
  },
  activeMainTab: {
    // Active styling handled by indicator
  },
  mainTabText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#64748B',
  },
  activeMainTabText: {
    color: '#1A1D29',
    fontWeight: '700',
  },
  mainTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#7B5CF6',
  },
  
  // Create challenge button
  createChallengeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7B5CF6',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  createChallengeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // WebSocket connection status styles
  connectionStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },

  // Content styles
  challengeContent: {
    flex: 1,
    paddingTop: 8,
  },
});