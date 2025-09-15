import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  Text,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { trpc } from '@/lib/trpc';
import { useTheme } from '@/providers/ThemeProvider';
import { RankBadge } from '@/components/shared';
import { CustomStatusBar, MenuButton, LoadingState, EmptyState } from '@/components/ui';
import { 
  UserAvatar, 
  ProfileTag, 
  ProfileTabs,
  ProfileActions
} from '@/components/profile';
import { TournamentListItem } from '@/components/tournaments';

export default function ProfileScreen() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'tournaments' | 'challenges'>('tournaments');
  
  // TRPC queries for real data
  const profileQuery = trpc.user.getProfile.useQuery({ userId: '1' });
  const gameDataQuery = trpc.user.getGameData.useQuery();
  const tournamentsQuery = trpc.tournaments.list.useQuery({ 
    status: 'registration_open',
    limit: 10
  });
  
  // Use real data with fallback
  const user = profileQuery.data || {
    id: "1",
    username: "username",
    displayName: "Chưa đặt Display Name",
    avatar: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=50&h=50&fit=crop",
    rank: "K",
    elo: 1485,
    spa: 320,
    ranking: 89,
    matches: 37,
  };

  const gameStats = gameDataQuery.data;

  // Tournament data - use real data or fallback to mock
  const tournaments = tournamentsQuery.data || [
    {
      id: '1',
      number: '8',
      title: 'SABO POOL 8 BALL',
      date: '07/09 - Thứ 7',
      participants: '0/16',
      prize: '10 Mỗi',
      matches: '2 Mang',
      location: 'K - I+'
    },
    {
      id: '2',
      number: '8', 
      title: 'SABO POOL 8 BALL',
      date: '07/09 - Thứ 7',
      participants: '0/16', 
      prize: '10 Mỗi',
      matches: '2 Mang',
      location: 'K - I+'
    },
    {
      id: '3',
      number: '8',
      title: 'SABO POOL 8 BALL', 
      date: '07/09 - Thứ 7',
      participants: '0/16',
      prize: '10 Mỗi', 
      matches: '2 Mang',
      location: 'K - I+'
    }
  ];

  // Stats data exactly matching the screenshot
  const statsData = [
    { icon: '🏆', label: 'ELO', value: '1485' },
    { icon: '⭐', label: 'SPA', value: '320' },
    { icon: '📈', label: 'XH', value: '#89' },
    { icon: '∞', label: 'TRẬN', value: '37' },
  ];

  if (profileQuery.isLoading) {
    return <LoadingState />;
  }

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: theme.colors.light.background }
    ]}>
      <CustomStatusBar />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.username}>@{user.username}</Text>
        <MenuButton onPress={() => router.push('/edit-profile')} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Avatar */}
        <View style={styles.avatarSection}>
          <UserAvatar 
            imageUrl={user.avatar}
            size={120}
            showEditButton={true}
            onEditPress={() => router.push('/edit-profile')}
          />
        </View>

        {/* Display Name */}
        <View style={styles.nameSection}>
          <Text style={styles.displayName}>
            {user.displayName}
          </Text>
        </View>

        {/* Rank Badge */}
        <View style={styles.rankSection}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>
              RANK : {user.rank}
            </Text>
          </View>
        </View>

        {/* Profile Actions */}
        <ProfileActions 
          userId={user.id}
          isOwnProfile={true}
          onMessage={() => {/* Navigate to messages */}}
          onChallenge={() => {/* Navigate to challenge */}}
        />

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🏆</Text>
              <Text style={styles.statValue}>{gameStats?.elo || user.elo}</Text>
              <Text style={styles.statLabel}>ELO</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statValue}>{gameStats?.spa_points || user.spa}</Text>
              <Text style={styles.statLabel}>SPA</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>📈</Text>
              <Text style={styles.statValue}>#{gameStats?.ranking_position || user.ranking}</Text>
              <Text style={styles.statLabel}>XH</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>∞</Text>
              <Text style={styles.statValue}>{gameStats?.total_matches || user.matches}</Text>
              <Text style={styles.statLabel}>TRẬN</Text>
            </View>
          </View>
        </View>

        {/* Profile Tabs */}
        <ProfileTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          style={styles.tabsSection}
        />

        {/* Tournament List */}
        <View style={styles.tournamentList}>
          {tournaments.map((tournament) => (
            <View key={tournament.id} style={styles.tournamentItem}>
              <View style={styles.tournamentRow}>
                {/* Tournament Number Circle */}
                <View style={styles.tournamentNumber}>
                  <Text style={styles.tournamentNumberText}>
                    {tournament.number}
                  </Text>
                </View>
                
                {/* Tournament Info */}
                <View style={styles.tournamentInfo}>
                  <Text style={styles.tournamentTitle}>
                    {tournament.title}
                  </Text>
                  
                  <View style={styles.tournamentDetails}>
                    <Text style={styles.tournamentMeta}>
                      📅 {tournament.date} 👥 {tournament.participants} 💰 {tournament.prize} {tournament.matches}
                    </Text>
                  </View>
                </View>
                
                {/* Tournament Location */}
                <Text style={styles.tournamentLocation}>
                  {tournament.location}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  username: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  nameSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#9CA3AF',
  },
  rankSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  rankBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabsSection: {
    marginBottom: 0,
  },
  tournamentList: {
    paddingHorizontal: 16,
  },
  tournamentItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tournamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tournamentNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tournamentNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 8,
  },
  tournamentDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tournamentMeta: {
    fontSize: 12,
    color: '#6B7280',
    flexWrap: 'wrap',
  },
  tournamentLocation: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 8,
  },
});