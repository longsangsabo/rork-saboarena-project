import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { trpc } from '@/lib/trpc';
import {
  AppHeader,
  ProfileCard,
  RankBadge,
  StatsRow,
  TabNavigation,
  TournamentCard,
  LoadingState,
  EmptyState
} from '@/components/shared';
import { Trophy } from 'lucide-react-native';

export default function ProfileScreenRefactored() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'ready' | 'live' | 'done'>('ready');
  
  const profileQuery = trpc.user.getProfile.useQuery({});
  const tournamentsQuery = trpc.tournaments.list.useQuery({ 
    status: activeTab === 'ready' ? 'upcoming' : activeTab === 'live' ? 'live' : 'completed'
  });
  
  const user = profileQuery.data;
  
  const handleEditProfile = () => {
    console.log('Edit profile');
  };
  
  const handleBack = () => {
    router.back();
  };
  
  const handleMoreOptions = () => {
    console.log('More options');
  };

  const handleJoinTournament = (tournamentId: string) => {
    console.log('Join tournament:', tournamentId);
  };
  
  if (profileQuery.isLoading) {
    return (
      <View style={styles.container}>
        <LoadingState message="Đang tải hồ sơ..." />
      </View>
    );
  }
  
  if (!user) {
    return (
      <View style={styles.container}>
        <EmptyState 
          title="Không thể tải hồ sơ"
          subtitle="Vui lòng thử lại sau"
        />
      </View>
    );
  }

  const tabs = [
    { key: 'ready', label: 'Ready' },
    { key: 'live', label: 'Live' },
    { key: 'done', label: 'Done' }
  ];

  const stats = [
    { label: 'ELO', value: user.elo, icon: 'crown' as const },
    { label: 'SPA', value: user.spa, icon: 'star' as const },
    { label: 'XH', value: `#${user.ranking}`, icon: 'trending' as const },
    { label: 'TRẬN', value: user.matches, icon: 'gamepad' as const }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <AppHeader
        title={user.username}
        showBackButton
        showMoreButton
        onBack={handleBack}
        onMore={handleMoreOptions}
        isDark
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileSection}>
          <ProfileCard
            imageUrl={user.avatar}
            name={user.displayName}
            showEditButton
            onEditPress={handleEditProfile}
            size="large"
          />

          {/* Rank Badge */}
          <RankBadge
            rank={user.rank}
            style={styles.rankBadge}
          />

          {/* Stats Row */}
          <StatsRow
            stats={stats}
            style={styles.statsRow}
          />
        </View>

        {/* Tournament Tabs */}
        <View style={styles.tabsContainer}>
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as 'ready' | 'live' | 'done')}
            isDark
          />

          {/* Tournament List */}
          <View style={styles.tournamentList}>
            {tournamentsQuery.isLoading ? (
              <LoadingState 
                message="Đang tải..." 
                size="small"
              />
            ) : tournamentsQuery.data?.tournaments.length ? (
              tournamentsQuery.data.tournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                  onJoin={handleJoinTournament}
                  variant="compact"
                />
              ))
            ) : (
              <EmptyState
                icon={Trophy}
                title="Không có giải đấu nào"
                subtitle="Hãy tham gia các giải đấu mới"
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    borderBottomWidth: 0.33,
    borderBottomColor: '#D0D1D3',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: 'white',
    paddingBottom: 20,
    borderBottomWidth: 0.33,
    borderBottomColor: '#D0D1D3',
  },
  rankBadge: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  statsRow: {
    marginTop: 20,
  },
  tabsContainer: {
    backgroundColor: 'white',
    marginTop: 8,
  },
  tournamentList: {
    padding: 20,
  },
});