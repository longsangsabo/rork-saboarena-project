import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { router } from 'expo-router';
import { MapPin, MoreHorizontal, Camera, Trophy, Users, Target, BarChart3, X } from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { UniversalTabs } from '@/components/shared/UniversalTabs';
import ChallengeCard from '@/components/challenges/ChallengeCard';
import { mockChallenges, getChallengesByStatus } from '@/demo-data/challenges-data';
import { ClubCard, MemberList, LoadingContainer, ErrorContainer } from '@/components/shared';
import { TournamentCard } from '@/components/tournaments/TournamentCard';
import { RankingCard } from '@/components/shared/RankingCard';

interface Member {
  id: string;
  name: string;
  rank: string;
  avatar: string;
  isOnline: boolean;
  joinDate: string;
}



export default function ClubsScreen() {
  const [mainTab, setMainTab] = useState<'clb' | 'find_opponent'>('clb');
  const [activeTab, setActiveTab] = useState<'members' | 'tournaments' | 'ranking' | 'challenges'>('members');
  const [tournamentTab, setTournamentTab] = useState<'ready' | 'live' | 'done'>('ready');
  const [rankingTab, setRankingTab] = useState<'prize_pool' | 'elo' | 'spa'>('prize_pool');
  const [challengeTab, setChallengeTab] = useState<'waiting' | 'live' | 'finished'>('waiting');

  // Define tabs for UniversalTabs
  const challengeTabs = [
    { key: 'waiting', label: 'Chờ đối', icon: Users },
    { key: 'live', label: 'Lên xe', icon: Trophy },
    { key: 'finished', label: 'Đã xong', icon: X },
  ];

  const handleChallengeTabChange = (tabKey: string) => {
    setChallengeTab(tabKey as 'waiting' | 'live' | 'finished');
  };
  
  const clubsQuery = trpc.clubs.list.useQuery({ limit: 10 });
  const membersQuery = trpc.clubs.getMembers.useQuery({ clubId: '1' });
  
  const clubs = clubsQuery.data?.clubs || [];
  const club = clubs[0];
  const members = membersQuery.data?.members || [];
  
  const handleBack = () => {
    router.back();
  };
  
  const handleMoreOptions = () => {
    Alert.alert(
      'Tùy chọn',
      'Chọn hành động',
      [
        { text: 'Thiết lập club', onPress: () => console.log('Club settings') },
        { text: 'Rời khỏi club', style: 'destructive', onPress: () => console.log('Leave club') },
        { text: 'Hủy', style: 'cancel' }
      ]
    );
  };
  
  const handleCameraPress = () => {
    Alert.alert('Thay đổi ảnh', 'Tính năng thay đổi ảnh sẽ có sớm!');
  };
  
  if (clubsQuery.isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0A5C6D" />
        <Text style={{ marginTop: 16, color: '#666' }}>Đang tải thông tin club...</Text>
      </View>
    );
  }
  
  if (!club) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#666' }}>Không thể tải thông tin club</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'SABO',
          headerTitleAlign: 'left',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: '900',
            color: '#6503C8',

          },
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity style={styles.headerIconButton}>
                <View style={styles.notificationIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconButton}>
                <View style={styles.chatIcon} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      {/* Main Tab Navigation */}
      <View style={styles.mainTabContainer}>
        <TouchableOpacity 
          style={[styles.mainTab, mainTab === 'clb' && styles.activeMainTab]}
          onPress={() => setMainTab('clb')}
        >
          <Text style={[styles.mainTabText, mainTab === 'clb' && styles.activeMainTabText]}>CLB</Text>
          {mainTab === 'clb' && <View style={styles.mainTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.mainTab, mainTab === 'find_opponent' && styles.activeMainTab]}
          onPress={() => setMainTab('find_opponent')}
        >
          <Text style={[styles.mainTabText, mainTab === 'find_opponent' && styles.activeMainTabText]}>Tìm đối</Text>
          {mainTab === 'find_opponent' && <View style={styles.mainTabIndicator} />}
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {mainTab === 'find_opponent' ? (
          // Find Opponent Tab Content
          <View style={styles.findOpponentContainer}>
            {clubsQuery.isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0A5C6D" />
                <Text style={styles.loadingText}>Đang tải danh sách club...</Text>
              </View>
            ) : (
              clubs.map((clubItem: any) => (
                <ClubCard
                  key={clubItem.id}
                  id={clubItem.id}
                  name={clubItem.name}
                  location={clubItem.location}
                  memberCount={clubItem.member_count || 0}
                  imageUrl={clubItem.cover_image}
                  onPress={() => console.log('Club pressed:', clubItem.name)}
                />
              ))
            )}
          </View>
        ) : (
          // CLB Tab Content
          <View>
            {/* Club Avatar Section */}
            <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['rgba(119, 132, 248, 0.40)', 'rgba(27, 26, 38, 0.20)', 'rgba(198, 149, 248, 0.40)']}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBorder}
            >
              <Image 
                source={{ uri: club.cover_image }}
                style={styles.clubImage}
              />
              <LinearGradient
                colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.80)']}
                style={styles.imageOverlay}
              >
                <Text style={styles.clubName}>{club.name}</Text>
              </LinearGradient>
            </LinearGradient>
          </View>
          
          <TouchableOpacity style={styles.cameraButton} onPress={handleCameraPress}>
            <Camera size={20} color="black" />
          </TouchableOpacity>
        </View>

        {/* Location */}
        <View style={styles.locationContainer}>
          <View style={styles.locationBadge}>
            <MapPin size={12} color="#BA1900" />
            <Text style={styles.locationText}>{club.location}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{club.member_count}</Text>
            <Text style={styles.statLabel}>Thành viên</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{club.tournament_count}</Text>
            <Text style={styles.statLabel}>Giải đấu</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{(club.prize_pool / 1000000).toFixed(1)} Tr</Text>
            <Text style={styles.statLabel}>Prize Pool</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{club.challenge_count}</Text>
            <Text style={styles.statLabel}>Thách đấu</Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'members' && styles.activeTab]}
            onPress={() => setActiveTab('members')}
          >
            <Users size={20} color={activeTab === 'members' ? '#161722' : '#D7D7D9'} />
            <Text style={[styles.tabText, activeTab === 'members' && styles.activeTabText]}>Thành viên</Text>
            {activeTab === 'members' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'tournaments' && styles.activeTab]}
            onPress={() => setActiveTab('tournaments')}
          >
            <Trophy size={20} color={activeTab === 'tournaments' ? '#161722' : '#D7D7D9'} />
            <Text style={[styles.tabText, activeTab === 'tournaments' && styles.activeTabText]}>Giải đấu</Text>
            {activeTab === 'tournaments' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'ranking' && styles.activeTab]}
            onPress={() => setActiveTab('ranking')}
          >
            <BarChart3 size={20} color={activeTab === 'ranking' ? '#161722' : '#D7D7D9'} />
            <Text style={[styles.tabText, activeTab === 'ranking' && styles.activeTabText]}>Bảng xếp hạng</Text>
            {activeTab === 'ranking' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'challenges' && styles.activeTab]}
            onPress={() => setActiveTab('challenges')}
          >
            <Target size={20} color={activeTab === 'challenges' ? '#161722' : '#D7D7D9'} />
            <Text style={[styles.tabText, activeTab === 'challenges' && styles.activeTabText]}>Thách đấu</Text>
            {activeTab === 'challenges' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        <View style={styles.contentContainer}>
          {activeTab === 'members' && (
            <View style={styles.membersContainer}>
              <MemberList 
                members={members}
                loading={membersQuery.isLoading}
              />
            </View>
          )}
          
          {activeTab === 'tournaments' && (
            <View style={styles.tournamentsContainer}>
              {/* Tournament Sub-tabs */}
              <View style={styles.subTabContainer}>
                <TouchableOpacity 
                  style={[styles.subTab, tournamentTab === 'ready' && styles.activeSubTab]}
                  onPress={() => setTournamentTab('ready')}
                >
                  <Text style={[styles.subTabText, tournamentTab === 'ready' && styles.activeSubTabText]}>Ready</Text>
                  {tournamentTab === 'ready' && <View style={styles.subTabIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.subTab, tournamentTab === 'live' && styles.activeSubTab]}
                  onPress={() => setTournamentTab('live')}
                >
                  <Text style={[styles.subTabText, tournamentTab === 'live' && styles.activeSubTabText]}>Live</Text>
                  {tournamentTab === 'live' && <View style={styles.subTabIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.subTab, tournamentTab === 'done' && styles.activeSubTab]}
                  onPress={() => setTournamentTab('done')}
                >
                  <Text style={[styles.subTabText, tournamentTab === 'done' && styles.activeSubTabText]}>Done</Text>
                  {tournamentTab === 'done' && <View style={styles.subTabIndicator} />}
                </TouchableOpacity>
              </View>
              
              {/* Tournament Content */}
              <ScrollView style={styles.tournamentsList} showsVerticalScrollIndicator={false}>
                {tournamentTab === 'ready' && (
                  <View style={styles.tournamentContent}>
                    <TournamentCard 
                      title="SABO POOL 8 BALL Championship"
                      participants="8/16 người"
                      date="8/9/2024"
                      prizePool="10.000.000 Million"
                      rank="K → H+"
                      status="ready"
                      onPress={() => router.push('/tournament-detail')}
                    />
                  </View>
                )}
                {tournamentTab === 'live' && (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Không có giải đấu nào đang diễn ra</Text>
                  </View>
                )}
                {tournamentTab === 'done' && (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Chưa có giải đấu nào kết thúc</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
          
          {activeTab === 'ranking' && (
            <View style={styles.rankingContainer}>
              {/* Ranking Sub-tabs */}
              <View style={styles.subTabContainer}>
                <TouchableOpacity 
                  style={[styles.subTab, rankingTab === 'prize_pool' && styles.activeSubTab]}
                  onPress={() => setRankingTab('prize_pool')}
                >
                  <Text style={[styles.subTabText, rankingTab === 'prize_pool' && styles.activeSubTabText]}>Prize Pool</Text>
                  {rankingTab === 'prize_pool' && <View style={styles.subTabIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.subTab, rankingTab === 'elo' && styles.activeSubTab]}
                  onPress={() => setRankingTab('elo')}
                >
                  <Text style={[styles.subTabText, rankingTab === 'elo' && styles.activeSubTabText]}>ELO</Text>
                  {rankingTab === 'elo' && <View style={styles.subTabIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.subTab, rankingTab === 'spa' && styles.activeSubTab]}
                  onPress={() => setRankingTab('spa')}
                >
                  <Text style={[styles.subTabText, rankingTab === 'spa' && styles.activeSubTabText]}>SPA</Text>
                  {rankingTab === 'spa' && <View style={styles.subTabIndicator} />}
                </TouchableOpacity>
              </View>
              
              {/* Ranking Content */}
              <ScrollView style={styles.rankingList} showsVerticalScrollIndicator={false}>
                <RankingCard 
                  type={rankingTab}
                  data={[
                    { rank: 1, name: 'Player 1', value: rankingTab === 'prize_pool' ? '5.000.000' : rankingTab === 'elo' ? '1500' : '1000', avatar: 'https://placehold.co/40x40' },
                    { rank: 2, name: 'Player 2', value: rankingTab === 'prize_pool' ? '3.000.000' : rankingTab === 'elo' ? '1400' : '800', avatar: 'https://placehold.co/40x40' },
                    { rank: 3, name: 'Player 3', value: rankingTab === 'prize_pool' ? '2.000.000' : rankingTab === 'elo' ? '1300' : '600', avatar: 'https://placehold.co/40x40' },
                  ]}
                />
              </ScrollView>
            </View>
          )}
          
          {activeTab === 'challenges' && (
            <View style={styles.challengesContainer}>
              <UniversalTabs 
                tabs={challengeTabs}
                activeTab={challengeTab}
                onTabChange={handleChallengeTabChange}
                variant="underline"
              />
              <ScrollView 
                style={styles.challengesList}
                showsVerticalScrollIndicator={false}
              >
                {getChallengesByStatus(challengeTab)
                  .map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      {...challenge}
                      onJoin={() => console.log('Join challenge:', challenge.id)}
                      onCancel={() => console.log('Cancel challenge:', challenge.id)}
                      onViewLive={() => console.log('View live:', challenge.id)}
                    />
                  ))
                }
                {getChallengesByStatus(challengeTab).length === 0 && (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      {challengeTab === 'waiting' && 'Chưa có thách đấu nào đang chờ'}
                      {challengeTab === 'live' && 'Không có trận đấu nào đang diễn ra'}
                      {challengeTab === 'finished' && 'Chưa có trận đấu nào kết thúc'}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
          

        </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIconButton: {
    padding: 4,
  },
  notificationIcon: {
    width: 20,
    height: 20,
    backgroundColor: 'black',
  },
  chatIcon: {
    width: 20,
    height: 20,
    backgroundColor: 'black',
  },
  mainTabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
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
    color: '#CCCCCE',
  },
  activeMainTabText: {
    color: 'black',
    fontWeight: '700',
  },
  mainTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#6503C8',
  },
  findOpponentContainer: {
    padding: 16,
  },
  clubCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clubCardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  clubCardContent: {
    padding: 16,
  },
  clubCardName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 8,
  },
  clubCardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  clubCardLocationText: {
    fontSize: 14,
    color: '#666',
  },
  clubCardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  joinButton: {
    backgroundColor: '#0A5C6D',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#BA1900',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  backIcon: {
    width: 22.46,
    height: 22,
    backgroundColor: '#161722',
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 20,
    position: 'relative',
  },
  avatarContainer: {
    position: 'relative',
  },
  gradientBorder: {
    width: 350,
    height: 350,
    borderRadius: 18,
    padding: 2,
  },
  clubImage: {
    width: 346,
    height: 346,
    borderRadius: 16,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    right: 2,
    height: 76,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  clubName: {
    color: '#A0B2F8',
    fontSize: 50,
    fontWeight: '900',
    lineHeight: 36,
    letterSpacing: 3,
    textAlign: 'center',
  },
  cameraButton: {
    position: 'absolute',
    right: 27,
    bottom: 8,
    width: 52,
    height: 52,
    backgroundColor: '#F5F5F5',
    borderRadius: 26,
    borderWidth: 5,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
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
  locationText: {
    color: '#081122',
    fontSize: 16,
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 46,
    paddingVertical: 20,
    gap: 35,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: '#455154',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 28,
  },
  statLabel: {
    color: '#081122',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 0.33,
    borderTopColor: '#D0D1D3',
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    position: 'relative',
  },
  activeTab: {
    // Active tab styling
  },

  tabText: {
    fontSize: 10,
    fontWeight: '400',
    color: '#D7D7D9',
    letterSpacing: 0.15,
  },
  activeTabText: {
    color: '#211A2C',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 48,
    height: 2,
    backgroundColor: '#161722',
  },
  contentContainer: {
    flex: 1,
  },
  membersContainer: {
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 20,
  },
  memberAvatar: {
    width: 47,
    height: 47,
    borderRadius: 23.5,
    borderWidth: 1,
    borderColor: '#060606',
  },
  onlineIndicator: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: 'white',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    color: 'black',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    marginBottom: 2,
  },
  memberRank: {
    color: 'rgba(0, 0, 0, 0.50)',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  joinDate: {
    color: 'black',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'right',
  },
  challengesContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  challengesList: {
    flex: 1,
    paddingTop: 8,
  },
  tournamentsContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  rankingContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  subTabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingHorizontal: 20,
  },
  subTab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: 'relative',
  },
  activeSubTab: {
    // Active styling handled by indicator
  },
  subTabText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#999',
  },
  activeSubTabText: {
    color: '#0A5C6D',
    fontWeight: '600',
  },
  subTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: '#0A5C6D',
  },
  tournamentsList: {
    flex: 1,
    paddingTop: 16,
  },
  tournamentContent: {
    paddingHorizontal: 16,
  },
  rankingList: {
    flex: 1,
    paddingTop: 16,
  },
});