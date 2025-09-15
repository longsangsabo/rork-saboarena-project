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


export default function ChallengesScreen() {
  const [mainTab, setMainTab] = useState<'giaoluu' | 'thachdau'>('thachdau');
  const [activeTab, setActiveTab] = useState<'waiting' | 'live' | 'finished'>('waiting');

  // WebSocket real-time challenge updates
  const realTimeData = useRealTimeChallenge();
  const isConnected = (realTimeData as any)?.isConnected || false;

  // Real tRPC query for challenges
  const challengesQuery = trpc.challenges.list.useQuery({ 
    type: mainTab,
    limit: 50 
  });

  // Filter challenges by status from the real data
  const filteredChallenges = challengesQuery.data?.challenges?.filter(challenge => {
    // Map challenge status to our tab system
    if (activeTab === 'waiting') return challenge.type === mainTab;
    if (activeTab === 'live') return challenge.type === mainTab; // Add live status logic
    if (activeTab === 'finished') return challenge.type === mainTab; // Add finished status logic
    return false;
  }) || [];

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
        {challengesQuery.isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading challenges...</Text>
          </View>
        ) : challengesQuery.error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error loading challenges</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => challengesQuery.refetch()}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ChallengesList 
            challenges={filteredChallenges}
            onJoinChallenge={handleJoinChallenge}
            onViewLive={handleViewLive}
          />
        )}
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
  
  // Loading and error states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#7B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});