import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  Search,
  MapPin,
  Users,
  Trophy,
  Clock,
  DollarSign,
  TrendingUp,
  Heart,
  MessageCircle,
  Share,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useCurrentUser, useTournaments, useSocialFeed } from '@/providers/SABODataProvider';
import { formatCurrency, formatNumber, getTimeAgo, getRankByElo } from '@/types/sabo';
import type { Activity, Tournament } from '@/types/sabo';



export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { currentUser } = useCurrentUser();
  const { tournaments, isLoading: isLoadingTournaments, joinTournament, isJoining } = useTournaments();
  const { activities, isLoading: isLoadingActivities, likeActivity, isLiking } = useSocialFeed();


  const handleJoinTournament = (tournamentId: string) => {
    console.log('Joining tournament:', tournamentId);
    joinTournament(tournamentId);
  };

  const handleLikeActivity = (activityId: string, isLiked: boolean) => {
    console.log('Toggling like for activity:', activityId);
    likeActivity({ activityId, isLiked });
  };

  const renderActivityCard = (activity: Activity) => {
    const rank = getRankByElo(activity.user.elo);
    
    return (
      <TouchableOpacity key={activity.id} style={styles.playerCard}>
        <View style={styles.playerHeader}>
          <Image source={{ uri: activity.user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }} style={styles.avatar} />
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{activity.user.name}</Text>
            <View style={styles.rankContainer}>
              <Text style={[styles.rankIcon, { color: rank.color }]}>{rank.icon}</Text>
              <Text style={[styles.rank, { color: rank.color }]}>{rank.name}</Text>
              <Text style={styles.elo}>ELO: {activity.user.elo}</Text>
            </View>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{getTimeAgo(activity.created_at)}</Text>
          </View>
        </View>
        
        <Text style={styles.activity}>{activity.title}</Text>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{activity.user.total_matches}</Text>
            <Text style={styles.statLabel}>TRẬN</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{formatNumber(activity.user.spa_points)}</Text>
            <Text style={styles.statLabel}>SPA</Text>
          </View>
        </View>
        
        <View style={styles.socialActions}>
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => handleLikeActivity(activity.id, activity.is_liked)}
            disabled={isLiking}
          >
            <Heart 
              size={20} 
              color={activity.is_liked ? Colors.light.tint : Colors.light.placeholder}
              fill={activity.is_liked ? Colors.light.tint : 'transparent'}
            />
            <Text style={[styles.socialText, activity.is_liked && { color: Colors.light.tint }]}>
              {activity.likes_count} Thích
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <MessageCircle size={20} color={Colors.light.placeholder} />
            <Text style={styles.socialText}>{activity.comments_count} Bình luận</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Share size={20} color={Colors.light.placeholder} />
            <Text style={styles.socialText}>Chia sẻ</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTournamentCard = (tournament: Tournament) => {
    const startTime = new Date(tournament.start_time);
    const endTime = new Date(tournament.end_time);
    const timeRange = `${startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
    const remainingSlots = tournament.max_players - tournament.current_players;
    
    return (
      <TouchableOpacity key={tournament.id} style={styles.tournamentCard}>
        <Image source={{ uri: tournament.image_url || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop' }} style={styles.tournamentImage} />
        <View style={styles.tournamentContent}>
          <Text style={styles.tournamentTitle}>{tournament.title}</Text>
          
          <View style={styles.prizeContainer}>
            <Trophy size={16} color={Colors.sabo.secondary[500]} />
            <Text style={styles.prizeText}>{formatCurrency(tournament.prize_pool)}</Text>
          </View>
          
          <View style={styles.tournamentDetails}>
            <View style={styles.detailRow}>
              <Users size={14} color={Colors.light.placeholder} />
              <Text style={styles.detailText}>{tournament.current_players}/{tournament.max_players} người • còn {remainingSlots} chỗ</Text>
            </View>
            
            <View style={styles.detailRow}>
              <TrendingUp size={14} color={Colors.light.placeholder} />
              <Text style={styles.detailText}>{tournament.min_rank} → {tournament.max_rank}+</Text>
            </View>
            
            <View style={styles.detailRow}>
              <DollarSign size={14} color={Colors.light.placeholder} />
              <Text style={styles.detailText}>{formatCurrency(tournament.entry_fee)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <MapPin size={14} color={Colors.light.placeholder} />
              <Text style={styles.detailText}>{tournament.location}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Clock size={14} color={Colors.light.placeholder} />
              <Text style={styles.detailText}>{timeRange}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.joinButton, isJoining && styles.joinButtonDisabled]}
            onPress={() => handleJoinTournament(tournament.id)}
            disabled={isJoining}
          >
            {isJoining ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.joinButtonText}>Tham gia ngay</Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (!currentUser) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]} 
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Chào mừng trở lại, {currentUser.name}!</Text>
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
          <Text style={styles.statValue}>{currentUser.elo.toLocaleString()}</Text>
          <Text style={styles.statLabel}>ELO Rating</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{formatNumber(currentUser.spa_points)}</Text>
          <Text style={styles.statLabel}>SPA Points</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>#{currentUser.ranking_position}</Text>
          <Text style={styles.statLabel}>Xếp hạng</Text>
        </View>
      </View>

      {/* Social Feed */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
        {isLoadingActivities ? (
          <View style={styles.loadingSection}>
            <ActivityIndicator size="small" color={Colors.light.tint} />
            <Text style={styles.loadingText}>Đang tải hoạt động...</Text>
          </View>
        ) : (
          activities.map(renderActivityCard)
        )}
      </View>

      {/* Tournaments */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Giải đấu nổi bật</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        {isLoadingTournaments ? (
          <View style={styles.loadingSection}>
            <ActivityIndicator size="small" color={Colors.light.tint} />
            <Text style={styles.loadingText}>Đang tải giải đấu...</Text>
          </View>
        ) : (
          tournaments.map(renderTournamentCard)
        )}
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.light.placeholder,
  },
  rankIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 12,
    color: Colors.light.placeholder,
  },
  activityDescription: {
    fontSize: 12,
    color: Colors.light.placeholder,
    marginBottom: 12,
  },
  joinButtonDisabled: {
    opacity: 0.6,
  },
});