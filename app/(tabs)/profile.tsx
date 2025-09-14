import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  Text,
  SafeAreaView
} from 'react-native';
import { trpc } from '@/lib/trpc';
import { useTheme } from '@/providers/ThemeProvider';
import { RankBadge } from '@/components/shared';
import { CustomStatusBar, MenuButton, LoadingState, EmptyState } from '@/components/ui';
import { 
  UserAvatar, 
  ProfileTag, 
  StatsGrid, 
  ProfileTabs 
} from '@/components/profile';
import { TournamentListItem } from '@/components/tournaments';

export default function ProfileScreen() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'tournaments' | 'challenges'>('tournaments');
  
  // TRPC queries for real data
  const profileQuery = trpc.user.getProfile.useQuery({ userId: '1' });
  const tournamentsQuery = trpc.tournaments.list.useQuery({ 
    status: 'registration_open',
    limit: 10
  });
  
  // Mock data matching screenshot
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

  // Tournament data matching screenshot
  const tournaments = [
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

  const statsData = [
    { label: 'ELO', value: user.elo },
    { label: 'SPA', value: user.spa },
    { label: 'XH', value: `#${user.ranking}` },
    { label: 'TRẬN', value: user.matches },
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
      <View style={[
        styles.header,
        { backgroundColor: theme.colors.light.background }
      ]}>
        <ProfileTag username={user.username} />
        <MenuButton onPress={() => console.log('Menu pressed')} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Avatar */}
        <View style={styles.avatarSection}>
          <UserAvatar 
            imageUrl={user.avatar}
            size={120}
            showEditButton={true}
            onEditPress={() => console.log('Edit avatar')}
          />
        </View>

        {/* Display Name */}
        <View style={styles.nameSection}>
          <Text style={[
            styles.displayName,
            { color: theme.colors.sabo.gray[600] }
          ]}>
            {user.displayName}
          </Text>
        </View>

        {/* Rank Badge */}
        <View style={styles.rankSection}>
          <View style={[
            styles.rankBadge,
            { backgroundColor: theme.colors.sabo.secondary[500] }
          ]}>
            <Text style={[
              styles.rankText,
              { color: 'white' }
            ]}>
              RANK: {user.rank}
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <StatsGrid stats={statsData} style={styles.statsSection} />

        {/* Profile Tabs */}
        <ProfileTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          style={styles.tabsSection}
        />

        {/* Tournament List */}
        <View style={styles.tournamentList}>
          {tournaments.map((tournament) => (
            <View key={tournament.id} style={[
              styles.tournamentItem,
              { backgroundColor: theme.colors.light.card }
            ]}>
              <View style={styles.tournamentRow}>
                <View style={[
                  styles.tournamentNumber,
                  { backgroundColor: theme.colors.sabo.primary[100] }
                ]}>
                  <Text style={[
                    styles.tournamentNumberText,
                    { color: theme.colors.sabo.primary[600] }
                  ]}>
                    {tournament.number}
                  </Text>
                </View>
                
                <View style={styles.tournamentInfo}>
                  <Text style={[
                    styles.tournamentTitle,
                    { color: theme.colors.sabo.primary[600] }
                  ]}>
                    {tournament.title}
                  </Text>
                  
                  <View style={styles.tournamentDetails}>
                    <Text style={[
                      styles.tournamentDate,
                      { color: theme.colors.sabo.gray[500] }
                    ]}>
                      📅 {tournament.date}
                    </Text>
                    <Text style={[
                      styles.tournamentParticipants,
                      { color: theme.colors.sabo.error[500] }
                    ]}>
                      👥 {tournament.participants}
                    </Text>
                    <Text style={[
                      styles.tournamentPrize,
                      { color: theme.colors.sabo.success[500] }
                    ]}>
                      💰 {tournament.prize}
                    </Text>
                    <Text style={[
                      styles.tournamentMatches,
                      { color: theme.colors.sabo.gray[600] }
                    ]}>
                      {tournament.matches}
                    </Text>
                  </View>
                </View>
                
                <Text style={[
                  styles.tournamentLocation,
                  { color: theme.colors.sabo.gray[500] }
                ]}>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    marginBottom: 16,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '500',
  },
  rankSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  rankBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsSection: {
    marginBottom: 24,
  },
  tabsSection: {
    marginBottom: 0,
  },
  tournamentList: {
    paddingHorizontal: 16,
  },
  tournamentItem: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tournamentNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  tournamentDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tournamentDate: {
    fontSize: 12,
  },
  tournamentParticipants: {
    fontSize: 12,
  },
  tournamentPrize: {
    fontSize: 12,
  },
  tournamentMatches: {
    fontSize: 12,
  },
  tournamentLocation: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});