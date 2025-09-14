// Re-export the auth hooks from shared-auth package for easy access
export { AuthProvider, useAuth, useAdminAuth } from '../lib/shared-auth/src';

// Additional game-specific user data interface that extends the basic User
export interface GameUserData {
  user_id: string;
  elo: number;
  spa_points: number;
  rank: string;
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
}