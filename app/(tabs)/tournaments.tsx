import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Trophy, 
  Users, 
  Clock, 
  MapPin, 
  DollarSign, 
  TrendingUp
} from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { 
  TournamentDetail,
  TournamentListItem,
  TournamentHeader,
  TournamentFilters,
  TournamentEmptyState,
  TournamentLoadingState
} from '@/components/shared';
import { router } from 'expo-router';

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



const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export default function TournamentsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all');
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'ranking'>('list');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  
  const tournamentsQuery = trpc.tournaments.list.useQuery({ 
    status: selectedFilter,
    limit: 20 
  });
  
  const joinMutation = trpc.tournaments.join.useMutation({
    onSuccess: () => {
      Alert.alert('Thành công', 'Đã tham gia giải đấu thành công!');
      tournamentsQuery.refetch();
    },
    onError: (error: any) => {
      Alert.alert('Lỗi', error.message || 'Không thể tham gia giải đấu');
    }
  });

  const handleJoinTournament = (tournamentId: string) => {
    Alert.alert(
      'Xác nhận tham gia',
      'Bạn có chắc chắn muốn tham gia giải đấu này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Tham gia', 
          onPress: () => joinMutation.mutate({ tournamentId })
        }
      ]
    );
  };

  const handleTournamentPress = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedTournament(null);
  };

  const handleShowRanking = () => {
    router.push('/ranking');
  };

  const tournaments = tournamentsQuery.data?.tournaments || [];

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
      <TournamentListItem
        key={tournament.id}
        tournament={{
          id: tournament.id,
          title: tournament.title,
          participants: tournament.current_players,
          maxParticipants: tournament.max_players,
          date: date,
          rank: `${tournament.min_rank} → ${tournament.max_rank}+`,
          prizePool: tournament.prize_pool,
          ballType: 8, // Default to 8-ball
          status: tournament.status === 'upcoming' ? 'ready' : tournament.status === 'live' ? 'live' : 'done'
        }}
        onPress={() => handleTournamentPress(tournament)}
        onJoin={() => handleJoinTournament(tournament.id)}
      />
    );
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

  // Show tournament detail view
  if (currentView === 'detail' && selectedTournament) {
    return (
      <TournamentDetail
        tournament={{
          id: selectedTournament.id,
          title: selectedTournament.title,
          participants: selectedTournament.current_players,
          maxParticipants: selectedTournament.max_players,
          date: new Date(selectedTournament.start_time).toLocaleDateString('vi-VN'),
          rank: `${selectedTournament.min_rank} → ${selectedTournament.max_rank}+`,
          prizePool: selectedTournament.prize_pool,
          ballType: 8, // Default to 8-ball
          status: selectedTournament.status === 'upcoming' ? 'ready' : selectedTournament.status === 'live' ? 'live' : 'done'
        }}
        onBack={handleBackToList}
      />
    );
  }



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TournamentHeader onRankingPress={handleShowRanking} />
        
        <TournamentFilters 
          filters={[
            { key: 'all', label: 'Tất cả' },
            { key: 'upcoming', label: 'Sắp diễn ra' },
            { key: 'live', label: 'Đang live' },
            { key: 'completed', label: 'Đã kết thúc' },
          ]}
          selectedFilter={selectedFilter}
          onFilterChange={(filter) => setSelectedFilter(filter as typeof selectedFilter)}
        />
        
        {/* Tournament List */}
        <View style={styles.content}>
          {tournamentsQuery.isLoading ? (
            <TournamentLoadingState />
          ) : tournaments.length > 0 ? (
            tournaments.map(renderTournamentCard)
          ) : (
            <TournamentEmptyState />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },

  content: {
    padding: 20,
  },

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
});