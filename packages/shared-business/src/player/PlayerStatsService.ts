import { SupabaseClient } from '@supabase/supabase-js';

export interface PlayerStats {
  elo: number;
  spa_points: number;
  ranking_position: number;
  total_matches: number;
  wins: number;
  losses: number;
  win_rate: number;
  current_streak: number;
  best_streak: number;
  tournaments_played: number;
  tournaments_won: number;
  total_earnings: number;
}

export interface TournamentStatus {
  id: string;
  name: string;
  status: 'ready' | 'live' | 'done';
  entry_fee: number;
  prize_pool: number;
  participants: number;
  max_participants: number;
  start_date: Date;
  rank_requirement: string;
}

export interface PlayerAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;  
  earned_date: Date;
  category: 'tournament' | 'ranking' | 'streak' | 'milestone';
}

export interface PlayerDashboardData {
  stats: PlayerStats;
  recent_tournaments: TournamentStatus[];
  achievements: PlayerAchievement[];
  rank_info: {
    current_rank: string;
    next_rank: string;
    progress_percentage: number;
    elo_needed: number;
  };
}

/**
 * SABO Arena Player Stats Service
 * 
 * Manages player statistics, achievements, and dashboard data for mobile app
 * Based on mobile UI requirements from screenshots
 */
export class PlayerStatsService {
  private supabase: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  /**
   * Get complete player dashboard data
   */
  async getPlayerDashboard(userId: string): Promise<{
    data: PlayerDashboardData | null;
    error?: string;
  }> {
    try {
      // Get player profile with stats
      const { data: profile, error: profileError } = await this.supabase
        .from('profiles')
        .select(`
          *,
          user_stats!user_stats_user_id_fkey(*)
        `)
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;

      // Get player ranking position
      const { data: rankingData, error: rankingError } = await this.supabase
        .rpc('get_player_ranking_position', { player_id: userId });

      // Get recent tournaments
      const { data: tournaments, error: tournamentsError } = await this.supabase
        .from('tournament_participants')
        .select(`
          tournaments(
            id,
            name,
            status,
            entry_fee,
            prize_pool,
            max_participants,
            start_date,
            rank_requirement
          )
        `)
        .eq('player_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent achievements  
      const { data: achievements, error: achievementsError } = await this.supabase
        .from('user_achievements')
        .select(`
          *,
          achievements(
            id,
            title,
            description,
            icon,
            category
          )
        `)
        .eq('user_id', userId)
        .order('earned_at', { ascending: false })
        .limit(10);

      // Calculate stats
      const stats = await this.calculatePlayerStats(userId, profile);
      
      // Calculate rank info
      const rankInfo = this.calculateRankProgress(stats.elo);

      // Transform tournaments
      const recentTournaments: TournamentStatus[] = (tournaments || [])
        .map(tp => tp.tournaments)
        .filter(Boolean)
        .map(tournament => ({
          id: tournament.id,
          name: tournament.name,
          status: this.mapTournamentStatus(tournament.status),
          entry_fee: tournament.entry_fee || 0,
          prize_pool: tournament.prize_pool || 0,
          participants: 0, // Would need separate query
          max_participants: tournament.max_participants || 16,
          start_date: new Date(tournament.start_date),
          rank_requirement: tournament.rank_requirement || 'Open',
        }));

      // Transform achievements
      const playerAchievements: PlayerAchievement[] = (achievements || [])
        .filter(ua => ua.achievements)
        .map(ua => ({
          id: ua.achievements.id,
          title: ua.achievements.title,
          description: ua.achievements.description,
          icon: ua.achievements.icon || '🏆',
          earned_date: new Date(ua.earned_at),
          category: ua.achievements.category as any,
        }));

      const dashboardData: PlayerDashboardData = {
        stats,
        recent_tournaments: recentTournaments,
        achievements: playerAchievements,
        rank_info: rankInfo,
      };

      return { data: dashboardData };

    } catch (error) {
      console.error('Error fetching player dashboard:', error);
      return { data: null, error: 'Failed to load player dashboard' };
    }
  }

  /**
   * Get player stats for profile display
   */
  async getPlayerStats(userId: string): Promise<{
    data: PlayerStats | null;
    error?: string;
  }> {
    try {
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!profile) {
        return { data: null, error: 'Player not found' };
      }

      const stats = await this.calculatePlayerStats(userId, profile);
      return { data: stats };

    } catch (error) {
      console.error('Error fetching player stats:', error);
      return { data: null, error: 'Failed to load player stats' };
    }
  }

  /**
   * Update player stats after match/tournament
   */
  async updatePlayerStats(userId: string, updates: Partial<PlayerStats>): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const { error } = await this.supabase
        .from('user_stats')
        .upsert({
          user_id: userId,
          ...updates,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      return { success: true };

    } catch (error) {
      console.error('Error updating player stats:', error);
      return { success: false, error: 'Failed to update stats' };
    }
  }

  /**
   * Get player tournament history with status
   */
  async getTournamentHistory(userId: string, status?: 'ready' | 'live' | 'done'): Promise<{
    data: TournamentStatus[];
    error?: string;
  }> {
    try {
      let query = this.supabase
        .from('tournament_participants')
        .select(`
          tournaments(
            id,
            name,
            status,
            entry_fee,
            prize_pool,
            max_participants,
            start_date,
            rank_requirement
          )
        `)
        .eq('player_id', userId);

      if (status) {
        const dbStatus = this.mapMobileStatusToDb(status);
        query = query.eq('tournaments.status', dbStatus);
      }

      const { data: tournaments, error } = await query
        .order('created_at', { ascending: false });

      if (error) throw error;

      const tournamentStatuses: TournamentStatus[] = (tournaments || [])
        .map(tp => tp.tournaments)
        .filter(Boolean)
        .map(tournament => ({
          id: tournament.id,
          name: tournament.name,
          status: this.mapTournamentStatus(tournament.status),
          entry_fee: tournament.entry_fee || 0,
          prize_pool: tournament.prize_pool || 0,
          participants: 0,
          max_participants: tournament.max_participants || 16,
          start_date: new Date(tournament.start_date),
          rank_requirement: tournament.rank_requirement || 'Open',
        }));

      return { data: tournamentStatuses };

    } catch (error) {
      console.error('Error fetching tournament history:', error);
      return { data: [], error: 'Failed to load tournament history' };
    }
  }

  // Private helper methods
  private async calculatePlayerStats(userId: string, profile: any): Promise<PlayerStats> {
    // Get match statistics
    const { data: matches } = await this.supabase
      .from('matches')
      .select('*')
      .or(`player1_id.eq.${userId},player2_id.eq.${userId}`)
      .eq('status', 'completed');

    const totalMatches = matches?.length || 0;
    const wins = matches?.filter(m => m.winner_id === userId).length || 0;
    const losses = totalMatches - wins;
    const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

    // Calculate current streak
    const recentMatches = matches?.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ) || [];
    
    let currentStreak = 0;
    let isWinStreak = true;
    
    for (const match of recentMatches) {
      const isWin = match.winner_id === userId;
      if (currentStreak === 0) {
        isWinStreak = isWin;
        currentStreak = 1;
      } else if (isWin === isWinStreak) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Get tournament stats
    const { data: tournamentParticipations } = await this.supabase
      .from('tournament_participants')
      .select('tournaments(*)')
      .eq('player_id', userId);

    const tournamentsPlayed = tournamentParticipations?.length || 0;
    const tournamentsWon = tournamentParticipations?.filter(tp => 
      tp.tournaments?.winner_id === userId
    ).length || 0;

    return {
      elo: profile?.current_elo || 1200,
      spa_points: profile?.spa_points || 0,
      ranking_position: 89, // Would be calculated from ranking query
      total_matches: totalMatches,
      wins,
      losses,
      win_rate: Math.round(winRate),
      current_streak: isWinStreak ? currentStreak : 0,
      best_streak: 0, // Would need to be calculated or stored
      tournaments_played: tournamentsPlayed,
      tournaments_won: tournamentsWon,
      total_earnings: profile?.total_earnings || 0,
    };
  }

  private calculateRankProgress(elo: number) {
    // Based on SABO ranking system: Bronze -> Silver -> Gold -> Diamond -> Master
    const rankThresholds = [
      { rank: 'Bronze', min: 0, max: 1199, next: 'Silver' },
      { rank: 'Silver', min: 1200, max: 1399, next: 'Gold' },
      { rank: 'Gold', min: 1400, max: 1599, next: 'Diamond' },
      { rank: 'Diamond', min: 1600, max: 1799, next: 'Master' },
      { rank: 'Master', min: 1800, max: 9999, next: 'Grandmaster' },
    ];

    const currentRankInfo = rankThresholds.find(r => elo >= r.min && elo <= r.max) || rankThresholds[0];
    const progress = currentRankInfo.max === 9999 ? 100 : 
      Math.round(((elo - currentRankInfo.min) / (currentRankInfo.max - currentRankInfo.min)) * 100);
    const eloNeeded = currentRankInfo.max === 9999 ? 0 : currentRankInfo.max - elo + 1;

    return {
      current_rank: currentRankInfo.rank.charAt(0), // G for Gold, etc.
      next_rank: currentRankInfo.next,
      progress_percentage: Math.max(0, progress),
      elo_needed: Math.max(0, eloNeeded),
    };
  }

  private mapTournamentStatus(dbStatus: string): 'ready' | 'live' | 'done' {
    switch (dbStatus) {
      case 'registration_open':
      case 'upcoming':
        return 'ready';
      case 'ongoing':
      case 'active':
        return 'live';
      case 'completed':
      case 'finished':
        return 'done';
      default:
        return 'ready';
    }
  }

  private mapMobileStatusToDb(mobileStatus: 'ready' | 'live' | 'done'): string {
    switch (mobileStatus) {
      case 'ready':
        return 'registration_open';
      case 'live':
        return 'ongoing';
      case 'done':
        return 'completed';
      default:
        return 'registration_open';
    }
  }
}

export default PlayerStatsService;