import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert 
} from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { trpc } from '@/lib/trpc';
import { 
  UniversalTabs,
  ChallengesList,
  ChallengeActions
} from '@/components/shared';
import { AppHeader } from '@/components/layout';
import { Users, Trophy, X, Search, Plus, Filter, MapPin, Clock, Zap } from 'lucide-react-native';
import { getChallengesByStatus, type Challenge } from '@/lib/demo-data/challenges-data';

export default function ChallengesScreen() {
  const [mainTab, setMainTab] = useState<'giaoluu' | 'thachdau'>('thachdau');
  const [activeTab, setActiveTab] = useState<'waiting' | 'live' | 'finished'>('waiting');
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();

  // TRPC queries with correct mapping
  const challengesQuery = trpc.challenges.list.useQuery({ 
    type: mainTab, // 'giaoluu' | 'thachdau' based on main tab selection
    status: activeTab, // 'waiting' | 'live' | 'finished' for sub-tab
    limit: 10 
  });
  
  const joinChallengeMutation = trpc.challenges.join?.useMutation({
    onSuccess: () => {
      Alert.alert('Thành công', 'Đã tham gia thách đấu!');
      challengesQuery.refetch();
    },
    onError: (error: any) => {
      Alert.alert('Lỗi', error.message || 'Không thể tham gia thách đấu');
    }
  });

  const handleJoinChallenge = (challengeId: string) => {
    if (joinChallengeMutation) {
      joinChallengeMutation.mutate({ challengeId });
    } else {
      Alert.alert('Thành công', 'Đã tham gia thách đấu!');
    }
  };
  
  const handleViewLive = (challengeId: string) => {
    Alert.alert('Xem Live', `Đang xem trận đấu ${challengeId}`);
  };

  const handleBack = () => {
    // Navigation back logic
  };

  const handleMore = () => {
    Alert.alert('Tùy chọn', 'Hiển thị thêm tùy chọn');
  };

  // Define tabs for UniversalTabs
  const challengeTabs = [
    { key: 'waiting', label: 'Chờ đối', icon: Users },
    { key: 'live', label: 'Lên xe', icon: Trophy },
    { key: 'finished', label: 'Đã xong', icon: X },
  ];

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey as 'waiting' | 'live' | 'finished');
  };

  // Use real data or fallback to mock data
  const challengesData = challengesQuery.data || getChallengesByStatus(activeTab);
  const challenges = Array.isArray(challengesData) ? challengesData : challengesData.challenges || [];
  
  // Handle loading and error states
  const isLoading = challengesQuery.isLoading;
  const hasError = challengesQuery.error;

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'SABO',
          headerTitleAlign: 'left',
          headerStyle: {
            backgroundColor: '#F8F9FA',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: '900',
            color: '#7B5CF6',
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
      
      {/* Main Tab Navigation - Giao lưu vs Thách đấu */}
      <View style={styles.mainTabContainer}>
        <TouchableOpacity 
          style={[styles.mainTab, mainTab === 'giaoluu' && styles.activeMainTab]}
          onPress={() => setMainTab('giaoluu')}
        >
          <Text style={[
            styles.mainTabText, 
            mainTab === 'giaoluu' && styles.activeMainTabText
          ]}>
            Giao lưu
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
            Thách đấu
          </Text>
          {mainTab === 'thachdau' && <View style={styles.mainTabIndicator} />}
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop' }}
              style={styles.profileImage}
            />
            <View style={styles.profileOverlay}>
              <Text style={styles.displayName}>Chưa đặt Display Name</Text>
            </View>
          </View>
          
          <View style={styles.profileInfo}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>RANK: K</Text>
            </View>
            <View style={styles.spaInfo}>
              <Text style={styles.spaDate}>T7 - 06/09</Text>
              <Text style={styles.spaTime}>19:00</Text>
              <View style={styles.spaPoints}>
                <View style={styles.spaIcon} />
                <Text style={styles.spaText}>100 SPA</Text>
              </View>
              <Text style={styles.raceFormat}>Race to 7</Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Users size={20} color="#64748B" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Chơi luôn</Text>
              <Text style={styles.statValue}>328.7K</Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
              <View style={styles.heartIcon} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Clock size={20} color="#64748B" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Lên lịch</Text>
              <Text style={styles.statValue}>578</Text>
            </View>
            <TouchableOpacity style={styles.messageButton}>
              <View style={styles.messageIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Club Info */}
        <View style={styles.clubInfo}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=60&h=60&fit=crop' }}
            style={styles.clubAvatar}
          />
          <View style={styles.clubDetails}>
            <Text style={styles.clubName}>SABO Billiards</Text>
            <Text style={styles.clubLocation}>Vũng tàu</Text>
            <Text style={styles.searchHashtag}>@longsang</Text>
            <Text style={styles.searchText}>Tìm đối tôi nay</Text>
            <Text style={styles.hashtag}>#sabo</Text>
          </View>
          <View style={styles.clubActions}>
            <TouchableOpacity style={styles.clubActionButton}>
              <View style={styles.userIcon} />
              <Text style={styles.clubMemberCount}>99</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Content based on main tab */}
      {mainTab === 'giaoluu' ? (
        // Giao Lưu Content - Friendly matches, no SPA betting
        <View style={styles.tabContent}>
          <View style={styles.tabDescription}>
            <Text style={styles.tabDescText}>🤝 Giao lưu - Chơi thân thiện, không cược điểm</Text>
          </View>
          <UniversalTabs 
            tabs={challengeTabs} 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
            variant="underline" 
          />
          <ScrollView style={styles.challengeContent}>
            <ChallengesList 
              challenges={challenges as Challenge[]}
              onJoinChallenge={handleJoinChallenge}
              onViewLive={handleViewLive}
            />
          </ScrollView>
        </View>
      ) : (
        // Thách Đấu Content - Competitive matches with SPA betting
        <View style={styles.tabContent}>
          <View style={styles.tabDescription}>
            <Text style={styles.tabDescText}>⚔️ Thách đấu - Có cược điểm SPA</Text>
          </View>
          
          {/* Create Challenge Button */}
          <TouchableOpacity 
            style={styles.createChallengeButton}
            onPress={() => Alert.alert('Tạo thách đấu', 'Tạo thách đấu mới với cược SPA')}
          >
            <Plus size={20} color="white" />
            <Text style={styles.createChallengeText}>Tạo thách đấu mới</Text>
          </TouchableOpacity>
          
          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>328.7K</Text>
              <Text style={styles.quickStatLabel}>Chơi luôn</Text>
            </View>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>578</Text>
              <Text style={styles.quickStatLabel}>Lên lịch</Text>
            </View>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>100</Text>
              <Text style={styles.quickStatLabel}>SPA Points</Text>
            </View>
          </View>
          
          {/* Search & Filter */}
          <View style={styles.searchSection}>
            <View style={styles.searchInputContainer}>
              <Search size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm đối theo rank, SPA points..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            {/* Filter Chips */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filterChips}
            >
              <TouchableOpacity style={[styles.filterChip, styles.activeChip]}>
                <Text style={[styles.filterChipText, styles.activeChipText]}>Tất cả</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <Trophy size={12} color="#F59E0B" />
                <Text style={styles.filterChipText}>Rank K+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <Zap size={12} color="#EF4444" />
                <Text style={styles.filterChipText}>High SPA</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <Clock size={12} color="#8B5CF6" />
                <Text style={styles.filterChipText}>Race to 7</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <MapPin size={12} color="#10B981" />
                <Text style={styles.filterChipText}>Gần tôi</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          
          <UniversalTabs 
            tabs={challengeTabs} 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
            variant="underline" 
          />
          <ScrollView style={styles.challengeContent}>
            <ChallengesList 
              challenges={challenges as Challenge[]}
              onJoinChallenge={handleJoinChallenge}
              onViewLive={handleViewLive}
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  // Header styles
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
  notificationIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#64748B',
    borderRadius: 2,
  },
  chatIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#64748B',
    borderRadius: 10,
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
  
  // Tab content styles
  tabContent: {
    flex: 1,
  },
  tabDescription: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tabDescText: {
    fontSize: 14,
    color: '#64748B',
    fontStyle: 'italic',
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
  
  // Quick stats
  quickStats: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1D29',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  
  // Search section
  searchSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1D29',
    padding: 0,
  },
  
  // Filter chips
  filterChips: {
    marginBottom: 8,
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
  activeChip: {
    backgroundColor: '#7B5CF6',
    borderColor: '#7B5CF6',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  activeChipText: {
    color: 'white',
  },

  
  // Content styles
  scrollView: {
    flex: 1,
  },
  challengeContent: {
    flex: 1,
    paddingTop: 8,
  },
  
  listContainer: {
    paddingBottom: 20,
  },
});