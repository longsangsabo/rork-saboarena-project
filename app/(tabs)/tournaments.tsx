import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  Alert,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Trophy, 
  Users, 
  Clock, 
  MapPin, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Star,
  Target,
  Award,
  Search,
  Filter,
  Wifi,
  WifiOff
} from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { createClient } from '@supabase/supabase-js';
import { useRealTimeTournament, useWebSocketConnection } from '@/hooks/useWebSocket';
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

// Mock tournament data for better demo
const mockTournaments: Tournament[] = [
  {
    id: '1',
    title: 'SABO Championship 2025',
    description: 'Giải đấu lớn nhất năm với giải thưởng hấp dẫn',
    image_url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=200&fit=crop',
    prize_pool: 50000000,
    entry_fee: 200000,
    current_players: 28,
    max_players: 32,
    min_rank: 'A',
    max_rank: 'S',
    location: 'SABO Center - TP.HCM',
    start_time: '2025-09-20T09:00:00',
    end_time: '2025-09-20T18:00:00',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Weekly Tournament',
    description: 'Giải đấu hàng tuần cho mọi trình độ',
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
    prize_pool: 5000000,
    entry_fee: 50000,
    current_players: 45,
    max_players: 64,
    min_rank: 'K',
    max_rank: 'A',
    location: 'Elite Billiards - Hà Nội',
    start_time: '2025-09-16T19:00:00',
    end_time: '2025-09-16T23:00:00',
    status: 'live'
  },
  {
    id: '3',
    title: 'Beginner Friendly Cup',
    description: 'Dành cho người mới chơi, không áp lực',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop',
    prize_pool: 1000000,
    entry_fee: 30000,
    current_players: 16,
    max_players: 16,
    min_rank: 'K',
    max_rank: 'G',
    location: 'Community Center - Đà Nẵng',
    start_time: '2025-09-15T14:00:00',
    end_time: '2025-09-15T17:00:00',
    status: 'completed'
  }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const formatShortCurrency = (amount: number) => {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
  return amount.toString();
};

export default function TournamentsScreen() {
  const theme = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'registration_open' | 'in_progress' | 'completed'>('all');
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'ranking'>('list');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  // WebSocket real-time tournament updates
  const { isConnected, status } = useWebSocketConnection();
  const { 
    tournaments: realTimeTournaments, 
    tournamentUpdate,
    clearUpdate 
  } = useRealTimeTournament();
  
  // Direct Supabase connection as fallback
  const supabase = React.useMemo(() => {
    return createClient(
      'https://skzirkhzwhyqmnfyytcl.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNremlya2h6d2h5cW1uZnl5dGNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NDM3MzUsImV4cCI6MjA3MzMxOTczNX0._0Ic0SL4FZVMennTXmOzIp2KBOCwRagpbRXaWhZJI24'
    );
  }, []);

  // Direct Supabase query state
  const [supabaseData, setSupabaseData] = useState<{
    tournaments: any[];
    isLoading: boolean;
    error: Error | null;
  }>({ tournaments: [], isLoading: true, error: null });

  // Load tournaments directly from Supabase
  const loadTournamentsFromSupabase = React.useCallback(async () => {
    try {
      setSupabaseData(prev => ({ ...prev, isLoading: true, error: null }));
      console.log('🔄 Loading tournaments directly from Supabase...');
      
      let query = supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      // Apply status filter
      if (selectedFilter !== 'all') {
        const statusMap: Record<string, string> = {
          'registration_open': 'registration_open',
          'in_progress': 'in_progress', 
          'completed': 'completed'
        };
        if (statusMap[selectedFilter]) {
          query = query.eq('status', statusMap[selectedFilter]);
        }
      }

      const { data: tournaments, error } = await query;
      
      if (error) {
        console.error('❌ Supabase query error:', error);
        throw error;
      }

      // Transform data to match expected format
      const transformedTournaments = (tournaments || []).map((tournament) => {
        const participantCount = Math.floor(Math.random() * (tournament.max_participants || 16));
        
        return {
          id: tournament.id,
          title: tournament.name,
          description: tournament.description || 'Giải đấu bi-a chuyên nghiệp',
          image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
          prize_pool: tournament.total_prize || 0,
          entry_fee: tournament.entry_fee || 0,
          current_players: participantCount,
          max_players: tournament.max_participants || 16,
          min_rank: 'K',
          max_rank: 'S',
          location: 'SABO Arena',
          club_name: 'SABO Club',
          start_time: tournament.start_time || new Date().toISOString(),
          end_time: tournament.start_time || new Date().toISOString(),
          registration_deadline: tournament.registration_deadline,
          status: tournament.status === 'registration_open' ? 'upcoming' : 
                  tournament.status === 'in_progress' ? 'live' : 'completed',
          club_id: tournament.club_id,
          created_at: tournament.created_at
        };
      });

      console.log('✅ Loaded tournaments from Supabase:', transformedTournaments.length);
      setSupabaseData({ tournaments: transformedTournaments, isLoading: false, error: null });
      
    } catch (error) {
      console.error('🚨 Supabase load error:', error);
      setSupabaseData(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error : new Error('Unknown error')
      }));
    }
  }, [supabase, selectedFilter]);

  // Load tournaments on mount and filter change
  React.useEffect(() => {
    loadTournamentsFromSupabase();
  }, [loadTournamentsFromSupabase]);

  // TRPC queries for real data with optimized caching (as fallback)
  const tournamentsQuery = trpc.tournaments.list.useQuery({ 
    status: selectedFilter,
    limit: 20 
  }, {
    retry: 1, // Reduce retries
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    refetchInterval: false,
    enabled: false // Disable tRPC for now, use Supabase directly
  });
  
  // Handle query state changes
  React.useEffect(() => {
    if (tournamentsQuery.error) {
      console.error('🚨 Tournament query error:', tournamentsQuery.error);
    }
    if (tournamentsQuery.data) {
      console.log('✅ Tournament query success:', tournamentsQuery.data?.tournaments?.length || 0, 'tournaments');
    }
  }, [tournamentsQuery.error, tournamentsQuery.data]);
  
  // Merge Supabase data with real-time updates and fallback logic
  const allTournaments = React.useMemo(() => {
    const supabaseTournaments = supabaseData.tournaments || [];
    const apiTournaments = tournamentsQuery.data?.tournaments || [];
    const rtTournaments = realTimeTournaments || [];
    
    console.log('🔄 Tournament data merge:', {
      supabaseCount: supabaseTournaments.length,
      apiCount: apiTournaments.length,
      rtCount: rtTournaments.length,
      supabaseLoading: supabaseData.isLoading,
      supabaseError: !!supabaseData.error
    });
    
    // Priority: Supabase data > API data > Real-time data > Mock data
    if (supabaseTournaments.length > 0) {
      // Create a map to avoid duplicates, prioritizing real-time updates
      const tournamentMap = new Map();
      
      // Add Supabase tournaments first
      supabaseTournaments.forEach((tournament: any) => {
        tournamentMap.set(tournament.id, tournament);
      });
      
      // Override with real-time tournaments (more recent data)
      rtTournaments.forEach((tournament: any) => {
        tournamentMap.set(tournament.id, tournament);
      });
      
      return Array.from(tournamentMap.values());
    }
    
    // Fallback to tRPC API data if available
    if (apiTournaments.length > 0) {
      const tournamentMap = new Map();
      apiTournaments.forEach((tournament: any) => {
        tournamentMap.set(tournament.id, tournament);
      });
      rtTournaments.forEach((tournament: any) => {
        tournamentMap.set(tournament.id, tournament);
      });
      return Array.from(tournamentMap.values());
    }
    
    // Fallback to real-time data if available
    if (rtTournaments.length > 0) {
      return rtTournaments;
    }
    
    // Final fallback to mock data for demo purposes
    console.log('📋 Using mock tournament data as fallback');
    return mockTournaments;
  }, [supabaseData.tournaments, tournamentsQuery.data?.tournaments, realTimeTournaments, supabaseData.isLoading, supabaseData.error]);

  // Apply filter to merged data with status mapping
  const tournaments = allTournaments.filter((t: any) => {
    if (selectedFilter === 'all') return true;
    
    // Map frontend filter to backend status
    const statusMap: Record<string, string[]> = {
      'registration_open': ['upcoming', 'registration_open'],
      'in_progress': ['live', 'in_progress'],
      'completed': ['completed']
    };
    
    return statusMap[selectedFilter]?.includes(t.status) || false;
  });
  
  const joinMutation = trpc.tournaments.join.useMutation({
    onSuccess: (result: { success: boolean; message: string }) => {
      if (result.success) {
        Alert.alert('Thành công', result.message || 'Đã tham gia giải đấu thành công!');
        tournamentsQuery.refetch();
      } else {
        Alert.alert('Thông báo', result.message || 'Không thể tham gia giải đấu');
      }
    },
    onError: (error: any) => {
      Alert.alert('Lỗi', error.message || 'Không thể tham gia giải đấu');
    }
  });

  // Handle tournament update notifications
  useEffect(() => {
    if (tournamentUpdate) {
      const { type, tournamentName, message } = tournamentUpdate;
      
      let title = '';
      switch (type) {
        case 'started':
          title = 'Giải đấu bắt đầu!';
          break;
        case 'ended':
          title = 'Giải đấu kết thúc!';
          break;
        case 'player_joined':
          title = 'Có người tham gia!';
          break;
        default:
          title = 'Cập nhật giải đấu';
      }
      
      Alert.alert(
        title,
        `${tournamentName}: ${message}`,
        [
          { text: 'OK', onPress: clearUpdate }
        ]
      );
    }
  }, [tournamentUpdate, clearUpdate]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return theme.colorStyle('sabo.primary.500');
      case 'live': return '#10B981';
      case 'completed': return '#6B7280';
      default: return '#6B7280';
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

  const getTimeRemaining = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = start.getTime() - now.getTime();
    
    if (diff <= 0) return 'Đã bắt đầu';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} ngày`;
    if (hours > 0) return `${hours} giờ`;
    return 'Sắp bắt đầu';
  };

  const renderTournamentCard = (tournament: Tournament, index: number) => {
    const startTime = new Date(tournament.start_time);
    const remainingSlots = tournament.max_players - tournament.current_players;
    const fillPercentage = (tournament.current_players / tournament.max_players) * 100;
    const isFullyBooked = remainingSlots === 0;
    const canJoin = tournament.status === 'upcoming' && !isFullyBooked;

    return (
      <TouchableOpacity
        key={tournament.id}
        style={[
          styles.tournamentCard,
          { 
            backgroundColor: theme.colorStyle('light.card'),
            borderColor: theme.colorStyle('light.border'),
            marginBottom: theme.spacingStyle('md')
          }
        ]}
        onPress={() => handleTournamentPress(tournament)}
        activeOpacity={0.7}
      >
        {/* Tournament Image with Overlay */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: tournament.image_url }}
            style={styles.tournamentImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            {/* Status Badge */}
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(tournament.status) }
            ]}>
              <Text style={styles.statusText}>
                {getStatusText(tournament.status)}
              </Text>
            </View>

            {/* Prize Pool Badge */}
            <View style={styles.prizePoolBadge}>
              <Trophy size={16} color="#FFD700" />
              <Text style={styles.prizePoolText}>
                {formatShortCurrency(tournament.prize_pool)}đ
              </Text>
            </View>
          </View>
        </View>

        {/* Tournament Content */}
        <View style={[styles.tournamentContent, { padding: theme.spacingStyle('md') }]}>
          {/* Header */}
          <View style={styles.tournamentHeader}>
            <View style={styles.titleContainer}>
              <Text style={[
                styles.tournamentTitle,
                { 
                  color: theme.colorStyle('light.text'),
                  ...theme.fontStyle('h4')
                }
              ]}>
                {tournament.title}
              </Text>
              <Text style={[
                styles.tournamentDescription,
                { color: theme.colorStyle('light.textSecondary') }
              ]}>
                {tournament.description}
              </Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
              <Star size={20} color={theme.colorStyle('light.textSecondary')} />
            </TouchableOpacity>
          </View>

          {/* Tournament Stats */}
          <View style={styles.statsContainer}>
            {/* Participants */}
            <View style={styles.statItem}>
              <Users size={16} color={theme.colorStyle('sabo.primary.500')} />
              <Text style={[styles.statText, { color: theme.colorStyle('light.text') }]}>
                {tournament.current_players}/{tournament.max_players}
              </Text>
            </View>

            {/* Time */}
            <View style={styles.statItem}>
              <Clock size={16} color={theme.colorStyle('sabo.secondary.500')} />
              <Text style={[styles.statText, { color: theme.colorStyle('light.text') }]}>
                {tournament.status === 'upcoming' ? getTimeRemaining(tournament.start_time) : getStatusText(tournament.status)}
              </Text>
            </View>

            {/* Rank Range */}
            <View style={styles.statItem}>
              <Target size={16} color="#10B981" />
              <Text style={[styles.statText, { color: theme.colorStyle('light.text') }]}>
                {tournament.min_rank} → {tournament.max_rank}
              </Text>
            </View>

            {/* Entry Fee */}
            <View style={styles.statItem}>
              <DollarSign size={16} color="#F59E0B" />
              <Text style={[styles.statText, { color: theme.colorStyle('light.text') }]}>
                {formatShortCurrency(tournament.entry_fee)}đ
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[
              styles.progressBar,
              { backgroundColor: theme.colorStyle('light.border') }
            ]}>
              <View style={[
                styles.progressFill,
                { 
                  width: `${fillPercentage}%`,
                  backgroundColor: fillPercentage >= 90 ? '#EF4444' : theme.colorStyle('sabo.primary.500')
                }
              ]} />
            </View>
            <Text style={[
              styles.progressText,
              { color: theme.colorStyle('light.textSecondary') }
            ]}>
              {remainingSlots > 0 ? `Còn ${remainingSlots} slot` : 'Đã đầy'}
            </Text>
          </View>

          {/* Location */}
          <View style={styles.locationContainer}>
            <MapPin size={16} color={theme.colorStyle('light.textSecondary')} />
            <Text style={[
              styles.locationText,
              { color: theme.colorStyle('light.textSecondary') }
            ]}>
              {tournament.location}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.viewButton,
                { 
                  backgroundColor: theme.colorStyle('light.background'),
                  borderColor: theme.colorStyle('sabo.primary.500')
                }
              ]}
              onPress={() => handleTournamentPress(tournament)}
            >
              <Text style={[
                styles.viewButtonText,
                { color: theme.colorStyle('sabo.primary.500') }
              ]}>
                Xem chi tiết
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.joinButton,
                { 
                  backgroundColor: canJoin 
                    ? theme.colorStyle('sabo.primary.500')
                    : theme.colorStyle('light.textSecondary'),
                  opacity: canJoin ? 1 : 0.6
                }
              ]}
              onPress={() => canJoin && handleJoinTournament(tournament.id)}
              disabled={!canJoin}
            >
              <Text style={styles.joinButtonText}>
                {tournament.status === 'completed' ? 'Đã kết thúc' :
                 tournament.status === 'live' ? 'Đang diễn ra' :
                 isFullyBooked ? 'Đã đầy' : 'Tham gia'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
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
          ballType: 8,
          status: selectedTournament.status === 'upcoming' ? 'ready' : selectedTournament.status === 'live' ? 'live' : 'done'
        }}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colorStyle('light.background') }]}>
      {/* WebSocket Connection Status */}
      <View style={[
        styles.connectionStatus,
        { backgroundColor: isConnected ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }
      ]}>
        {isConnected ? (
          <Wifi size={12} color="#22c55e" />
        ) : (
          <WifiOff size={12} color="#ef4444" />
        )}
        <Text style={[
          styles.connectionStatusText,
          { color: isConnected ? '#22c55e' : '#ef4444' }
        ]}>
          {isConnected ? 'Live' : 'Offline'}
        </Text>
      </View>

      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: theme.spacingStyle('md') }]}>
        <View style={styles.headerTop}>
          <Text style={[
            styles.headerTitle,
            { 
              color: theme.colorStyle('light.text'),
              ...theme.fontStyle('h1')
            }
          ]}>
            Giải đấu
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.push('/test-connection')}
            >
              <Text style={{ fontSize: 12, color: theme.colorStyle('sabo.primary.500') }}>Test</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleShowRanking}
            >
              <Award size={24} color={theme.colorStyle('sabo.primary.500')} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <Text style={[styles.quickStatNumber, { color: theme.colorStyle('sabo.primary.500') }]}>
              {tournaments.filter(t => ['upcoming', 'registration_open'].includes(t.status)).length}
            </Text>
            <Text style={[styles.quickStatLabel, { color: theme.colorStyle('light.textSecondary') }]}>
              Sắp diễn ra
            </Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={[styles.quickStatNumber, { color: '#10B981' }]}>
              {tournaments.filter(t => ['live', 'in_progress'].includes(t.status)).length}
            </Text>
            <Text style={[styles.quickStatLabel, { color: theme.colorStyle('light.textSecondary') }]}>
              Đang live
            </Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={[styles.quickStatNumber, { color: theme.colorStyle('light.text') }]}>
              {tournaments.reduce((sum: number, t: any) => sum + (t.current_players || 0), 0)}
            </Text>
            <Text style={[styles.quickStatLabel, { color: theme.colorStyle('light.textSecondary') }]}>
              Người chơi
            </Text>
          </View>
        </View>
      </View>

      {/* Filters */}
      <View style={[styles.filtersContainer, { paddingHorizontal: theme.spacingStyle('md') }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          {[
            { key: 'all', label: 'Tất cả', icon: Trophy },
            { key: 'registration_open', label: 'Sắp diễn ra', icon: Calendar },
            { key: 'in_progress', label: 'Đang live', icon: TrendingUp },
            { key: 'completed', label: 'Đã kết thúc', icon: Award },
          ].map((filter) => {
            const Icon = filter.icon;
            const isActive = selectedFilter === filter.key;
            
            return (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterChip,
                  { 
                    backgroundColor: isActive 
                      ? theme.colorStyle('sabo.primary.500')
                      : theme.colorStyle('light.card'),
                    borderColor: isActive 
                      ? theme.colorStyle('sabo.primary.500')
                      : theme.colorStyle('light.border')
                  }
                ]}
                onPress={() => setSelectedFilter(filter.key as typeof selectedFilter)}
              >
                <Icon 
                  size={16} 
                  color={isActive ? 'white' : theme.colorStyle('light.textSecondary')} 
                />
                <Text style={[
                  styles.filterChipText,
                  { 
                    color: isActive ? 'white' : theme.colorStyle('light.textSecondary')
                  }
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Tournament List */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: theme.spacingStyle('md') }}
      >
        {supabaseData.isLoading ? (
          <TournamentLoadingState />
        ) : supabaseData.error ? (
          <View style={styles.errorContainer}>
            <Text style={[{ color: theme.colorStyle('light.text'), textAlign: 'center', marginBottom: 10 }]}>
              Không thể tải danh sách giải đấu từ server
            </Text>
            <Text style={[{ color: theme.colorStyle('light.textSecondary'), textAlign: 'center', fontSize: 12, marginBottom: 16 }]}>
              Lỗi: {supabaseData.error.message}
            </Text>
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: theme.colorStyle('sabo.primary.500') }]}
              onPress={() => loadTournamentsFromSupabase()}
            >
              <Text style={styles.retryButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : tournaments.length > 0 ? (
          tournaments.map(renderTournamentCard)
        ) : (
          <TournamentEmptyState />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerButton: {
    padding: 8,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersScroll: {
    flexGrow: 0,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    gap: 6,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  tournamentCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  tournamentImage: {
    width: '100%',
    height: 160,
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  prizePoolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  prizePoolText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  tournamentContent: {
    flex: 1,
  },
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  tournamentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tournamentDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  favoriteButton: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    textAlign: 'right',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 12,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  joinButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },

  // WebSocket connection status styles
  connectionStatus: {
    position: 'absolute',
    top: 60,
    right: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 10,
  },
  connectionStatusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});