import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowLeft, Users, Trophy, X, BarChart3, Swords } from 'lucide-react-native';
import { UniversalTabs } from '@/components/shared/UniversalTabs';
import { UniversalCard } from '@/components/shared/UniversalCard';
import { AppHeader } from '@/components/layout/AppHeader';

export default function ComponentDemoScreen() {
  const [activeTab, setActiveTab] = useState('tabs');
  const [challengeTab, setChallengeTab] = useState('waiting');
  const [rankingTab, setRankingTab] = useState('elo');

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  const handleChallengeTabChange = (tabKey: string) => {
    setChallengeTab(tabKey);
  };

  const handleRankingTabChange = (tabKey: string) => {
    setRankingTab(tabKey);
  };

  // Demo tabs configurations
  const mainTabs = [
    { key: 'tabs', label: 'Tabs Demo', icon: Users },
    { key: 'cards', label: 'Cards Demo', icon: Trophy },
    { key: 'headers', label: 'Headers Demo', icon: BarChart3 },
  ];

  const challengeTabs = [
    { key: 'waiting', label: 'Chờ đối', icon: Users },
    { key: 'live', label: 'Lên xe', icon: Trophy },
    { key: 'finished', label: 'Đã xong', icon: X },
  ];

  const rankingTabs = [
    { key: 'prizepool', label: 'Prize Pool', icon: Users },
    { key: 'elo', label: 'ELO', icon: Trophy },
    { key: 'spa', label: 'SPA', icon: BarChart3 },
  ];

  // Demo data for cards
  const rankingCardData = {
    id: '1',
    user: {
      id: '1',
      name: 'Anh Long Magic',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rank: 'G',
      value: '2,450 ELO',
      position: 1,
      trend: 'up' as const,
      isOnline: true,
    },
    type: 'elo' as const,
    isTopRank: true,
  };

  const tournamentCardData = {
    id: '1',
    title: 'SABO Championship 2025',
    description: 'Giải đấu lớn nhất trong năm với giải thưởng hấp dẫn',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
    prize_pool: 50000000,
    entry_fee: 200000,
    current_players: 32,
    max_players: 64,
    min_rank: 'I',
    max_rank: 'H+',
    location: 'SABO Arena - TP.HCM',
    start_time: '2025-10-15T09:00:00Z',
    end_time: '2025-10-15T18:00:00Z',
    status: 'upcoming' as const,
  };

  const challengeCardData = {
    id: '1',
    status: 'waiting' as const,
    date: '15/10/2025',
    time: '14:30',
    handicap: 'Scratch vs Handicap +2',
    spa: 100,
    raceToScore: 7,
    tableNumber: 5,
    player1: {
      id: '1',
      name: 'Anh Long',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rank: 'G',
      isOnline: true,
    },
  };

  const renderTabsDemo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>UniversalTabs Demo</Text>
      
      <Text style={styles.subsection}>Default Variant:</Text>
      <UniversalTabs
        tabs={challengeTabs}
        activeTab={challengeTab}
        onTabChange={handleChallengeTabChange}
        variant="default"
      />

      <Text style={styles.subsection}>Pills Variant:</Text>
      <UniversalTabs
        tabs={rankingTabs}
        activeTab={rankingTab}
        onTabChange={handleRankingTabChange}
        variant="pills"
      />

      <Text style={styles.subsection}>Underline Variant:</Text>
      <UniversalTabs
        tabs={challengeTabs}
        activeTab={challengeTab}
        onTabChange={handleChallengeTabChange}
        variant="underline"
      />

      <Text style={styles.subsection}>With Badges:</Text>
      <UniversalTabs
        tabs={[
          { key: 'messages', label: 'Messages', badge: 5 },
          { key: 'notifications', label: 'Notifications', badge: 12 },
          { key: 'settings', label: 'Settings' },
        ]}
        activeTab="messages"
        onTabChange={() => {}}
        variant="pills"
      />
    </View>
  );

  const renderCardsDemo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>UniversalCard Demo</Text>
      
      <Text style={styles.subsection}>Ranking Card (Top Rank):</Text>
      <UniversalCard
        data={rankingCardData}
        cardType="ranking"
        variant="full"
        onAction={(id, action) => console.log(`Action: ${action} for ${id}`)}
      />

      <Text style={styles.subsection}>Tournament Card (Full):</Text>
      <UniversalCard
        data={tournamentCardData}
        cardType="tournament"
        variant="full"
        onPress={(id) => console.log(`Pressed tournament: ${id}`)}
        onAction={(id, action) => console.log(`Action: ${action} for ${id}`)}
      />

      <Text style={styles.subsection}>Tournament Card (Compact):</Text>
      <UniversalCard
        data={tournamentCardData}
        cardType="tournament"
        variant="compact"
        onPress={(id) => console.log(`Pressed tournament: ${id}`)}
        onAction={(id, action) => console.log(`Action: ${action} for ${id}`)}
      />

      <Text style={styles.subsection}>Challenge Card:</Text>
      <UniversalCard
        data={challengeCardData}
        cardType="challenge"
        variant="full"
        onAction={(id, action) => console.log(`Action: ${action} for ${id}`)}
      />
    </View>
  );

  const renderHeadersDemo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>AppHeader Demo</Text>
      
      <Text style={styles.subsection}>Logo Header:</Text>
      <View style={styles.headerDemo}>
        <AppHeader showLogo={true} />
      </View>

      <Text style={styles.subsection}>Title Header:</Text>
      <View style={styles.headerDemo}>
        <AppHeader title="Thách Đấu" />
      </View>

      <Text style={styles.subsection}>Back + More Header:</Text>
      <View style={styles.headerDemo}>
        <AppHeader 
          title="Chi tiết giải đấu"
          showBackButton={true}
          showMoreButton={true}
          onBack={() => console.log('Back pressed')}
          onMore={() => console.log('More pressed')}
        />
      </View>

      <Text style={styles.subsection}>Dark Theme:</Text>
      <View style={[styles.headerDemo, { backgroundColor: '#161722' }]}>
        <AppHeader 
          title="Dark Header"
          showBackButton={true}
          isDark={true}
          onBack={() => console.log('Back pressed')}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Component Demo',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ArrowLeft size={24} color="#333" />
            </TouchableOpacity>
          ),
        }}
      />

      <UniversalTabs
        tabs={mainTabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        variant="pills"
        style={styles.mainTabs}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'tabs' && renderTabsDemo()}
        {activeTab === 'cards' && renderCardsDemo()}
        {activeTab === 'headers' && renderHeadersDemo()}
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
  mainTabs: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  subsection: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 12,
  },
  headerDemo: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});