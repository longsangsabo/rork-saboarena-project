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
import { useTheme } from '@/providers/ThemeProvider';

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
  const theme = useTheme();
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colorStyle('light.background') }]}>
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
        <View style={[styles.content, { padding: theme.spacingStyle(5) }]}>
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
    // backgroundColor dynamically set in component
  },
  scrollView: {
    flex: 1,
  },

  content: {
    // padding dynamically set in component
  },

  tournamentCard: {
    // Dynamic styling: backgroundColor, borderColor, marginBottom set in component
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tournamentImage: {
    width: '100%',
    // Dynamic height: 160px equivalent is spacing[40] = 160px
  },
  tournamentContent: {
    // Dynamic padding: 20px equivalent is spacing[5] = 20px
  },
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    // Dynamic marginBottom: 8px=spacing[2] set in component
  },
  tournamentTitle: {
    // Dynamic typography and color set in component
    flex: 1,
    // Dynamic marginRight: 12px equivalent is spacing[3] = 12px
  },
  statusBadge: {
    // Dynamic padding: 8px=spacing[2], 4px=spacing[1], borderRadius: 12px=spacing[3]
  },
  statusText: {
    // Dynamic fontSize: 12, fontWeight: '600', color: 'white' set in component
  },
  tournamentDescription: {
    // Dynamic fontSize: 14, color: '#666', marginBottom: 16, lineHeight: 20 set in component
  },
  prizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // Dynamic gap: 8px=spacing[2], marginBottom: 16px=spacing[4], padding: 12px=spacing[3], backgroundColor, borderRadius: 8px=spacing[2]
  },
  prizeText: {
    // Dynamic fontSize: 16, fontWeight: 'bold', color set in component
  },
  tournamentDetails: {
    // Dynamic gap: 12px=spacing[3], marginBottom: 20px=spacing[5] set in component
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // Dynamic gap: 8px=spacing[2] set in component
  },
  detailText: {
    // Dynamic fontSize: 14, color: '#333' set in component
    flex: 1,
  },
  joinButton: {
    // Dynamic backgroundColor, paddingVertical: 14px=spacing[3.5], borderRadius: 12px=spacing[3] set in component
    alignItems: 'center',
  },
  joinButtonDisabled: {
    opacity: 0.6,
  },
  joinButtonText: {
    // Dynamic color: 'white', fontSize: 16, fontWeight: 'bold' set in component
  },
});