import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { router } from 'expo-router';
import { trpc } from '@/lib/trpc';
import {
  ProfileCard,
  StatsRow,
  TabNavigation,
  MemberItem,
  LoadingState,
  EmptyState
} from '@/components/shared';
import { Users } from 'lucide-react-native';

export default function ClubsScreenRefactored() {
  const [activeTab, setActiveTab] = useState<'members' | 'tournaments' | 'challenges' | 'profile'>('members');
  
  const clubsQuery = trpc.clubs.list.useQuery({ limit: 1 });
  const membersQuery = trpc.clubs.getMembers.useQuery({ clubId: '1' });
  
  const club = clubsQuery.data?.clubs[0];
  const members = membersQuery.data?.members || [];
  
  const handleBack = () => {
    router.back();
  };
  
  const handleMoreOptions = () => {
    console.log('More options');
  };
  
  const handleCameraPress = () => {
    console.log('Change club image');
  };

  const handleMemberPress = (member: any) => {
    console.log('Member pressed:', member);
  };
  
  if (clubsQuery.isLoading) {
    return (
      <View style={styles.container}>
        <LoadingState message="Đang tải thông tin club..." />
      </View>
    );
  }
  
  if (!club) {
    return (
      <View style={styles.container}>
        <EmptyState 
          title="Không thể tải thông tin club"
          subtitle="Vui lòng thử lại sau"
        />
      </View>
    );
  }

  const tabs = [
    { key: 'members', label: 'Thành viên' },
    { key: 'tournaments', label: 'Giải đấu' },
    { key: 'challenges', label: 'Thách đấu' },
    { key: 'profile', label: 'Hồ sơ' }
  ];

  const stats = [
    { label: 'Thành viên', value: club.member_count, icon: 'users' as const },
    { label: 'Giải đấu', value: club.tournament_count, icon: 'trophy' as const },
    { label: 'Prize Pool', value: `${(club.prize_pool / 1000000).toFixed(1)} Tr`, icon: 'dollar' as const },
    { label: 'Thách đấu', value: club.challenge_count, icon: 'gamepad' as const }
  ];
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: club.username,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTitleStyle: {
            fontSize: 17,
            fontWeight: '400',
            color: '#161722'
          },
          headerLeft: () => (
            <button onClick={handleBack}>Back</button>
          ),
          headerRight: () => (
            <button onClick={handleMoreOptions}>More</button>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Club Avatar Section */}
        <View style={styles.avatarSection}>
          <ProfileCard
            imageUrl={club.cover_image}
            name={club.name}
            showEditButton
            onEditPress={handleCameraPress}
            size="large"
          />
        </View>

        {/* Location Badge */}
        <View style={styles.locationContainer}>
          <View style={styles.locationBadge}>
            <View style={styles.locationDot} />
            <text style={styles.locationText}>{club.location}</text>
          </View>
        </View>

        {/* Stats */}
        <StatsRow
          stats={stats}
          style={styles.statsContainer}
        />

        {/* Tab Navigation */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as any)}
          isDark
        />

        {/* Content based on active tab */}
        <View style={styles.contentContainer}>
          {activeTab === 'members' && (
            <View style={styles.membersContainer}>
              {membersQuery.isLoading ? (
                <LoadingState 
                  message="Đang tải danh sách thành viên..." 
                  size="small"
                />
              ) : members.length > 0 ? (
                members.map((member) => (
                  <MemberItem
                    key={member.id}
                    member={member}
                    onPress={handleMemberPress}
                  />
                ))
              ) : (
                <EmptyState
                  icon={Users}
                  title="Chưa có thành viên nào"
                  subtitle="Hãy mời bạn bè tham gia club"
                />
              )}
            </View>
          )}
          
          {activeTab === 'tournaments' && (
            <EmptyState
              title="Danh sách giải đấu sẽ có sớm"
              subtitle="Các giải đấu của club sẽ được hiển thị ở đây"
            />
          )}
          
          {activeTab === 'challenges' && (
            <EmptyState
              title="Danh sách thách đấu sẽ có sớm"
              subtitle="Các thách đấu của club sẽ được hiển thị ở đây"
            />
          )}
          
          {activeTab === 'profile' && (
            <EmptyState
              title="Thông tin chi tiết club sẽ có sớm"
              subtitle="Thông tin chi tiết về club sẽ được hiển thị ở đây"
            />
          )}
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
  scrollView: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 20,
  },
  locationContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30.07, 23.83, 117.45, 0.12)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    gap: 8,
  },
  locationDot: {
    width: 12,
    height: 2,
    backgroundColor: '#BA1900',
    borderRadius: 9999,
    opacity: 0.4,
  },
  locationText: {
    color: '#081122',
    fontSize: 16,
    fontWeight: '400',
  },
  statsContainer: {
    paddingVertical: 20,
  },
  contentContainer: {
    flex: 1,
  },
  membersContainer: {
    paddingHorizontal: 22,
    paddingTop: 20,
  },
});