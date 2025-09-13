import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  Search,
  MapPin,
  Users,
  Trophy,
  Star,
  Clock,
  DollarSign,
  TrendingUp,
  Heart,
  MessageCircle,
  Share,
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface PlayerProfile {
  id: string;
  name: string;
  avatar: string;
  rank: string;
  elo: number;
  activity: string;
  stats: {
    matches: number;
    scheduled: number;
  };
}

interface Tournament {
  id: string;
  title: string;
  prize: string;
  totalPrize: string;
  players: string;
  maxPlayers: number;
  rankRequirement: string;
  entryFee: string;
  location: string;
  time: string;
  image: string;
}

const mockPlayers: PlayerProfile[] = [
  {
    id: '1',
    name: 'Anh Long Magic',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rank: 'Master',
    elo: 1485,
    activity: '328.7K chơi luôn',
    stats: { matches: 37, scheduled: 578 },
  },
  {
    id: '2',
    name: 'Minh Tuấn Pro',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rank: 'Expert',
    elo: 1320,
    activity: '156.2K thách đấu',
    stats: { matches: 42, scheduled: 234 },
  },
];

const mockTournaments: Tournament[] = [
  {
    id: '1',
    title: 'SABO Championship 2024',
    prize: '2 Mạng',
    totalPrize: '10.000.000đ',
    players: '0/16 người',
    maxPlayers: 16,
    rankRequirement: 'K → G+',
    entryFee: '300.000đ',
    location: 'CLB Sao Mai, Q1',
    time: '15:00 - 18:00',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
  },
  {
    id: '2',
    title: 'Weekly Masters Cup',
    prize: '1 Mạng',
    totalPrize: '5.000.000đ',
    players: '8/12 người',
    maxPlayers: 12,
    rankRequirement: 'E → M+',
    entryFee: '200.000đ',
    location: 'CLB Hoàng Gia, Q3',
    time: '19:00 - 22:00',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=200&fit=crop',
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const renderPlayerCard = (player: PlayerProfile) => (
    <TouchableOpacity key={player.id} style={styles.playerCard}>
      <View style={styles.playerHeader}>
        <Image source={{ uri: player.avatar }} style={styles.avatar} />
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{player.name}</Text>
          <View style={styles.rankContainer}>
            <Star size={14} color={Colors.sabo.secondary[500]} fill={Colors.sabo.secondary[500]} />
            <Text style={styles.rank}>{player.rank}</Text>
            <Text style={styles.elo}>ELO: {player.elo}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followText}>Theo dõi</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.activity}>{player.activity}</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{player.stats.matches}</Text>
          <Text style={styles.statLabel}>TRẬN</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{player.stats.scheduled}</Text>
          <Text style={styles.statLabel}>lên lịch</Text>
        </View>
      </View>
      
      <View style={styles.socialActions}>
        <TouchableOpacity style={styles.socialButton}>
          <Heart size={20} color={Colors.light.placeholder} />
          <Text style={styles.socialText}>Thích</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <MessageCircle size={20} color={Colors.light.placeholder} />
          <Text style={styles.socialText}>Bình luận</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Share size={20} color={Colors.light.placeholder} />
          <Text style={styles.socialText}>Chia sẻ</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderTournamentCard = (tournament: Tournament) => (
    <TouchableOpacity key={tournament.id} style={styles.tournamentCard}>
      <Image source={{ uri: tournament.image }} style={styles.tournamentImage} />
      <View style={styles.tournamentContent}>
        <Text style={styles.tournamentTitle}>{tournament.title}</Text>
        
        <View style={styles.prizeContainer}>
          <Trophy size={16} color={Colors.sabo.secondary[500]} />
          <Text style={styles.prizeText}>{tournament.prize} • {tournament.totalPrize}</Text>
        </View>
        
        <View style={styles.tournamentDetails}>
          <View style={styles.detailRow}>
            <Users size={14} color={Colors.light.placeholder} />
            <Text style={styles.detailText}>{tournament.players} • còn {tournament.maxPlayers - parseInt(tournament.players.split('/')[0])} chỗ</Text>
          </View>
          
          <View style={styles.detailRow}>
            <TrendingUp size={14} color={Colors.light.placeholder} />
            <Text style={styles.detailText}>{tournament.rankRequirement}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <DollarSign size={14} color={Colors.light.placeholder} />
            <Text style={styles.detailText}>{tournament.entryFee}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MapPin size={14} color={Colors.light.placeholder} />
            <Text style={styles.detailText}>{tournament.location}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Clock size={14} color={Colors.light.placeholder} />
            <Text style={styles.detailText}>{tournament.time}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Tham gia ngay</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]} 
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Chào mừng trở lại!</Text>
          <Text style={styles.appName}>SABO Arena</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>1,485</Text>
          <Text style={styles.statLabel}>ELO Rating</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>320</Text>
          <Text style={styles.statLabel}>SPA Points</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>#89</Text>
          <Text style={styles.statLabel}>Xếp hạng</Text>
        </View>
      </View>

      {/* Social Feed */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
        {mockPlayers.map(renderPlayerCard)}
      </View>

      {/* Tournaments */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Giải đấu nổi bật</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        {mockTournaments.map(renderTournamentCard)}
      </View>

      {/* Club Discovery */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tìm CLB gần bạn</Text>
        <TouchableOpacity style={styles.discoveryCard}>
          <MapPin size={24} color={Colors.sabo.club} />
          <Text style={styles.discoveryText}>Khám phá các câu lạc bộ trong khu vực</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: Colors.light.placeholder,
    marginBottom: 2,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  quickStats: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.placeholder,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.light.tint,
    fontWeight: '600',
  },
  playerCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rank: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.sabo.secondary[600],
  },
  elo: {
    fontSize: 12,
    color: Colors.light.placeholder,
    marginLeft: 8,
  },
  followButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  activity: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  socialActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  socialText: {
    fontSize: 12,
    color: Colors.light.placeholder,
  },
  tournamentCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  tournamentImage: {
    width: '100%',
    height: 120,
  },
  tournamentContent: {
    padding: 16,
  },
  tournamentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  prizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  prizeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.sabo.secondary[600],
  },
  tournamentDetails: {
    gap: 6,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: Colors.light.placeholder,
  },
  joinButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  discoveryCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  discoveryText: {
    fontSize: 14,
    color: Colors.light.text,
    marginTop: 8,
    textAlign: 'center',
  },
});