import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { 
  Trophy, 
  Users, 
  Clock, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Swords,
  X 
} from 'lucide-react-native';

// Base interfaces
interface BaseUser {
  id: string;
  name: string;
  avatar: string;
  rank?: string;
  isOnline?: boolean;
}

interface BaseCardData {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  image?: string;
}

// Specific data types
export interface RankingCardData extends BaseCardData {
  user: BaseUser & {
    value: string;
    position: number;
    trend?: 'up' | 'down' | 'same';
  };
  type: 'prizepool' | 'elo' | 'spa';
  isTopRank?: boolean;
}

export interface TournamentCardData extends BaseCardData {
  prize_pool: number;
  entry_fee: number;
  current_players: number;
  max_players: number;
  min_rank: string;
  max_rank: string;
  location: string;
  start_time: string;
  end_time: string;
  status: 'upcoming' | 'live' | 'completed';
}

export interface ChallengeCardData extends BaseCardData {
  status: 'waiting' | 'ready' | 'live' | 'finished';
  date: string;
  time: string;
  handicap: string;
  spa: number;
  raceToScore: number;
  tableNumber: number;
  player1: BaseUser;
  player2?: BaseUser;
}

export type UniversalCardData = RankingCardData | TournamentCardData | ChallengeCardData;

export interface UniversalCardProps {
  data: UniversalCardData;
  variant?: 'full' | 'compact' | 'list';
  cardType: 'ranking' | 'tournament' | 'challenge';
  onPress?: (id: string) => void;
  onAction?: (id: string, actionType: string) => void;
  isLoading?: boolean;
}

export const UniversalCard: React.FC<UniversalCardProps> = ({
  data,
  variant = 'full',
  cardType,
  onPress,
  onAction,
  isLoading = false
}) => {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)}M`;
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (status: string, type: string) => {
    if (type === 'tournament') {
      switch (status) {
        case 'upcoming': return '#0A5C6D';
        case 'live': return '#10B981';
        case 'completed': return '#666';
        default: return '#666';
      }
    } else if (type === 'challenge') {
      switch (status) {
        case 'waiting': return '#FF6B6B';
        case 'ready': return '#4ECDC4';
        case 'live': return '#8B0000';
        case 'finished': return '#95A5A6';
        default: return '#FF6B6B';
      }
    }
    return '#666';
  };

  const renderRankingCard = (rankingData: RankingCardData) => {
    const { user, type, isTopRank } = rankingData;
    
    const getCrownColor = () => {
      if (type === 'prizepool') return '#FFD700';
      if (type === 'elo') return '#4A90E2';
      return '#9B59B6';
    };

    const getValueColor = () => {
      if (type === 'elo') return '#4A90E2';
      return '#2E7D32';
    };

    const getTrendIcon = () => {
      if (user.trend === 'up') return <TrendingUp size={12} color="#4CAF50" />;
      if (user.trend === 'down') return <TrendingDown size={12} color="#F44336" />;
      return null;
    };

    if (isTopRank) {
      return (
        <View style={styles.topCard}>
          <View style={styles.topImageContainer}>
            <Image source={{ uri: user.avatar }} style={styles.topImage} />
            <View style={[styles.crown, { backgroundColor: getCrownColor() }]}>
              <Text style={styles.crownEmoji}>👑</Text>
            </View>
          </View>
          
          <Text style={styles.topName}>{user.name}</Text>
          
          <View style={styles.topInfo}>
            <Text style={styles.topPosition}>#{user.position}</Text>
            <Text style={[styles.topValue, { color: getValueColor() }]}>{user.value}</Text>
            
            <View style={styles.topActions}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>RANK : {user.rank}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.challengeButton}
                onPress={() => onAction?.(user.id, 'challenge')}
              >
                <Swords size={14} color="white" />
                <Text style={styles.challengeText}>Thách đấu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.listCard}>
        <View style={styles.leftSection}>
          <View style={styles.positionSection}>
            <Text style={styles.position}>{user.position}</Text>
            {getTrendIcon()}
          </View>
          
          <View style={styles.avatarSection}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            {user.isOnline && <View style={styles.onlineStatus} />}
          </View>
          
          <View style={styles.userSection}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.userRank}>Rank {user.rank}</Text>
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <Text style={[styles.value, { color: getValueColor() }]}>{user.value}</Text>
          <TouchableOpacity 
            style={styles.smallChallengeButton}
            onPress={() => onAction?.(user.id, 'challenge')}
          >
            <Swords size={12} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderTournamentCard = (tournamentData: TournamentCardData) => {
    const startTime = new Date(tournamentData.start_time);
    const endTime = new Date(tournamentData.end_time);
    const timeRange = `${startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
    const remainingSlots = tournamentData.max_players - tournamentData.current_players;
    const date = startTime.toLocaleDateString('vi-VN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    if (variant === 'compact') {
      return (
        <TouchableOpacity style={styles.compactCard} onPress={() => onPress?.(tournamentData.id)}>
          <View style={styles.tournamentIcon}>
            <Text style={styles.tournamentNumber}>8</Text>
          </View>
          
          <View style={styles.compactInfo}>
            <Text style={styles.compactTitle}>{tournamentData.title}</Text>
            <View style={styles.compactDetails}>
              <Calendar size={11} color="#0A5C6D" />
              <Text style={styles.compactDate}>
                {startTime.toLocaleDateString('vi-VN')}
              </Text>
            </View>
          </View>
          
          <View style={styles.compactMeta}>
            <Text style={styles.compactRank}>{tournamentData.min_rank} - {tournamentData.max_rank}</Text>
            <View style={styles.compactStats}>
              <Users size={14} color="#801515" />
              <Text style={styles.compactPlayers}>{tournamentData.current_players}/{tournamentData.max_players}</Text>
              <DollarSign size={14} color="#801515" />
              <Text style={styles.compactPrize}>{formatCurrency(tournamentData.prize_pool)}</Text>
            </View>
          </View>
          
          <View style={styles.compactAction}>
            <Text style={styles.compactLives}>2 Mạng</Text>
            <TouchableOpacity 
              style={styles.compactJoinButton}
              onPress={() => onAction?.(tournamentData.id, 'join')}
            >
              <View style={styles.joinIcon} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.tournamentCard} onPress={() => onPress?.(tournamentData.id)}>
        <Image 
          source={{ uri: tournamentData.image || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop' }} 
          style={styles.tournamentImage} 
        />
        
        <View style={styles.tournamentContent}>
          <View style={styles.tournamentHeader}>
            <Text style={styles.tournamentTitle}>{tournamentData.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tournamentData.status, 'tournament') }]}>
              <Text style={styles.statusText}>{tournamentData.status}</Text>
            </View>
          </View>
          
          {tournamentData.description && (
            <Text style={styles.tournamentDescription}>{tournamentData.description}</Text>
          )}
          
          <View style={styles.prizeContainer}>
            <Trophy size={18} color="#0A5C6D" />
            <Text style={styles.prizeText}>Giải thưởng: {formatCurrency(tournamentData.prize_pool)}</Text>
          </View>
          
          <View style={styles.tournamentDetails}>
            <View style={styles.detailRow}>
              <Users size={16} color="#666" />
              <Text style={styles.detailText}>
                {tournamentData.current_players}/{tournamentData.max_players} người • còn {remainingSlots} chỗ
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <TrendingUp size={16} color="#666" />
              <Text style={styles.detailText}>Yêu cầu: {tournamentData.min_rank} → {tournamentData.max_rank}+</Text>
            </View>
            
            <View style={styles.detailRow}>
              <DollarSign size={16} color="#666" />
              <Text style={styles.detailText}>Phí tham gia: {formatCurrency(tournamentData.entry_fee)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <MapPin size={16} color="#666" />
              <Text style={styles.detailText}>{tournamentData.location}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Clock size={16} color="#666" />
              <Text style={styles.detailText}>{date} • {timeRange}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.joinButton, (isLoading || tournamentData.status !== 'upcoming') && styles.joinButtonDisabled]}
            onPress={() => onAction?.(tournamentData.id, 'join')}
            disabled={isLoading || tournamentData.status !== 'upcoming'}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.joinButtonText}>
                {tournamentData.status === 'upcoming' ? 'Tham gia ngay' : 
                 tournamentData.status === 'live' ? 'Đang diễn ra' : 'Đã kết thúc'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderChallengeCard = (challengeData: ChallengeCardData) => {
    const renderPlayer = (player: BaseUser, isRight: boolean = false) => (
      <View style={[styles.playerContainer, isRight && styles.playerRight]}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: player.avatar }} style={styles.challengeAvatar} />
          <View style={[styles.onlineIndicator, { backgroundColor: player.isOnline ? '#4ECDC4' : '#FF6B6B' }]} />
        </View>
        <Text style={styles.playerName}>{player.name}</Text>
        <Text style={styles.playerRank}>Rank {player.rank}</Text>
      </View>
    );

    const renderWaitingPlayer = () => (
      <View style={[styles.playerContainer, styles.playerRight]}>
        <View style={styles.avatarContainer}>
          <View style={styles.emptyAvatar}>
            <Text style={styles.questionMark}>?</Text>
          </View>
          <View style={[styles.onlineIndicator, { backgroundColor: '#FF6B6B' }]} />
        </View>
        <Text style={styles.waitingText}>Chờ đối thủ</Text>
        <Text style={styles.playerRank}>Rank: I → H+</Text>
        {challengeData.status === 'waiting' && (
          <TouchableOpacity 
            style={styles.joinChallengeButton} 
            onPress={() => onAction?.(challengeData.id, 'join')}
          >
            <X size={16} color="white" />
            <Text style={styles.joinButtonText}>Tham gia</Text>
          </TouchableOpacity>
        )}
      </View>
    );

    return (
      <View style={styles.challengeCard}>
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(challengeData.status, 'challenge') }]}>
          <Text style={styles.statusText}>{challengeData.status}</Text>
        </View>

        {/* Date and Time */}
        <Text style={styles.dateTime}>{challengeData.date}</Text>
        <Text style={styles.dateTime}>{challengeData.time}</Text>

        {/* Players */}
        <View style={styles.playersContainer}>
          {renderPlayer(challengeData.player1)}
          
          {/* VS Section */}
          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>?</Text>
            <Text style={styles.dashText}>—</Text>
            <Text style={styles.vsText}>?</Text>
          </View>

          {challengeData.player2 ? renderPlayer(challengeData.player2, true) : renderWaitingPlayer()}
        </View>

        {/* Game Info */}
        <Text style={styles.handicapText}>{challengeData.handicap}</Text>
        
        <View style={styles.gameInfoContainer}>
          <View style={styles.spaContainer}>
            <View style={styles.spaIcon} />
            <Text style={styles.spaText}>{challengeData.spa} SPA</Text>
          </View>
          <Text style={styles.raceText}>Race to {challengeData.raceToScore}</Text>
        </View>
        
        <Text style={styles.tableText}>Bàn {challengeData.tableNumber}</Text>

        {/* Action Buttons */}
        {challengeData.status === 'live' && (
          <TouchableOpacity 
            style={styles.liveButton} 
            onPress={() => onAction?.(challengeData.id, 'viewLive')}
          >
            <View style={styles.liveIndicator} />
            <Text style={styles.liveButtonText}>Xem Live</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Main render logic
  switch (cardType) {
    case 'ranking':
      return renderRankingCard(data as RankingCardData);
    case 'tournament':
      return renderTournamentCard(data as TournamentCardData);
    case 'challenge':
      return renderChallengeCard(data as ChallengeCardData);
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  // Ranking card styles
  topCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  topImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  topImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  crown: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  crownEmoji: {
    fontSize: 18,
  },
  topName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  topInfo: {
    alignItems: 'center',
    width: '100%',
  },
  topPosition: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  topValue: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  rankBadge: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  rankText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
  },
  challengeButton: {
    backgroundColor: '#FF004F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  challengeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  positionSection: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  position: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  avatarSection: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  userSection: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  userRank: {
    fontSize: 14,
    color: '#666',
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  smallChallengeButton: {
    backgroundColor: '#FF004F',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tournament card styles  
  tournamentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tournamentImage: {
    width: '100%',
    height: 160,
  },
  tournamentContent: {
    padding: 20,
  },
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tournamentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  tournamentDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  prizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
  },
  prizeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A5C6D',
  },
  tournamentDetails: {
    gap: 12,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  joinButton: {
    backgroundColor: '#0A5C6D',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  joinButtonDisabled: {
    opacity: 0.6,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Compact tournament styles
  compactCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.07)',
    marginBottom: 16,
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
  compactInfo: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#0A5C6D',
    marginBottom: 4,
  },
  compactDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  compactDate: {
    fontSize: 10,
    color: '#0A5C6D',
  },
  compactMeta: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  compactRank: {
    fontSize: 12,
    color: '#0A5C6D',
    marginBottom: 8,
  },
  compactStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactPlayers: {
    fontSize: 10,
    color: '#801515',
    marginRight: 8,
  },
  compactPrize: {
    fontSize: 10,
    color: '#801515',
  },
  compactAction: {
    alignItems: 'center',
  },
  compactLives: {
    fontSize: 10,
    color: '#0A5C6D',
    marginBottom: 8,
  },
  compactJoinButton: {
    width: 45,
    height: 22,
    backgroundColor: '#7F1516',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
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

  // Challenge card styles
  challengeCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#E8F5E8',
    position: 'relative',
  },
  dateTime: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  playersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 12,
  },
  playerContainer: {
    alignItems: 'center',
    flex: 1,
  },
  playerRight: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  challengeAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#333',
  },
  emptyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionMark: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  playerRank: {
    fontSize: 12,
    color: '#666',
  },
  waitingText: {
    fontSize: 14,
    color: '#FF6B6B',
    marginBottom: 2,
  },
  vsContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  vsText: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  dashText: {
    fontSize: 20,
    color: '#666',
    marginVertical: 4,
  },
  handicapText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
  },
  gameInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  spaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  spaIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#333',
    marginRight: 4,
  },
  spaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  raceText: {
    fontSize: 14,
    color: '#666',
  },
  tableText: {
    textAlign: 'center',
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  joinChallengeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  liveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B0000',
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 8,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginRight: 6,
  },
  liveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default UniversalCard;