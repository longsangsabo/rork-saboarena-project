import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Trophy, 
  Users, 
  Clock, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Filter 
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useTournaments } from '@/providers/SABODataProvider';
import { formatCurrency, getTimeAgo } from '@/types/sabo';
import type { Tournament } from '@/types/sabo';

export default function TournamentsScreen() {
  const { tournaments, isLoading, joinTournament, isJoining } = useTournaments();
  const [selectedFilter, setSelectedFilter] = React.useState<string>('all');

  const handleJoinTournament = (tournamentId: string) => {
    console.log('Joining tournament:', tournamentId);
    joinTournament(tournamentId);
  };

  const filteredTournaments = tournaments.filter(tournament => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'upcoming') return tournament.status === 'upcoming';
    if (selectedFilter === 'live') return tournament.status === 'live';
    if (selectedFilter === 'completed') return tournament.status === 'completed';
    return true;
  });

  const renderTournamentCard = (tournament: Tournament) => {
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
    
    return (
      <TouchableOpacity key={tournament.id} style={styles.tournamentCard}>
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
            <Trophy size={18} color={Colors.sabo.secondary[500]} />
            <Text style={styles.prizeText}>Giải thưởng: {formatCurrency(tournament.prize_pool)}</Text>
          </View>
          
          <View style={styles.tournamentDetails}>
            <View style={styles.detailRow}>
              <Users size={16} color={Colors.light.placeholder} />
              <Text style={styles.detailText}>
                {tournament.current_players}/{tournament.max_players} người • còn {remainingSlots} chỗ
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <TrendingUp size={16} color={Colors.light.placeholder} />
              <Text style={styles.detailText}>Yêu cầu: {tournament.min_rank} → {tournament.max_rank}+</Text>
            </View>
            
            <View style={styles.detailRow}>
              <DollarSign size={16} color={Colors.light.placeholder} />
              <Text style={styles.detailText}>Phí tham gia: {formatCurrency(tournament.entry_fee)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <MapPin size={16} color={Colors.light.placeholder} />
              <Text style={styles.detailText}>{tournament.location}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Clock size={16} color={Colors.light.placeholder} />
              <Text style={styles.detailText}>{date} • {timeRange}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.joinButton, isJoining && styles.joinButtonDisabled]}
            onPress={() => handleJoinTournament(tournament.id)}
            disabled={isJoining || tournament.status !== 'upcoming'}
          >
            {isJoining ? (
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return Colors.light.tint;
      case 'live': return '#10B981';
      case 'completed': return Colors.light.placeholder;
      default: return Colors.light.placeholder;
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Giải đấu</Text>
          <Text style={styles.subtitle}>Tham gia các giải đấu hấp dẫn</Text>
        </View>
        
        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'upcoming', label: 'Sắp diễn ra' },
              { key: 'live', label: 'Đang live' },
              { key: 'completed', label: 'Đã kết thúc' },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterTab,
                  selectedFilter === filter.key && styles.filterTabActive,
                ]}
                onPress={() => setSelectedFilter(filter.key)}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    selectedFilter === filter.key && styles.filterTabTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Tournament List */}
        <View style={styles.content}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.light.tint} />
              <Text style={styles.loadingText}>Đang tải giải đấu...</Text>
            </View>
          ) : filteredTournaments.length > 0 ? (
            filteredTournaments.map(renderTournamentCard)
          ) : (
            <View style={styles.emptyContainer}>
              <Trophy size={48} color={Colors.light.placeholder} />
              <Text style={styles.emptyText}>Không có giải đấu nào</Text>
              <Text style={styles.emptySubtext}>Hãy thử lọc khác hoặc quay lại sau</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.placeholder,
  },
  filterContainer: {
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  filterScroll: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  filterTabActive: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  filterTabTextActive: {
    color: 'white',
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.placeholder,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.placeholder,
    textAlign: 'center',
  },
  tournamentCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
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
    color: Colors.light.text,
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
    color: Colors.light.placeholder,
    marginBottom: 16,
    lineHeight: 20,
  },
  prizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    padding: 12,
    backgroundColor: Colors.sabo.secondary[50],
    borderRadius: 8,
  },
  prizeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.sabo.secondary[700],
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
    color: Colors.light.text,
    flex: 1,
  },
  joinButton: {
    backgroundColor: Colors.light.tint,
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
});