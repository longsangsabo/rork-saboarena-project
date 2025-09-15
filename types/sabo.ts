// SABO Arena - Core Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  rank: string;
  elo: number;
  spa_points: number;
  ranking_position: number;
  total_matches: number;
  wins: number;
  losses: number;
  created_at: string;
  updated_at: string;
}

export interface Tournament {
  id: string;
  title: string;
  description?: string;
  prize_pool: number;
  entry_fee: number;
  max_players: number;
  current_players: number;
  min_rank: string;
  max_rank: string;
  location: string;
  club_id?: string;
  club_name?: string;
  start_time: string;
  end_time: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Club {
  id: string;
  name: string;
  description?: string;
  location: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  image_url?: string;
  member_count: number;
  total_prize_pool: number;
  active_challenges: number;
  created_at: string;
  updated_at: string;
}

export interface Challenge {
  id: string;
  challenger_id: string;
  challenged_id: string;
  challenger: User;
  challenged: User;
  stake_amount: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  winner_id?: string;
  location?: string;
  scheduled_time?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// API Challenge interface for tRPC responses
export interface ApiChallenge {
  id: string;
  type: 'giaoluu' | 'thachdau';
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    rank: string;
    elo: number;
    isOnline: boolean;
  };
  club: {
    id: string;
    name: string;
    location: string;
    avatar: string;
  };
  message: string;
  created_at: string;
  likes: number;
  comments: number;
  shares: number;
  is_liked: boolean;
}

// Legacy Challenge interface for backward compatibility
export interface LegacyChallenge {
  id: string;
  status: 'waiting' | 'ready' | 'live' | 'finished';
  date: string;
  time: string;
  handicap: string;
  spa: number;
  raceToScore: number;
  tableNumber: number;
  player1?: {
    id: string;
    name: string;
    avatar: string;
    rank: string;
    isOnline: boolean;
  } | null;
  player2?: {
    id: string;
    name: string;
    avatar: string;
    rank: string;
    isOnline: boolean;
  } | null;
}

export interface Activity {
  id: string;
  user_id: string;
  user: User;
  type: 'tournament_join' | 'challenge_sent' | 'challenge_won' | 'rank_up' | 'achievement';
  title: string;
  description: string;
  metadata?: Record<string, any>;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  activity_id: string;
  user_id: string;
  user: User;
  content: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'tournament' | 'challenge' | 'social' | 'system';
  is_read: boolean;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface UserStats {
  user_id: string;
  elo: number;
  spa_points: number;
  ranking_position: number;
  total_matches: number;
  wins: number;
  losses: number;
  win_rate: number;
  current_streak: number;
  best_streak: number;
  tournaments_won: number;
  tournaments_played: number;
  challenges_won: number;
  challenges_played: number;
  updated_at: string;
}

export interface RankInfo {
  code: string;
  name: string;
  min_elo: number;
  max_elo: number;
  color: string;
  icon: string;
}

export const RANKS: RankInfo[] = [
  { code: 'K', name: 'Khởi đầu', min_elo: 0, max_elo: 999, color: '#8B5CF6', icon: '🌱' },
  { code: 'E', name: 'Sơ cấp', min_elo: 1000, max_elo: 1199, color: '#06B6D4', icon: '⭐' },
  { code: 'D', name: 'Trung cấp', min_elo: 1200, max_elo: 1399, color: '#10B981', icon: '💎' },
  { code: 'C', name: 'Cao cấp', min_elo: 1400, max_elo: 1599, color: '#F59E0B', icon: '🏆' },
  { code: 'B', name: 'Chuyên gia', min_elo: 1600, max_elo: 1799, color: '#EF4444', icon: '👑' },
  { code: 'A', name: 'Thạc sĩ', min_elo: 1800, max_elo: 1999, color: '#8B5CF6', icon: '🎯' },
  { code: 'S', name: 'Đại sư', min_elo: 2000, max_elo: 2199, color: '#F97316', icon: '🔥' },
  { code: 'G', name: 'Huyền thoại', min_elo: 2200, max_elo: 9999, color: '#DC2626', icon: '⚡' },
];

export function getRankByElo(elo: number): RankInfo {
  return RANKS.find(rank => elo >= rank.min_elo && elo <= rank.max_elo) || RANKS[0];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function getTimeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Vừa xong';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  return past.toLocaleDateString('vi-VN');
}