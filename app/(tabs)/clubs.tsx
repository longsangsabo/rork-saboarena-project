import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { router } from 'expo-router';
import { MapPin, Camera, Trophy, Users, Target, BarChart3, X, Search, Settings, Bell, MessageCircle } from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { useTheme } from '@/providers/ThemeProvider';
import { 
  UniversalTabs,
  ClubCard, 
  MemberList, 
  TournamentCard,
  RankingCard
} from '@/components/shared';
import ChallengeCard from '@/components/challenges/ChallengeCard';
import { getChallengesByStatus } from '@/lib/demo-data/challenges-data';
import { useAuth } from '@/contexts/AuthContext';

export default function ClubsScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const [mainTab, setMainTab] = useState<'clb' | 'discover'>('clb');
  const [activeTab, setActiveTab] = useState<'members' | 'tournaments' | 'ranking' | 'challenges'>('members');
  const [tournamentTab, setTournamentTab] = useState<'ready' | 'live' | 'done'>('ready');
  const [rankingTab, setRankingTab] = useState<'prizepool' | 'elo' | 'spa'>('prizepool');
  const [challengeTab, setChallengeTab] = useState<'waiting' | 'live' | 'finished'>('waiting');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClubId, setSelectedClubId] = useState<string>('1'); // Dynamic club selection

  // Define tabs for UniversalTabs
  const challengeTabs = [
    { key: 'waiting', label: 'Chờ đối', icon: Users },
    { key: 'live', label: 'Lên xe', icon: Trophy },
    { key: 'finished', label: 'Đã xong', icon: X },
  ];

  const handleChallengeTabChange = (tabKey: string) => {
    setChallengeTab(tabKey as 'waiting' | 'live' | 'finished');
  };
  
  // TRPC queries for real data
  const clubsQuery = trpc.clubs.list.useQuery({ limit: 10 });
  const membersQuery = trpc.clubs.getMembers.useQuery({ 
    clubId: selectedClubId // Use dynamic club ID
  });
  
  // Use real data or fallback to mock data
  const mockClub = {
    id: "1",
    name: "SABO Billiards",
    location: "Vũng Tàu",
    memberCount: 24,
    member_count: 24,
    tournament_count: 12,
    prize_pool: 5500000,
    challenge_count: 8,
    avatar: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=100&h=100&fit=crop",
    cover_image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop"
  };
  
  // Mock data for find opponent
  const mockClubs = [
    {
      id: "1",
      name: "SABO Billiards",
      location: "Vũng Tàu",
      member_count: 24,
      tournament_count: 12,
      prize_pool: 5500000,
      challenge_count: 8,
      cover_image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop"
    },
    {
      id: "2", 
      name: "Billiards Champion",
      location: "TP.HCM",
      member_count: 45,
      tournament_count: 18,
      prize_pool: 8200000,
      challenge_count: 15,
      cover_image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=200&fit=crop"
    },
    {
      id: "3",
      name: "Golden Cue Club", 
      location: "Hà Nội",
      member_count: 32,
      tournament_count: 8,
      prize_pool: 4100000,
      challenge_count: 12,
      cover_image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop"
    },
    {
      id: "4",
      name: "Elite Billiards",
      location: "Đà Nẵng", 
      member_count: 28,
      tournament_count: 15,
      prize_pool: 6300000,
      challenge_count: 6,
      cover_image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=200&fit=crop"
    },
    {
      id: "5",
      name: "Pro Cue Arena",
      location: "Cần Thơ",
      member_count: 19,
      tournament_count: 7,
      prize_pool: 3800000,
      challenge_count: 9,
      cover_image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=200&fit=crop"
    }
  ];
  
  const clubs = clubsQuery.data?.clubs || mockClubs;
  const club = clubs[0] || mockClub;
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
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0A5C6D" />
        <Text style={styles.loadingText}>Đang tải thông tin club...</Text>
      </View>
    );
  }
  
  if (!club) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Không thể tải thông tin club</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'SABO Clubs',
          headerTitleAlign: 'left',
          headerStyle: {
            backgroundColor: '#F8F9FA',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#E9ECEF',
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '700',
            color: '#1A1D29',
          },
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity 
                style={styles.headerIconButton}
                onPress={() => Alert.alert('Search', 'Tính năng tìm kiếm sẽ có sớm!')}
              >
                <Search size={20} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerIconButton}
                onPress={() => Alert.alert('Notifications', 'Bạn không có thông báo mới')}
              >
                <Bell size={20} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerIconButton}
                onPress={handleMoreOptions}
              >
                <Settings size={20} color="#64748B" />
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
          <Text style={[
            styles.mainTabText, 
            mainTab === 'clb' && styles.activeMainTabText
          ]}>
            CLB
          </Text>
          {mainTab === 'clb' && <View style={styles.mainTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.mainTab, mainTab === 'discover' && styles.activeMainTab]}
          onPress={() => setMainTab('discover')}
        >
          <Text style={[
            styles.mainTabText, 
            mainTab === 'discover' && styles.activeMainTabText
          ]}>
            Khám phá
          </Text>
          {mainTab === 'discover' && <View style={styles.mainTabIndicator} />}
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {mainTab === 'discover' ? (
          // Enhanced Discover Clubs Tab Content
          <View style={styles.discoverContent}>
            {/* Search and Filter Section */}
            <View style={styles.discoverHeader}>
              <View style={styles.searchFilterContainer}>
                <View style={styles.searchInputContainer}>
                  <Search size={16} color="#94A3B8" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm club, vị trí..."
                    placeholderTextColor="#94A3B8"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
                <TouchableOpacity 
                  style={styles.filterButton}
                  onPress={() => Alert.alert('Filter', 'Tính năng lọc sẽ có sớm!')}
                >
                  <BarChart3 size={16} color="#0A5C6D" />
                </TouchableOpacity>
              </View>
              
              {/* Quick Filter Chips */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.filterChipsContainer}
              >
                <TouchableOpacity style={[styles.filterChip, styles.activeFilterChip]}>
                  <Text style={[styles.filterChipText, styles.activeFilterChipText]}>
                    Tất cả
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChip}>
                  <MapPin size={12} color="#64748B" />
                  <Text style={styles.filterChipText}>Gần tôi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChip}>
                  <Users size={12} color="#64748B" />
                  <Text style={styles.filterChipText}>Đông người</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChip}>
                  <Trophy size={12} color="#64748B" />
                  <Text style={styles.filterChipText}>Có giải đấu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterChip}>
                  <Target size={12} color="#64748B" />
                  <Text style={styles.filterChipText}>Thách đấu</Text>
                </TouchableOpacity>
              </ScrollView>
              
              {/* Results Count */}
              <Text style={styles.resultsCount}>
                Tìm thấy {clubs.length} club
              </Text>
            </View>

            {/* Clubs List */}
            <View style={styles.clubsListContainer}>
              {clubsQuery.isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#0A5C6D" />
                  <Text style={styles.loadingText}>Đang tải danh sách club...</Text>
                </View>
              ) : clubs.length > 0 ? (
                clubs.map((clubItem: any) => (
                  <View key={clubItem.id} style={styles.enhancedClubCard}>
                    <Image 
                      source={{ uri: clubItem.cover_image }}
                      style={styles.clubCardImage}
                    />
                    <View style={styles.clubCardContent}>
                      <View style={styles.clubCardHeader}>
                        <Text style={styles.clubCardName}>{clubItem.name}</Text>
                        <View style={styles.clubCardLocation}>
                          <MapPin size={12} color="#64748B" />
                          <Text style={styles.clubCardLocationText}>{clubItem.location}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.clubCardStats}>
                        <View style={styles.clubCardStat}>
                          <Users size={14} color="#0A5C6D" />
                          <Text style={styles.clubCardStatText}>{clubItem.member_count}</Text>
                        </View>
                        <View style={styles.clubCardStat}>
                          <Trophy size={14} color="#F59E0B" />
                          <Text style={styles.clubCardStatText}>{clubItem.tournament_count}</Text>
                        </View>
                        <View style={styles.clubCardStat}>
                          <Target size={14} color="#EF4444" />
                          <Text style={styles.clubCardStatText}>{clubItem.challenge_count}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.clubCardActions}>
                        <TouchableOpacity 
                          style={styles.clubCardActionSecondary}
                          onPress={() => Alert.alert('Xem chi tiết', `Xem thông tin club ${clubItem.name}`)}
                        >
                          <Text style={styles.clubCardActionSecondaryText}>Xem chi tiết</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.clubCardActionPrimary}
                          onPress={() => Alert.alert('Tham gia', `Gửi yêu cầu tham gia ${clubItem.name}`)}
                        >
                          <Text style={styles.clubCardActionPrimaryText}>Tham gia</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Không tìm thấy club nào</Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          // CLB Tab Content
          <View style={styles.clubContent}>
            {/* Compact Club Info Header */}
            <View style={styles.compactClubHeader}>
              <View style={styles.clubAvatarSection}>
                <Image 
                  source={{ uri: club.cover_image }}
                  style={styles.compactClubAvatar}
                />
                <View style={styles.clubBasicInfo}>
                  <Text style={styles.clubName}>
                    {club.name}
                  </Text>
                  <View style={styles.locationInfo}>
                    <MapPin size={14} color="#64748B" />
                    <Text style={styles.locationText}>
                      {club.location}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.compactCameraButton} 
                  onPress={handleCameraPress}
                >
                  <Camera size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Compact Stats Grid */}
            <View style={styles.compactStatsContainer}>
              <View style={styles.compactStatRow}>
                <View style={styles.compactStatItem}>
                  <View style={styles.statIconContainer}>
                    <Users size={18} color="#0A5C6D" />
                  </View>
                  <View style={styles.statContent}>
                    <Text style={styles.statNumber}>
                      {club.member_count}
                    </Text>
                    <Text style={styles.statLabel}>
                      Thành viên
                    </Text>
                  </View>
                </View>
                <View style={styles.compactStatItem}>
                  <View style={styles.statIconContainer}>
                    <Trophy size={18} color="#F59E0B" />
                  </View>
                  <View style={styles.statContent}>
                    <Text style={styles.statNumber}>
                      {club.tournament_count}
                    </Text>
                    <Text style={styles.statLabel}>
                      Giải đấu
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.compactStatRow}>
                <View style={styles.compactStatItem}>
                  <View style={styles.statIconContainer}>
                    <BarChart3 size={18} color="#10B981" />
                  </View>
                  <View style={styles.statContent}>
                    <Text style={styles.statNumber}>
                      {(club.prize_pool / 1000000).toFixed(1)}M
                    </Text>
                    <Text style={styles.statLabel}>
                      Prize Pool
                    </Text>
                  </View>
                </View>
                <View style={styles.compactStatItem}>
                  <View style={styles.statIconContainer}>
                    <Target size={18} color="#EF4444" />
                  </View>
                  <View style={styles.statContent}>
                    <Text style={styles.statNumber}>
                      {club.challenge_count}
                    </Text>
                    <Text style={styles.statLabel}>
                      Thách đấu
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Enhanced Tab Navigation with Search */}
            <View style={styles.tabNavigationSection}>
              <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                  <Search size={16} color="#94A3B8" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm..."
                    placeholderTextColor="#94A3B8"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
              </View>
              
              <View style={styles.tabContainer}>
                <TouchableOpacity 
                  style={[
                    styles.enhancedTab,
                    activeTab === 'members' && styles.activeEnhancedTab
                  ]}
                  onPress={() => setActiveTab('members')}
                >
                  <Users 
                    size={18} 
                    color={activeTab === 'members' ? '#0A5C6D' : '#94A3B8'} 
                  />
                  <Text style={[
                    styles.enhancedTabText,
                    activeTab === 'members' && styles.activeEnhancedTabText
                  ]}>
                    Thành viên
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.enhancedTab,
                    activeTab === 'tournaments' && styles.activeEnhancedTab
                  ]}
                  onPress={() => setActiveTab('tournaments')}
                >
                  <Trophy 
                    size={18} 
                    color={activeTab === 'tournaments' ? '#0A5C6D' : '#94A3B8'} 
                  />
                  <Text style={[
                    styles.enhancedTabText,
                    activeTab === 'tournaments' && styles.activeEnhancedTabText
                  ]}>
                    Giải đấu
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.enhancedTab,
                    activeTab === 'ranking' && styles.activeEnhancedTab
                  ]}
                  onPress={() => setActiveTab('ranking')}
                >
                  <BarChart3 
                    size={18} 
                    color={activeTab === 'ranking' ? '#0A5C6D' : '#94A3B8'} 
                  />
                  <Text style={[
                    styles.enhancedTabText,
                    activeTab === 'ranking' && styles.activeEnhancedTabText
                  ]}>
                    Bảng xếp hạng
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.enhancedTab,
                    activeTab === 'challenges' && styles.activeEnhancedTab
                  ]}
                  onPress={() => setActiveTab('challenges')}
                >
                  <Target 
                    size={18} 
                    color={activeTab === 'challenges' ? '#0A5C6D' : '#94A3B8'} 
                  />
                  <Text style={[
                    styles.enhancedTabText,
                    activeTab === 'challenges' && styles.activeEnhancedTabText
                  ]}>
                    Thách đấu
                  </Text>
                </TouchableOpacity>
              </View>
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
                      style={[
                        styles.subTab,
                        tournamentTab === 'ready' && styles.activeSubTab
                      ]}
                      onPress={() => setTournamentTab('ready')}
                    >
                      <Text style={[
                        styles.subTabText,
                        tournamentTab === 'ready' && styles.activeSubTabText
                      ]}>
                        Ready
                      </Text>
                      {tournamentTab === 'ready' && (
                        <View style={styles.subTabIndicator} />
                      )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.subTab,
                        tournamentTab === 'live' && styles.activeSubTab
                      ]}
                      onPress={() => setTournamentTab('live')}
                    >
                      <Text style={[
                        styles.subTabText,
                        tournamentTab === 'live' && styles.activeSubTabText
                      ]}>
                        Live
                      </Text>
                      {tournamentTab === 'live' && (
                        <View style={styles.subTabIndicator} />
                      )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.subTab,
                        tournamentTab === 'done' && styles.activeSubTab
                      ]}
                      onPress={() => setTournamentTab('done')}
                    >
                      <Text style={[
                        styles.subTabText,
                        tournamentTab === 'done' && styles.activeSubTabText
                      ]}>
                        Done
                      </Text>
                      {tournamentTab === 'done' && (
                        <View style={styles.subTabIndicator} />
                      )}
                    </TouchableOpacity>
                  </View>
                  
                  <ScrollView style={styles.tournamentsList}>
                    <View style={styles.tournamentContent}>
                      <Text style={styles.emptyText}>
                        {tournamentTab === 'ready' && 'Không có giải đấu sắp diễn ra'}
                        {tournamentTab === 'live' && 'Không có giải đấu đang diễn ra'}
                        {tournamentTab === 'done' && 'Không có giải đấu đã kết thúc'}
                      </Text>
                    </View>
                  </ScrollView>
                </View>
              )}
              
              {activeTab === 'ranking' && (
                <View style={styles.rankingContainer}>
                  {/* Ranking Sub-tabs */}
                  <View style={styles.subTabContainer}>
                    <TouchableOpacity 
                      style={[
                        styles.subTab,
                        rankingTab === 'prizepool' && styles.activeSubTab
                      ]}
                      onPress={() => setRankingTab('prizepool')}
                    >
                      <Text style={[
                        styles.subTabText,
                        rankingTab === 'prizepool' && styles.activeSubTabText
                      ]}>
                        Prize Pool
                      </Text>
                      {rankingTab === 'prizepool' && (
                        <View style={styles.subTabIndicator} />
                      )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.subTab,
                        rankingTab === 'elo' && styles.activeSubTab
                      ]}
                      onPress={() => setRankingTab('elo')}
                    >
                      <Text style={[
                        styles.subTabText,
                        rankingTab === 'elo' && styles.activeSubTabText
                      ]}>
                        ELO
                      </Text>
                      {rankingTab === 'elo' && (
                        <View style={styles.subTabIndicator} />
                      )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.subTab,
                        rankingTab === 'spa' && styles.activeSubTab
                      ]}
                      onPress={() => setRankingTab('spa')}
                    >
                      <Text style={[
                        styles.subTabText,
                        rankingTab === 'spa' && styles.activeSubTabText
                      ]}>
                        SPA
                      </Text>
                      {rankingTab === 'spa' && (
                        <View style={styles.subTabIndicator} />
                      )}
                    </TouchableOpacity>
                  </View>
                  
                  <ScrollView style={styles.rankingList}>
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>
                        Bảng xếp hạng {rankingTab} sẽ có sớm
                      </Text>
                    </View>
                  </ScrollView>
                </View>
              )}
              
              {activeTab === 'challenges' && (
                <View style={styles.challengesContainer}>
                  <UniversalTabs
                    tabs={challengeTabs}
                    activeTab={challengeTab}
                    onTabChange={handleChallengeTabChange}
                  />
                  <ScrollView style={styles.challengesList}>
                    {getChallengesByStatus(challengeTab).map((challenge) => (
                      <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        onAccept={() => console.log('Accept challenge:', challenge.id)}
                        onDecline={() => console.log('Decline challenge:', challenge.id)}
                        onView={() => console.log('View challenge:', challenge.id)}
                      />
                    ))}
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
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#0A5C6D',
  },
  
  scrollView: {
    flex: 1,
  },
  
  // Enhanced Discover Clubs Styles
  discoverContent: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  discoverHeader: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchFilterContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  filterChipsContainer: {
    marginBottom: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  activeFilterChip: {
    backgroundColor: '#0A5C6D',
    borderColor: '#0A5C6D',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  activeFilterChipText: {
    color: 'white',
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  clubsListContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  enhancedClubCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  clubCardHeader: {
    marginBottom: 12,
  },
  clubCardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1D29',
    marginBottom: 4,
  },
  clubCardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clubCardLocationText: {
    fontSize: 14,
    color: '#64748B',
  },
  clubCardStats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  clubCardStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clubCardStatText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1D29',
  },
  clubCardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  clubCardActionSecondary: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
  },
  clubCardActionSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  clubCardActionPrimary: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#0A5C6D',
    alignItems: 'center',
  },
  clubCardActionPrimaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  clubContent: {
    flex: 1,
  },
  
  // Compact club header styles
  compactClubHeader: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  clubAvatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactClubAvatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  clubBasicInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1D29',
    marginBottom: 4,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  compactCameraButton: {
    width: 36,
    height: 36,
    backgroundColor: '#F8F9FA',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  
  // Compact stats styles
  compactStatsContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  compactStatRow: {
    flexDirection: 'row',
    gap: 12,
  },
  compactStatItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 10,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1D29',
    lineHeight: 20,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#64748B',
    lineHeight: 16,
    marginTop: 2,
  },
  
  // Tab navigation styles
  tabNavigationSection: {
    backgroundColor: 'white',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1D29',
    padding: 0,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 8,
  },
  enhancedTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    position: 'relative',
    gap: 4,
  },
  activeEnhancedTab: {
    // Active styling handled by colors
  },
  enhancedTabText: {
    fontSize: 10,
    fontWeight: '400',
    color: '#94A3B8',
    textAlign: 'center',
  },
  activeEnhancedTabText: {
    color: '#0A5C6D',
    fontWeight: '600',
  },
  
  // Content styles
  contentContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  membersContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  tournamentsContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  rankingContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  challengesContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  // Sub-tab styles
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
    color: '#94A3B8',
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
  
  // List styles
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
  challengesList: {
    flex: 1,
    paddingTop: 8,
  },
  
  // Empty state styles
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});