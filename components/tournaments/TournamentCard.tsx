import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Trophy, Users, Clock, MapPin, DollarSign, TrendingUp, Calendar } from 'lucide-react-native';

interface Tournament {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
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

interface TournamentCardProps {
  tournament: Tournament;
  onJoin?: (tournamentId: string) => void;
  isLoading?: boolean;
  variant?: 'full' | 'compact';
}

const formatCurrency = (amount: number) => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(0)}M`;
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'upcoming': return '#0A5C6D';
    case 'live': return '#10B981';
    case 'completed': return '#666';
    default: return '#666';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'upcoming': return 'Sắp diễn ra';
    case 'live': return 'Đang live';
    case 'completed': return 'Đã kết thúc';
    default: return status;
  }
};

export const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onJoin,
  isLoading = false,
  variant = 'full'
}) => {
  const startTime = new Date(tournament.start_time);
  const endTime = new Date(tournament.end_time);
  const timeRange = `${startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  const remainingSlots = tournament.max_players - tournament.current_players;
  const date = startTime.toLocaleDateString('vi-VN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  if (variant === 'compact') {
    return (
      <TouchableOpacity style={styles.compactCard}>
        <View style={styles.tournamentIcon}>
          <Text style={styles.tournamentNumber}>8</Text>
        </View>
        
        <View style={styles.compactInfo}>
          <Text style={styles.compactTitle}>{tournament.title}</Text>
          <View style={styles.compactDetails}>
            <Calendar size={11} color="#0A5C6D" />
            <Text style={styles.compactDate}>
              {startTime.toLocaleDateString('vi-VN')}
            </Text>
          </View>
        </View>
        
        <View style={styles.compactMeta}>
          <Text style={styles.compactRank}>{tournament.min_rank} - {tournament.max_rank}</Text>
          <View style={styles.compactStats}>
            <Users size={14} color="#801515" />
            <Text style={styles.compactPlayers}>{tournament.current_players}/{tournament.max_players}</Text>
            <DollarSign size={14} color="#801515" />
            <Text style={styles.compactPrize}>{formatCurrency(tournament.prize_pool)}</Text>
          </View>
        </View>
        
        <View style={styles.compactAction}>
          <Text style={styles.compactLives}>2 Mạng</Text>
          <TouchableOpacity style={styles.compactJoinButton}>
            <View style={styles.joinIcon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity style={styles.tournamentCard}>
      <Image 
        source={{ uri: tournament.image_url || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop' }} 
        style={styles.tournamentImage} 
      />
      
      <View style={styles.tournamentContent}>
        <View style={styles.tournamentHeader}>
          <Text style={styles.tournamentTitle}>{tournament.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tournament.status) }]}>
            <Text style={styles.statusText}>{getStatusText(tournament.status)}</Text>
          </View>
        </View>
        
        {tournament.description && (
          <Text style={styles.tournamentDescription}>{tournament.description}</Text>
        )}
        
        <View style={styles.prizeContainer}>
          <Trophy size={18} color="#0A5C6D" />
          <Text style={styles.prizeText}>Giải thưởng: {formatCurrency(tournament.prize_pool)}</Text>
        </View>
        
        <View style={styles.tournamentDetails}>
          <View style={styles.detailRow}>
            <Users size={16} color="#666" />
            <Text style={styles.detailText}>
              {tournament.current_players}/{tournament.max_players} người • còn {remainingSlots} chỗ
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <TrendingUp size={16} color="#666" />
            <Text style={styles.detailText}>Yêu cầu: {tournament.min_rank} → {tournament.max_rank}+</Text>
          </View>
          
          <View style={styles.detailRow}>
            <DollarSign size={16} color="#666" />
            <Text style={styles.detailText}>Phí tham gia: {formatCurrency(tournament.entry_fee)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MapPin size={16} color="#666" />
            <Text style={styles.detailText}>{tournament.location}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Clock size={16} color="#666" />
            <Text style={styles.detailText}>{date} • {timeRange}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.joinButton, (isLoading || tournament.status !== 'upcoming') && styles.joinButtonDisabled]}
          onPress={() => onJoin?.(tournament.id)}
          disabled={isLoading || tournament.status !== 'upcoming'}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.joinButtonText}>
              {tournament.status === 'upcoming' ? 'Tham gia ngay' : 
               tournament.status === 'live' ? 'Đang diễn ra' : 'Đã kết thúc'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Full card styles
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
  
  // Compact card styles
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
});