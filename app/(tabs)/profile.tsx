import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ImageBackground,
  Alert,
  Text,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeft, 
  MoreHorizontal,
  Crown,
  Star,
  TrendingUp,
  Gamepad2,
  Calendar,
  Users,
  DollarSign
} from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { 
  ProfileCard, 
  StatsRow, 
  TabNavigation, 
  ProfileTournamentList 
} from '@/components/shared';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'ready' | 'live' | 'done'>('ready');
  
  const profileQuery = trpc.user.getProfile.useQuery({});
  const tournamentsQuery = trpc.tournaments.list.useQuery({ 
    status: activeTab === 'ready' ? 'upcoming' : activeTab === 'live' ? 'live' : 'completed'
  });
  
  const user = profileQuery.data;
  
  const handleEditProfile = () => {
    // Temporary placeholder for edit profile navigation
    console.log('Edit profile pressed');
  };
  
  const handleBack = () => {
    router.back();
  };
  
  const handleMoreOptions = () => {
    Alert.alert(
      'Tùy chọn',
      'Chọn hành động',
      [
        { text: 'Tìm bạn', onPress: () => console.log('Find friends') },
        { text: 'Cài đặt', onPress: () => console.log('Settings') },
        { text: 'Đăng xuất', style: 'destructive', onPress: () => console.log('Logout') },
        { text: 'Hủy', style: 'cancel' }
      ]
    );
  };
  
  if (profileQuery.isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0A5C6D" />
        <Text style={{ marginTop: 16, color: '#666' }}>Đang tải hồ sơ...</Text>
      </View>
    );
  }
  
  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#666' }}>Không thể tải hồ sơ</Text>
      </View>
    );
  }

  const tournaments = [
    {
      id: 1,
      name: 'SABO POOL 8 BALL',
      date: '07/09 - Thứ 7',
      rankRange: 'K - I+',
      players: '0/16',
      prize: '10 Million',
      lives: '2 Mạng'
    },
    {
      id: 2,
      name: 'SABO POOL 8 BALL',
      date: '07/09 - Thứ 7',
      rankRange: 'K - I+',
      players: '0/16',
      prize: '10 Million',
      lives: '2 Mạng'
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#161722" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user.username}</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleMoreOptions}>
          <MoreHorizontal size={24} color="#161722" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <ProfileCard 
          imageUrl={user.avatar}
          name={user.displayName}
          showEditButton={true}
          onEditPress={handleEditProfile}
          size="large"
          style={styles.profileCard}
        />

          {/* Rank Badge */}
          <View style={styles.rankBadge}>
            <View style={styles.rankIcon}>
              <Crown size={14} color="#19127B" />
            </View>
            <Text style={styles.rankText}>RANK : {user.rank}</Text>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Crown size={16} color="#081122" />
              <Text style={styles.statLabel}>ELO</Text>
              <Text style={styles.statValue}>{user.elo}</Text>
            </View>
            <View style={styles.statItem}>
              <Star size={18} color="#081122" />
              <Text style={styles.statLabel}>SPA</Text>
              <Text style={styles.statValue}>{user.spa}</Text>
            </View>
            <View style={styles.statItem}>
              <TrendingUp size={18} color="#081122" />
              <Text style={styles.statLabel}>XH</Text>
              <Text style={styles.statValue}>#{user.ranking}</Text>
            </View>
            <View style={styles.statItem}>
              <Gamepad2 size={16} color="#081122" />
              <Text style={styles.statLabel}>TRẬN</Text>
              <Text style={styles.statValue}>{user.matches}</Text>
            </View>
          </View>

        {/* Tournament List */}
        <ProfileTournamentList 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tournaments={tournamentsQuery.data?.tournaments || []}
          isLoading={tournamentsQuery.isLoading}
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 0.33,
    borderBottomColor: '#D0D1D3',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#161722',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: 'white',
    marginHorizontal: -4,
    marginTop: 0,
    paddingBottom: 20,
    borderBottomWidth: 0.33,
    borderBottomColor: '#D0D1D3',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 20,
    position: 'relative',
  },
  gradientBorder: {
    width: 350,
    height: 350,
    borderRadius: 18,
    padding: 2,
    shadowColor: 'rgba(255, 255, 255, 0.10)',
    shadowOffset: {
      width: 0,
      height: 2.5,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileImageWrapper: {
    width: 346,
    height: 346,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  profileImageStyle: {
    borderRadius: 16,
  },
  profileOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  profileName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#A0B2F8',
    letterSpacing: 3,
    textAlign: 'center',
    lineHeight: 36,
  },
  editProfileButton: {
    position: 'absolute',
    right: 32,
    bottom: -10,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F5F5F5',
    borderWidth: 5,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(35.89, 25.99, 91.95, 0.15)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1B1B50',
    paddingHorizontal: 25,
    paddingVertical: 7,
    alignSelf: 'center',
    marginBottom: 20,
    gap: 8,
  },
  rankIcon: {
    width: 14,
    height: 14,
  },
  rankText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#19127B',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 28,
    gap: 57,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#081122',
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#455154',
  },
  tabsContainer: {
    backgroundColor: 'white',
    marginTop: 8,
  },
  tabsHeader: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 0.33,
    borderBottomColor: '#D0D1D3',
    paddingHorizontal: 26,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0A5C6D',
  },
  tabText: {
    fontSize: 17,
    color: '#D7D7D9',
  },
  activeTabText: {
    color: '#0A5C6D',
  },
  tournamentList: {
    padding: 20,
    gap: 16,
  },
  tournamentCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.07)',
  },
  tournamentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#000',
  },
  tournamentNumber: {
    fontSize: 12,
    fontWeight: '400',
    color: 'black',
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#0A5C6D',
    marginBottom: 4,
  },
  tournamentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tournamentDate: {
    fontSize: 10,
    color: '#0A5C6D',
  },
  tournamentMeta: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  tournamentRank: {
    fontSize: 12,
    color: '#0A5C6D',
    marginBottom: 8,
  },
  tournamentStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tournamentPlayers: {
    fontSize: 10,
    color: '#801515',
    marginRight: 8,
  },
  tournamentPrize: {
    fontSize: 10,
    color: '#801515',
  },
  tournamentAction: {
    alignItems: 'center',
  },
  tournamentLives: {
    fontSize: 10,
    color: '#0A5C6D',
    marginBottom: 8,
  },
  joinButton: {
    width: 45,
    height: 22,
    backgroundColor: '#7F1516',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.11,
    shadowRadius: 8,
    elevation: 4,
  },
  joinIcon: {
    width: 11,
    height: 8,
    backgroundColor: 'white',
    borderRadius: 1,
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
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});