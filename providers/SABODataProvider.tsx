import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useStorage } from '@/providers/StorageProvider';
import { useState, useEffect, useCallback } from 'react';
import { User, Tournament, Club, Activity, UserStats, getRankByElo } from '@/types/sabo';
import { trpc } from '@/lib/trpc';

// Mock data for development
const mockUser: User = {
  id: '1',
  name: 'Anh Long Magic',
  email: 'long@example.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  rank: 'Master',
  elo: 1485,
  spa_points: 320,
  ranking_position: 89,
  total_matches: 37,
  wins: 28,
  losses: 9,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-12-13T00:00:00Z',
};

const mockTournaments: Tournament[] = [
  {
    id: '1',
    title: 'SABO Championship 2024',
    description: 'Giải đấu lớn nhất năm với tổng giải thưởng khủng',
    prize_pool: 10000000,
    entry_fee: 300000,
    max_players: 16,
    current_players: 0,
    min_rank: 'K',
    max_rank: 'G',
    location: 'CLB Sao Mai, Q1',
    club_name: 'CLB Sao Mai',
    start_time: '2024-12-15T15:00:00Z',
    end_time: '2024-12-15T18:00:00Z',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-13T00:00:00Z',
  },
  {
    id: '2',
    title: 'Weekly Masters Cup',
    description: 'Giải đấu hàng tuần cho các cao thủ',
    prize_pool: 5000000,
    entry_fee: 200000,
    max_players: 12,
    current_players: 8,
    min_rank: 'E',
    max_rank: 'G',
    location: 'CLB Hoàng Gia, Q3',
    club_name: 'CLB Hoàng Gia',
    start_time: '2024-12-14T19:00:00Z',
    end_time: '2024-12-14T22:00:00Z',
    status: 'upcoming',
    image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=200&fit=crop',
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-13T00:00:00Z',
  },
];

const mockClubs: Club[] = [
  {
    id: '1',
    name: 'CLB Sao Mai',
    description: 'Câu lạc bộ bi-a hàng đầu Sài Gòn',
    location: 'Quận 1, TP.HCM',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    phone: '0901234567',
    email: 'contact@saomaiclub.com',
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
    member_count: 25,
    total_prize_pool: 89900000,
    active_challenges: 37,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-12-13T00:00:00Z',
  },
  {
    id: '2',
    name: 'CLB Hoàng Gia',
    description: 'Không gian bi-a sang trọng và chuyên nghiệp',
    location: 'Quận 3, TP.HCM',
    address: '456 Võ Văn Tần, Quận 3, TP.HCM',
    phone: '0907654321',
    email: 'info@hoanggia.com',
    image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=200&fit=crop',
    member_count: 18,
    total_prize_pool: 45600000,
    active_challenges: 22,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-12-13T00:00:00Z',
  },
];

const mockActivities: Activity[] = [
  {
    id: '1',
    user_id: '1',
    user: mockUser,
    type: 'tournament_join',
    title: '328.7K chơi luôn',
    description: 'Vừa tham gia giải đấu SABO Championship 2024',
    metadata: { tournament_id: '1' },
    likes_count: 42,
    comments_count: 8,
    is_liked: false,
    created_at: '2024-12-13T10:30:00Z',
  },
  {
    id: '2',
    user_id: '2',
    user: {
      id: '2',
      name: 'Minh Tuấn Pro',
      email: 'tuan@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rank: 'Expert',
      elo: 1320,
      spa_points: 280,
      ranking_position: 156,
      total_matches: 42,
      wins: 30,
      losses: 12,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-12-13T00:00:00Z',
    },
    type: 'challenge_sent',
    title: '156.2K thách đấu',
    description: 'Vừa gửi lời thách đấu với mức cược 500K',
    metadata: { stake_amount: 500000 },
    likes_count: 23,
    comments_count: 5,
    is_liked: true,
    created_at: '2024-12-13T09:15:00Z',
  },
];

export const [SABODataProvider, useSABOData] = createContextHook(() => {
  const { getItem, setItem } = useStorage();
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Use tRPC hooks for data fetching
  const userProfileQuery = trpc.user.getProfile.useQuery({ userId: currentUser?.id });
  const tournamentsQuery = trpc.tournaments.list.useQuery({ status: 'all', limit: 20 });
  const clubsQuery = trpc.clubs.list.useQuery({ status: 'active', limit: 20 });
  const socialFeedQuery = trpc.social.getFeed.useQuery({ type: 'nearby', limit: 20 });
  
  // Load user from storage and sync with database
  const userQuery = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const stored = await getItem('currentUser');
      return stored ? JSON.parse(stored) : mockUser;
    },
  });

  // User stats query - derived from user profile
  const userStatsQuery = useQuery({
    queryKey: ['userStats', currentUser?.id],
    queryFn: async () => {
      if (!currentUser || !userProfileQuery.data) return null;
      
      const profile = userProfileQuery.data;
      const winRate = profile.matches > 0 ? (profile.wins / profile.matches) * 100 : 0;
      
      return {
        user_id: currentUser.id,
        elo: profile.elo,
        spa_points: profile.spa,
        ranking_position: profile.ranking,
        total_matches: profile.matches,
        wins: profile.wins,
        losses: profile.losses,
        win_rate: winRate,
        current_streak: 5, // TODO: Get from database
        best_streak: 12, // TODO: Get from database
        tournaments_won: 3, // TODO: Get from database
        tournaments_played: 8, // TODO: Get from database
        challenges_won: 15, // TODO: Get from database
        challenges_played: 22, // TODO: Get from database
        updated_at: new Date().toISOString(),
      } as UserStats;
    },
    enabled: !!currentUser && !!userProfileQuery.data,
  });

  // Mutations using tRPC
  const joinTournamentMutation = trpc.tournaments.join.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
  });

  const likeActivityMutation = trpc.social.interact.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });

  const joinClubMutation = trpc.clubs.join.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
    },
  });

  // Effects
  useEffect(() => {
    if (userQuery.data && userQuery.data !== currentUser) {
      setCurrentUser(userQuery.data);
      setIsAuthenticated(true);
    }
  }, [userQuery.data, currentUser]);

  // Actions
  const updateUserProfile = useCallback(async (updates: Partial<User>) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...updates, updated_at: new Date().toISOString() };
    await setItem('currentUser', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    queryClient.invalidateQueries({ queryKey: ['currentUser'] });
  }, [currentUser, queryClient]);

  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    queryClient.invalidateQueries({ queryKey: ['clubs'] });
    queryClient.invalidateQueries({ queryKey: ['activities'] });
    queryClient.invalidateQueries({ queryKey: ['userStats'] });
  }, [queryClient]);

  return {
    // User data
    currentUser,
    isAuthenticated,
    userStats: userStatsQuery.data,
    
    // Queries
    tournaments: tournamentsQuery.data?.tournaments || [],
    clubs: clubsQuery.data?.clubs || [],
    activities: socialFeedQuery.data?.feed || [],
    
    // Loading states
    isLoadingTournaments: tournamentsQuery.isLoading,
    isLoadingClubs: clubsQuery.isLoading,
    isLoadingActivities: socialFeedQuery.isLoading,
    isLoadingUserStats: userStatsQuery.isLoading,
    
    // Actions
    joinTournament: joinTournamentMutation.mutate,
    likeActivity: likeActivityMutation.mutate,
    joinClub: joinClubMutation.mutate,
    updateUserProfile,
    refreshData,
    
    // Mutation states
    isJoiningTournament: joinTournamentMutation.isPending,
    isLikingActivity: likeActivityMutation.isPending,
    isJoiningClub: joinClubMutation.isPending,
  };
});

// Convenience hooks
export function useCurrentUser() {
  const { currentUser, isAuthenticated, userStats } = useSABOData();
  return { currentUser, isAuthenticated, userStats };
}

export function useTournaments() {
  const { tournaments, isLoadingTournaments, joinTournament, isJoiningTournament } = useSABOData();
  return { tournaments, isLoading: isLoadingTournaments, joinTournament, isJoining: isJoiningTournament };
}

export function useClubs() {
  const { clubs, isLoadingClubs, joinClub, isJoiningClub } = useSABOData();
  return { clubs, isLoading: isLoadingClubs, joinClub, isJoining: isJoiningClub };
}

export function useSocialFeed() {
  const { activities, isLoadingActivities, likeActivity, isLikingActivity } = useSABOData();
  return { activities, isLoading: isLoadingActivities, likeActivity, isLiking: isLikingActivity };
}